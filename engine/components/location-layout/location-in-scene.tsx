import { useState, Children, isValidElement, cloneElement } from "react";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LocationInScene({ children }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = Children.toArray(children).filter(isValidElement);

  if (items.length === 0) return null;

  if (selectedIndex !== null) {
    const selected = items[selectedIndex] as React.ReactElement<{ onBack: () => void }>;
    return (
      <div className="location-in-scene">
        {cloneElement(selected, { onBack: () => setSelectedIndex(null) })}
      </div>
    );
  }

  return (
    <div className="location-in-scene">
      {items.map((item, i) => {
        const type = item.type as { displayName?: string };
        const label = type.displayName ?? `Location ${i + 1}`;
        return (
          <button
            key={label}
            type="button"
            className="location-in-scene__item"
            onClick={() => setSelectedIndex(i)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
