import type React from "react";
import "./location-layout.css";

type Props = {
  children: React.ReactNode;
};

export default function LocationLayout({ children }: Props) {
  return <div className="location-layout">{children}</div>;
}
