import { LocationHeader, LocationLayout } from "@components";

// The engine's generic scene at a stop; the destinations are in the navigation
export default function FastTravelScene() {
  return (
    <LocationLayout>
      <LocationHeader title="Fast travel" />
    </LocationLayout>
  );
}

FastTravelScene.displayName = "Fast travel";
