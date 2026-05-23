import { useLocations } from "@systems";
import "./navigation-viewer.css";

export default function NavigationViewer() {
  const { navigationOptions, changeCurrentLocation } = useLocations();

  return (
    <div className="navigation-viewer">
      {navigationOptions.map((l) => (
        <button key={l.name} className="navigation-viewer__button" onClick={() => changeCurrentLocation(l)}>
          {l.displayName}
        </button>
      ))}
    </div>
  );
}
