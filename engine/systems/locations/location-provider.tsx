import { useCallback, useMemo, useState } from "react";
import {
  LocationContext,
  type LocationSystemContext,
  type NavigationOptions,
  type RegisterFastTravelOptions,
  type RegisterFastTravelSettings,
  type FastTravelNetworks,
  type FastTravelStop,
} from "./location-context";
import type { SceneComponent } from "@systems";

type LocationsProviderProps = {
  children: React.ReactNode;
  initialLocation: SceneComponent;
};

const registerFastTravelSettings: RegisterFastTravelSettings = {
  network: "general",
  replace: false,
};

export default function LocationsProvider(props: LocationsProviderProps) {
  const { children, initialLocation } = props;
  const [currentLocation, setCurrentLocation] = useState<SceneComponent>(
    () => initialLocation,
  );

  const [navigationOptions, setExits] = useState<NavigationOptions>(
    [],
  );

  const [fastTravelNetworks, setFastTravelNetworks] = useState<FastTravelNetworks>(
    {},
  );

  const changeCurrentLocation = useCallback(
    (location: SceneComponent) => {
      setExits([]);
      setCurrentLocation(() => location);
    },
    [],
  );

  const registerFastTravel = useCallback(
    (
      mode: string,
      stops: FastTravelStop[],
      options?: RegisterFastTravelOptions,
    ) => {
      const { network, replace } = {
        ...registerFastTravelSettings,
        ...(typeof options === "string" ? { network: options } : options),
      };

      setFastTravelNetworks((networks) => {
        // Without replace, a stop registered again for the same location wins
        const kept = replace
          ? []
          : (networks[network]?.[mode] ?? []).filter(
              (stop) => !stops.some((s) => s.location === stop.location),
            );

        return {
          ...networks,
          [network]: { ...networks[network], [mode]: [...kept, ...stops] },
        };
      });
    },
    [],
  );

  const locationSystem = useMemo<LocationSystemContext>(
    () => ({
      currentLocation,
      setExits,
      navigationOptions,
      changeCurrentLocation,
      fastTravelNetworks,
      registerFastTravel,
    }),
    [
      currentLocation,
      navigationOptions,
      changeCurrentLocation,
      fastTravelNetworks,
      registerFastTravel,
    ],
  );

  return (
    <LocationContext.Provider value={locationSystem}>
      {children}
    </LocationContext.Provider>
  );
}
