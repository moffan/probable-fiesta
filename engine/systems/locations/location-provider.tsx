import { useCallback, useMemo, useState } from "react";
import {
  LocationContext,
  type LocationSystemContext,
  type NavigationOptions,
} from "./location-context";
import type { SceneComponent } from "@systems";

type LocationsProviderProps = {
  children: React.ReactNode;
  initialLocation: SceneComponent;
};

export default function LocationsProvider(props: LocationsProviderProps) {
  const { children, initialLocation } = props;
  const [currentLocation, setCurrentLocation] = useState<SceneComponent>(
    () => initialLocation,
  );

  const [navigationOptions, setNavigationOptions] = useState<NavigationOptions>(
    [],
  );

  const changeCurrentLocation = useCallback(
    (location: SceneComponent) => {
      setNavigationOptions([]);
      setCurrentLocation(() => location);
    },
    [],
  );

  const locations = useMemo<LocationSystemContext>(
    () => ({
      currentLocation,
      setNavigationOptions,
      navigationOptions,
      changeCurrentLocation,
    }),
    [currentLocation, navigationOptions, changeCurrentLocation],
  );

  return (
    <LocationContext.Provider value={locations}>
      {children}
    </LocationContext.Provider>
  );
}
