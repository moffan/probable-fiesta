import type { SceneComponent } from "@systems";
import { createContext, useContext } from "react";

export type Exits = SceneComponent[];

export type SetExitsSettings = {
  // The PC does not learn the way to the parent node on entering
  hideParent: boolean;
};

export type SetExitsOptions = Partial<SetExitsSettings>;

// What the navigation viewer shows, and what choosing it does
export type NavigationOption =
  | { kind: "move"; location: SceneComponent; label: string }
  | { kind: "fastTravel"; network: string; mode: string; label: string };

export type FastTravelStop = {
  location: SceneComponent;
  name?: string;
};

// Stops per mode, e.g. { bus: [...], subway: [...] }
export type FastTravelModes = Record<string, FastTravelStop[]>;
export type FastTravelNetworks = Record<string, FastTravelModes>;

export type RegisterFastTravelSettings = {
  network: string;
  replace: boolean;
};

// A string is the name of the network
export type RegisterFastTravelOptions =
  | string
  | Partial<RegisterFastTravelSettings>;

// The PC's location state, as the game saves and loads it
export type LocationState = {
  // A full locationId, or "" to stay where she is
  currentLocation: string;
  // Paths that may be shortened from the left, e.g.
  // "ravenswood-university/east-hall/second-floor/room-210"
  knownLocations: string[];
  // Known stops, as "mode:locationId"
  fastTravelPoints: string[];
};

export type LocationSystemContext = {
  currentLocation: SceneComponent;
  currentLocationId: string | undefined;
  knownLocationIds: string[];
  registerLocations: (locations: SceneComponent[]) => void;
  loadLocation: (location: LocationState) => void;
  navigationOptions: NavigationOption[];
  navigate: (option: NavigationOption) => void;
  changeCurrentLocation: (location: SceneComponent) => void;
  setExits: (exits: Exits, options?: SetExitsOptions) => void;
  fastTravelNetworks: FastTravelNetworks;
  registerFastTravel: (
    mode: string,
    stops: FastTravelStop[],
    options?: RegisterFastTravelOptions,
  ) => void;
};

export const LocationContext = createContext<LocationSystemContext | null>(
  null,
);

export function useLocations() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  const { setExits } = ctx;

  return { setExits };
}

export function useConfigureLocations() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  const {
    changeCurrentLocation,
    registerFastTravel,
    registerLocations,
    loadLocation,
  } = ctx;

  return {
    changeCurrentLocation,
    registerFastTravel,
    registerLocations,
    loadLocation,
  };
}

// For the engine's own components only, see @systems/internal
export function useLocationInternals() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  const {
    currentLocation,
    currentLocationId,
    knownLocationIds,
    navigationOptions,
    navigate,
  } = ctx;

  return {
    currentLocation,
    currentLocationId,
    knownLocationIds,
    navigationOptions,
    navigate,
  };
}
