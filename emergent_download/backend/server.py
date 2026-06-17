from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'info@tascautomation.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Web3Forms setup (free, no domain verification — primary delivery channel)
WEB3FORMS_ACCESS_KEY = os.environ.get('WEB3FORMS_ACCESS_KEY', '').strip()

# Create the main app without a prefix
app = FastAPI(title="TASC Automation API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    organization: str = Field(..., min_length=1, max_length=200)
    project_scope: str = Field(..., min_length=1, max_length=4000)


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    organization: str
    project_scope: str
    email_status: str = "pending"
    email_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def build_email_html(payload: ContactSubmissionCreate, submission_id: str) -> str:
    return f"""
    <table style="width:100%;max-width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#0D1117;background:#ffffff;border:1px solid #2B313A;">
      <tr><td style="padding:24px 24px 8px 24px;background:#0D1117;color:#E6EDF3;">
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:.2em;color:#00C2FF;">[ TASC // INCOMING TRANSMISSION ]</div>
        <h2 style="margin:8px 0 0 0;font-size:20px;color:#E6EDF3;">New Consultation Request</h2>
      </td></tr>
      <tr><td style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;width:160px;color:#2B313A;font-weight:bold;">NAME</td><td style="padding:8px 0;">{payload.name}</td></tr>
          <tr><td style="padding:8px 0;color:#2B313A;font-weight:bold;">EMAIL</td><td style="padding:8px 0;">{payload.email}</td></tr>
          <tr><td style="padding:8px 0;color:#2B313A;font-weight:bold;">ORGANIZATION</td><td style="padding:8px 0;">{payload.organization}</td></tr>
          <tr><td style="padding:8px 0;color:#2B313A;font-weight:bold;vertical-align:top;">PROJECT SCOPE</td><td style="padding:8px 0;white-space:pre-wrap;">{payload.project_scope}</td></tr>
          <tr><td style="padding:8px 0;color:#2B313A;font-weight:bold;">REF ID</td><td style="padding:8px 0;font-family:monospace;">{submission_id}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 24px;background:#0D1117;color:#2B313A;font-size:11px;font-family:monospace;">
        TASC // Tenacious Automation Solutions &amp; Consulting · Transforming Industrial Logix
      </td></tr>
    </table>
    """


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "TASC Automation API", "status": "online"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "web3forms_configured": bool(WEB3FORMS_ACCESS_KEY),
        "resend_configured": bool(RESEND_API_KEY),
        "recipient": RECIPIENT_EMAIL,
    }


def _send_via_web3forms(payload: ContactSubmissionCreate, submission_id: str) -> dict:
    """Sync POST to Web3Forms. Returns dict with success/error fields."""
    data = {
        "access_key": WEB3FORMS_ACCESS_KEY,
        "subject": f"[TASC] New Consultation — {payload.organization}",
        "from_name": f"TASC Website · {payload.name}",
        "replyto": payload.email,
        # Fields shown in the email body:
        "Name": payload.name,
        "Email": payload.email,
        "Organization": payload.organization,
        "Project Scope": payload.project_scope,
        "Reference ID": submission_id,
    }
    r = requests.post("https://api.web3forms.com/submit", json=data, timeout=10)
    return r.json() if r.headers.get("content-type", "").startswith("application/json") else {"success": r.ok, "raw": r.text}


@api_router.post("/contact", response_model=ContactSubmission, status_code=201)
async def create_contact(payload: ContactSubmissionCreate):
    submission = ContactSubmission(
        name=payload.name,
        email=payload.email,
        organization=payload.organization,
        project_scope=payload.project_scope,
    )

    # Delivery preference order: Web3Forms (instant, no domain check) → Resend → skip.
    if WEB3FORMS_ACCESS_KEY:
        try:
            result = await asyncio.to_thread(_send_via_web3forms, payload, submission.id)
            if result.get("success"):
                submission.email_status = "sent"
                submission.email_id = str(result.get("data", {}).get("id") or "")[:64] or None
            else:
                logger.error(f"Web3Forms returned non-success: {result}")
                submission.email_status = "failed"
        except Exception as e:
            logger.error(f"Web3Forms send failed: {e}")
            submission.email_status = "failed"
    elif RESEND_API_KEY:
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [RECIPIENT_EMAIL],
                "reply_to": payload.email,
                "subject": f"[TASC] New Consultation — {payload.organization}",
                "html": build_email_html(payload, submission.id),
            }
            email_result = await asyncio.to_thread(resend.Emails.send, params)
            submission.email_status = "sent"
            submission.email_id = email_result.get("id") if isinstance(email_result, dict) else None
        except Exception as e:
            logger.error(f"Resend send failed: {e}")
            submission.email_status = "failed"
    else:
        submission.email_status = "skipped_no_key"

    # Persist to MongoDB
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.contact_submissions.insert_one(doc)
    except Exception as e:
        logger.error(f"Mongo insert failed: {e}")
        raise HTTPException(status_code=500, detail="Storage failure")

    return submission


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contacts(limit: int = 50):
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            try:
                d['created_at'] = datetime.fromisoformat(d['created_at'])
            except Exception:
                pass
    return docs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
