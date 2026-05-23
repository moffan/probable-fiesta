import { useLocations } from "@systems";

export default function LocationHeader() {
  const { currentLocation } = useLocations();
  return <h1 className="location-header">{currentLocation.displayName}</h1>;
}
