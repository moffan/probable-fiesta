import type { SceneComponent } from "@systems";
import { createContext, useContext } from "react";

export type Exits = SceneComponent[];

// What the navigation viewer shows, and what choosing it does
export type NavigationOption =
  | { kind: "move"; location: SceneComponent; label: string }
  | { kind: "fastTravel"; network: string; mode: string; label: string };

export type FastTravelStop = {
  location: SceneComponent;
  known: boolean;
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

export type LocationSystemContext = {
  currentLocation: SceneComponent;
  navigationOptions: NavigationOption[];
  navigate: (option: NavigationOption) => void;
  changeCurrentLocation: (location: SceneComponent) => void;
  setExits: (exits: Exits) => void;
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

  const { changeCurrentLocation, registerFastTravel } = ctx;

  return { changeCurrentLocation, registerFastTravel };
}

// For the engine's own components only, see @systems/internal
export function useLocationInternals() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  const { currentLocation, navigationOptions, navigate } = ctx;

  return { currentLocation, navigationOptions, navigate };
}
