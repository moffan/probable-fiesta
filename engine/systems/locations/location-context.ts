import React, { createContext, useContext } from "react";

export type NavigationOption = {
  name: string;
  location: () => React.ReactNode;
};

export type NavigationOptions = NavigationOption[];

export type LocationSystemContext = {
  currentLocation: () => React.ReactNode;
  navigationOptions: NavigationOptions;
  changeCurrentLocation: (location: () => React.ReactNode) => void;
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
