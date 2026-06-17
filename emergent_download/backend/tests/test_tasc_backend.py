"""Backend regression tests for TASC Automation API."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # Fallback to frontend/.env
    from pathlib import Path
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break

BASE_URL = (BASE_URL or "").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health / Root ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "service" in data
        assert data["service"]

    def test_health(self, session):
        r = session.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("resend_configured") is True
        assert data.get("web3forms_configured") is True
        assert data.get("recipient") == "info@tascautomation.com"


# ---------- Contact ----------
class TestContact:
    unique_tag = f"TEST_{uuid.uuid4().hex[:8]}"

    def test_create_contact_valid(self, session):
        payload = {
            "name": f"TEST_User_{self.unique_tag}",
            "email": f"test_{self.unique_tag}@example.com",
            "organization": f"TEST_Org_{self.unique_tag}",
            "project_scope": f"Automated regression scope {self.unique_tag}",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 201, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert "id" in data and data["id"]
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["organization"] == payload["organization"]
        assert data["project_scope"] == payload["project_scope"]
        assert data.get("email_status") in {"sent", "failed", "skipped_no_key"}
        assert "_id" not in data
        # store for later
        TestContact._created_id = data["id"]
        TestContact._created_email = payload["email"]

    def test_invalid_email_returns_422(self, session):
        payload = {
            "name": "TEST_user",
            "email": "not-an-email",
            "organization": "TEST_Org",
            "project_scope": "scope",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_missing_fields_returns_422(self, session):
        payload = {"name": "TEST_user"}
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_list_contacts_sorted_and_no_objectid(self, session):
        # Allow a moment for persistence
        time.sleep(0.5)
        r = session.get(f"{API}/contact", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        # no _id key
        for it in items:
            assert "_id" not in it
            assert "id" in it
            assert "created_at" in it
        # sorted desc by created_at
        timestamps = [it["created_at"] for it in items]
        assert timestamps == sorted(timestamps, reverse=True), (
            "Contacts not sorted by created_at desc"
        )
        # Newest item should be the one we just created
        created_id = getattr(TestContact, "_created_id", None)
        if created_id:
            assert items[0]["id"] == created_id, (
                f"Latest item id {items[0]['id']} != newly created {created_id}"
            )
