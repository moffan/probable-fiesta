import { useLocationInternals } from "@systems/internal";
import "./location-viewer.css";

export default function LocationViewer() {
  const { currentLocation: CurrentLocation } = useLocationInternals();

  return (
    <div className="location-viewer">
      <CurrentLocation />
    </div>
  );
}
