import { useLocations } from "@systems";

export default function NavigationViewer() {
  const { navigationOptions, changeCurrentLocation } = useLocations();

  return (
    <>
      {navigationOptions.map((l) => {
        return (
          <button
            key={l.name}
            onClick={() => changeCurrentLocation(l.location)}
          >
            {l.name}
          </button>
        );
      })}
    </>
  );
}
