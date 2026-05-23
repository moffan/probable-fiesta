import type React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LocationInScene({ children }: Props) {
  return <div className="location-in-scene">{children}</div>;
}
