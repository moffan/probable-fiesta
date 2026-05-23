import "./app.css";

import { GameProvider } from "@systems";
import Game from "@game";
import {
  ActionViewer,
  InventoryViewer,
  LocationViewer,
  NavigationViewer,
  StatsViewer,
} from "@components";

function App() {
  return (
    <GameProvider game={Game}>
      <div className="game-layout">
        <div className="panel-left">
          <StatsViewer />
          <InventoryViewer />
        </div>
        <div className="panel-center">
          <LocationViewer />
        </div>
        <div className="panel-right">
          <NavigationViewer />
          <ActionViewer />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
