
import FeaturesSection from "./features/FeaturesSection";
import FlowSection from "./flow/FlowSection";
import GetStartedSection from "./get_started/GetStartedSection";
import HomeSection from "./home/HomeSection";
import RoleSection from "./role/RoleSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HomeSection />
      <FeaturesSection />
      <FlowSection />
      <RoleSection />
      <GetStartedSection />
    </div>
  );
}