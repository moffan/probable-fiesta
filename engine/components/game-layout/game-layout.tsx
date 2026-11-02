import type React from "react";
import "./game-layout.css";

type Props = {
  children: React.ReactNode;
};

export default function GameLayout({ children }: Props) {
  return <div className="game-layout">{children}</div>;
}
