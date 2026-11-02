import { useLocationInternals } from "@systems/internal";
import "./navigation-viewer.css";

export default function NavigationViewer() {
  const { navigationOptions, navigate } = useLocationInternals();

  return (
    <div className="navigation-viewer">
      {navigationOptions.map((option) => (
        <button
          key={option.label}
          className="navigation-viewer__button"
          onClick={() => navigate(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
