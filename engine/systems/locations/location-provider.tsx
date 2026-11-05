import { useCallback, useMemo, useRef, useState } from "react";
import {
  LocationContext,
  type Exits,
  type LocationState,
  type LocationSystemContext,
  type SetExitsOptions,
  type SetExitsSettings,
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

type LocationHistory = {
  current: SceneComponent;
  previous: SceneComponent | null;
};

const setExitsSettings: SetExitsSettings = {
  hideParent: false,
};

const registerFastTravelSettings: RegisterFastTravelSettings = {
  network: "general",
  replace: false,
};

function labelOf(location: SceneComponent) {
  return location.displayName ?? location.name;
}

// The full locationIds named by a known-locations entry, which may be
// shortened from the left. The entry must match exactly one location.
function resolveEntry(entry: string, locationIds: string[]) {
  const matches = locationIds.filter(
    (id) => id === entry || id.endsWith(`/${entry}`),
  );
  if (matches.length !== 1) {
    console.warn(
      `Known location "${entry}" matches ${matches.length} locations, expected 1`,
    );
    return [];
  }

  // Every location named in the entry is known, and nothing above it
  const parts = matches[0].split("/");
  const depth = entry.split("/").length;
  return Array.from({ length: depth }, (_, i) =>
    parts.slice(0, parts.length - i).join("/"),
  );
}

function fastTravelPoint(mode: string, stop: FastTravelStop) {
  return `${mode}:${stop.location.locationId}`;
}

export default function LocationsProvider(props: LocationsProviderProps) {
  const { children, initialLocation, fastTravelScene } = props;
  // Kept together so changeCurrentLocation can update both without
  // depending on the current location
  const [{ current: currentLocation, previous: previousLocation }, setHistory] =
    useState<LocationHistory>(() => ({ current: initialLocation, previous: null }));

  const currentLocationId = currentLocation.locationId;

  // Every location in the game, by locationId
  const locations = useRef(new Map<string, SceneComponent>());

  // Every location the PC knows, by full locationId
  const [knownLocationIds, setKnownLocationIds] = useState<string[]>([]);

  const [exits, setExitList] = useState<Exits>([]);

  // The settings the current location gave with its exits. Nothing reads
  // them until entering a node updates the known locations.
  const [, setExitSettings] = useState<SetExitsSettings>(setExitsSettings);

  const setExits = useCallback((list: Exits, options?: SetExitsOptions) => {
    setExitList(list);
    setExitSettings({ ...setExitsSettings, ...options });
  }, []);

  const [fastTravelNetworks, setFastTravelNetworks] = useState<FastTravelNetworks>(
    {},
  );

  // Known stops, as "mode:locationId"
  const [fastTravelPoints, setFastTravelPoints] = useState<string[]>([]);

  // The stop the PC chose in the navigation, while she is in the scene
  const [fastTravel, setFastTravel] = useState<FastTravel | null>(null);

  const changeCurrentLocation = useCallback((location: SceneComponent) => {
    setExits([]);
    setFastTravel(null);
    setHistory(({ current }) => ({ current: location, previous: current }));
  }, [setExits]);

  const navigate = useCallback(
    (option: NavigationOption) => {
      if (option.kind === "move") {
        changeCurrentLocation(option.location);
        return;
      }

      const { network, mode } = option;
      const stops = fastTravelNetworks[network]?.[mode] ?? [];

      setFastTravelPoints((points) => {
        // Fast travel is flat: entering a stop teaches her every stop of
        // this mode in this network
        const learned = stops
          .map((stop) => fastTravelPoint(mode, stop))
          .filter((point) => !points.includes(point));

        return learned.length === 0 ? points : [...points, ...learned];
      });

      changeCurrentLocation(fastTravelScene);
      setFastTravel({ network, mode });
    },
    [changeCurrentLocation, fastTravelNetworks, fastTravelScene],
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

  const registerLocations = useCallback((all: SceneComponent[]) => {
    for (const location of all) {
      const id = location.locationId;
      if (id == null) {
        console.warn(`Location without a locationId: ${labelOf(location)}`);
      } else if (locations.current.has(id) && locations.current.get(id) !== location) {
        console.warn(`Two locations share the locationId "${id}"`);
      } else {
        locations.current.set(id, location);
      }
    }
  }, []);

  // Locations must be registered first, so the ids can be resolved
  const loadLocation = useCallback(
    (location: LocationState) => {
      const ids = [...locations.current.keys()];
      setKnownLocationIds([
        ...new Set(
          location.knownLocations.flatMap((entry) => resolveEntry(entry, ids)),
        ),
      ]);
      setFastTravelPoints(location.fastTravelPoints);

      if (location.currentLocation !== "") {
        const current = locations.current.get(location.currentLocation);
        if (current == null) {
          console.warn(`Unknown current location "${location.currentLocation}"`);
        } else {
          // A loaded game has no previous location to go back to
          setExits([]);
          setFastTravel(null);
          setHistory({ current, previous: null });
        }
      }
    },
    [setExits],
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
      currentLocationId,
      knownLocationIds,
      registerLocations,
      loadLocation,
      setExits,
      navigationOptions,
      navigate,
      changeCurrentLocation,
      fastTravelNetworks,
      registerFastTravel,
    }),
    [
      currentLocation,
      currentLocationId,
      knownLocationIds,
      registerLocations,
      loadLocation,
      setExits,
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
