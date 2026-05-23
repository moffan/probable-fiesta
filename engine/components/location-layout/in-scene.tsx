import type { InSceneComponent, InSceneEntry } from "@systems";

export function inScene<P extends Record<string, unknown>>(
  component: InSceneComponent<P>,
  props?: P,
): InSceneEntry {
  const Component = component as React.FC<{ onBack: () => void } & Record<string, unknown>>;
  return {
    displayName: component.displayName,
    render: (onBack) => <Component {...(props ?? {})} onBack={onBack} />,
  };
}
