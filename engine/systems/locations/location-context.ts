import type { SceneComponent } from "@systems";
import { createContext, useContext } from "react";


export type NavigationOptions = SceneComponent[];

export type LocationSystemContext = {
  currentLocation: SceneComponent;
  navigationOptions: NavigationOptions;
  changeCurrentLocation: (location: SceneComponent) => void;
  setNavigationOptions: (options: NavigationOptions) => void;
};

export const LocationContext = createContext<LocationSystemContext | null>(
  null,
);

export function useLocations() {
  const ctx = useContext(LocationContext);
  if (ctx == null) {
    throw new Error("locations failed to initialize");
  }

  return ctx;
}
