import { useCallback, useMemo, useState } from "react";
import {
  LocationContext,
  type Exits,
  type LocationSystemContext,
  type NavigationOption,
  type RegisterFastTravelOptions,
  type RegisterFastTravelSettings,
  type FastTravelNetworks,
  type FastTravelStop,
} from "./location-context";
import type { SceneComponent } from "@systems";

type LocationsProviderProps = {
  children: React.ReactNode;
  initialLocation: SceneComponent;
  // The scene shown at a stop, until the game registers its own
  fastTravelScene: SceneComponent;
};

type FastTravel = {
  network: string;
  mode: string;
};

const registerFastTravelSettings: RegisterFastTravelSettings = {
  network: "general",
  replace: false,
};

function labelOf(location: SceneComponent) {
  return location.displayName ?? location.name;
}

function fastTravelPoint(mode: string, stop: FastTravelStop) {
  return `${mode}:${stop.location.locationId}`;
}

export default function LocationsProvider(props: LocationsProviderProps) {
  const { children, initialLocation, fastTravelScene } = props;
  const [currentLocation, setCurrentLocation] = useState<SceneComponent>(
    () => initialLocation,
  );

  const [previousLocation, setPreviousLocation] =
    useState<SceneComponent | null>(null);

  const [exits, setExits] = useState<Exits>([]);

  const [fastTravelNetworks, setFastTravelNetworks] = useState<FastTravelNetworks>(
    {},
  );

  // Known stops, as "mode:locationId"
  const [fastTravelPoints, setFastTravelPoints] = useState<string[]>([]);

  // The stop the PC chose in the navigation, while she is in the scene
  const [fastTravel, setFastTravel] = useState<FastTravel | null>(null);

  const changeCurrentLocation = useCallback(
    (location: SceneComponent) => {
      setExits([]);
      setFastTravel(null);
      setPreviousLocation(() => currentLocation);
      setCurrentLocation(() => location);
    },
    [currentLocation],
  );

  const navigate = useCallback(
    (option: NavigationOption) => {
      if (option.kind === "move") {
        changeCurrentLocation(option.location);
        return;
      }

      const { network, mode } = option;
      const stops = fastTravelNetworks[network]?.[mode] ?? [];

      setFastTravelPoints((points) => {
        // The first time she uses a stop of this mode in this network, the
        // stops registered as known become known to her
        const firstUse = !stops.some((stop) =>
          points.includes(fastTravelPoint(mode, stop)),
        );
        const learned = stops
          .filter(
            (stop) =>
              (firstUse && stop.known) || stop.location === currentLocation,
          )
          .map((stop) => fastTravelPoint(mode, stop))
          .filter((point) => !points.includes(point));

        return learned.length === 0 ? points : [...points, ...learned];
      });

      changeCurrentLocation(fastTravelScene);
      setFastTravel({ network, mode });
    },
    [changeCurrentLocation, currentLocation, fastTravelNetworks, fastTravelScene],
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

      for (const stop of stops) {
        if (stop.location.locationId == null) {
          console.warn(`Fast travel stop without a locationId: ${labelOf(stop.location)}`);
        }
      }

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

  const navigationOptions = useMemo<NavigationOption[]>(() => {
    const moveTo = (location: SceneComponent, label: string) => ({
      kind: "move" as const,
      location,
      label: location === previousLocation ? "Back" : label,
    });

    if (fastTravel != null) {
      const { network, mode } = fastTravel;
      const destinations = (fastTravelNetworks[network]?.[mode] ?? [])
        .filter(
          (stop) =>
            stop.location !== previousLocation &&
            fastTravelPoints.includes(fastTravelPoint(mode, stop)),
        )
        .map((stop) =>
          moveTo(stop.location, stop.name ?? labelOf(stop.location)),
        );

      return previousLocation == null
        ? destinations
        : [...destinations, moveTo(previousLocation, "Back")];
    }

    const stops = Object.entries(fastTravelNetworks).flatMap(
      ([network, modes]) =>
        Object.entries(modes)
          .filter(([, modeStops]) =>
            modeStops.some((stop) => stop.location === currentLocation),
          )
          .map(([mode]) => ({
            kind: "fastTravel" as const,
            network,
            mode,
            label: mode,
          })),
    );

    return [...exits.map((exit) => moveTo(exit, labelOf(exit))), ...stops];
  }, [
    currentLocation,
    previousLocation,
    exits,
    fastTravel,
    fastTravelNetworks,
    fastTravelPoints,
  ]);

  const locationSystem = useMemo<LocationSystemContext>(
    () => ({
      currentLocation,
      setExits,
      navigationOptions,
      navigate,
      changeCurrentLocation,
      fastTravelNetworks,
      registerFastTravel,
    }),
    [
      currentLocation,
      navigationOptions,
      navigate,
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
