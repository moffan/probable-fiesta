import type { SceneComponent } from "@systems";
import { createContext, useContext } from "react";

export type NavigationOptions = SceneComponent[];

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
  navigationOptions: NavigationOptions;
  changeCurrentLocation: (location: SceneComponent) => void;
  setExits: (options: NavigationOptions) => void;
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

  const {
    currentLocation,
    navigationOptions,
    changeCurrentLocation,
    setExits,
  } = ctx;

  return {
    currentLocation,
    navigationOptions,
    changeCurrentLocation,
    setExits,
  };
}

export function useConfigureLocations() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  const { registerFastTravel } = ctx;

  return { registerFastTravel };
}
