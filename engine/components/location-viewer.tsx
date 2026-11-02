import { useLocations } from "@systems";
import "./location-viewer.css";

export default function LocationViewer() {
  const { currentLocation: CurrentLocation } = useLocations();

  return (
    <div className="location-viewer">
      <CurrentLocation />
    </div>
  );
}
