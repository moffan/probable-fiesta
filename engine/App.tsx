import "./App.css";

import { GameProvider } from "@systems";
import Game from "@game";
import { LocationViewer, NavigationViewer } from "@components";

function App() {
  return (
    <GameProvider game={Game}>
      <LocationViewer />
      <NavigationViewer />
    </GameProvider>
  );
}

export default App;
