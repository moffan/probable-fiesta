export type SceneComponent = React.FC<Record<string, never>>;

export type InSceneComponent<P extends Record<string, unknown> = Record<string, never>> =
  React.FC<P & { onBack: () => void }> & { displayName: string };

