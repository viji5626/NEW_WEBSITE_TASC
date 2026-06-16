import Hero from "@/components/site/Hero";
import Capabilities from "@/components/site/Capabilities";
import SoftwareExpertise from "@/components/site/SoftwareExpertise";
import Industries from "@/components/site/Industries";
import Cases from "@/components/site/Cases";
import Method from "@/components/site/Method";
import Amc from "@/components/site/Amc";
import ConsultingSection from "@/components/site/ConsultingSection";
import Founder from "@/components/site/Founder";
import Contact from "@/components/site/Contact";

export default function Home() {
  return (
    <main className="relative z-10 pt-20">
      <Hero />
      <Capabilities />
      <SoftwareExpertise />
      <Industries />
      <Cases />
      <Method />
      <Amc />
      <ConsultingSection />
      <Founder />
      <Contact />
    </main>
  );
}
