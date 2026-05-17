import { useLocations } from "@systems";

export default function LocationViewer() {
  const { currentLocation: CurrentLocation } = useLocations();

  return <CurrentLocation />;
}
