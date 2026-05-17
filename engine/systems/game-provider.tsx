import type React from "react";
import LocationsProvider from "./locations/location-provider";

export type GameProviderProps = {
  children: React.ReactNode;
  game: () => React.ReactNode;
};

export default function GameProvider(props: GameProviderProps) {
  const { children, game } = props;

  return (
    <LocationsProvider initialLocation={game}>{children}</LocationsProvider>
  );
}
