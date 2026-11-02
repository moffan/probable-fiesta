import type React from "react";
import LocationsProvider from "./locations/location-provider";
import StatsProvider from "./stats/stats-provider";
import type { SceneComponent } from "@systems";

export type GameProviderProps = {
  children: React.ReactNode;
  game: SceneComponent;
  fastTravelScene: SceneComponent;
};

export default function GameProvider(props: GameProviderProps) {
  const { children, game, fastTravelScene } = props;

  return (
    <StatsProvider>
      <LocationsProvider initialLocation={game} fastTravelScene={fastTravelScene}>
        {children}
      </LocationsProvider>
    </StatsProvider>
  );
}
