import { useCallback, useMemo, useState } from "react";
import {
  LocationContext,
  type LocationSystemContext,
  type NavigationOptions,
} from "./location-context";

type LocationsProviderProps = {
  children: React.ReactNode;
  initialLocation: () => React.ReactNode;
};

type GameLocation = () => React.ReactNode;

export default function LocationsProvider(props: LocationsProviderProps) {
  const { children, initialLocation } = props;
  const [currentLocation, setCurrentLocation] = useState<GameLocation>(
    () => initialLocation,
  );

  const [navigationOptions, setNavigationOptions] = useState<NavigationOptions>([]);

  const changeCurrentLocation = useCallback(
    (location: () => React.ReactNode) => {
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
