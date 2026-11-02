import { GameProvider } from "@systems";
import Game from "@game";
import {
  ActionViewer,
  GameLayout,
  InventoryViewer,
  LocationViewer,
  NavigationViewer,
  Panel,
  StatsViewer,
} from "@components";

function App() {
  return (
    <GameProvider game={Game}>
      <GameLayout>
        <Panel.Left>
          <StatsViewer />
          <InventoryViewer />
        </Panel.Left>
        <Panel.Center>
          <LocationViewer />
        </Panel.Center>
        <Panel.Right>
          <NavigationViewer />
          <ActionViewer />
        </Panel.Right>
      </GameLayout>
    </GameProvider>
  );
}

export default App;
