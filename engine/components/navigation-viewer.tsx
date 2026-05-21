import { useLocations } from "@systems";

export default function NavigationViewer() {
  const { navigationOptions, changeCurrentLocation } = useLocations();

  return (
    <>
      {navigationOptions.map((l) => (
        <button key={l.name} onClick={() => changeCurrentLocation(l)}>
          <div>{l.displayName}</div>
        </button>
      ))}
    </>
  );
}
