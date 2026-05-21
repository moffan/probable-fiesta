import type React from "react";
import LocationsProvider from "./locations/location-provider";
import type { SceneComponent } from "@systems";

export type GameProviderProps = {
  children: React.ReactNode;
  game: SceneComponent;
};

export default function GameProvider(props: GameProviderProps) {
  const { children, game } = props;

  return (
    <LocationsProvider initialLocation={game}>{children}</LocationsProvider>
  );
}
