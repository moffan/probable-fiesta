import type { SceneComponent } from "@systems";
import { useLocationInternals } from "@systems/internal";
import { logger } from "@utils/logger";

const PLACEHOLDER = "/game/assets/placeholder.jpg";

const images = import.meta.glob<string>("/game/assets/**/*.jpg", {
  query: "?url",
  import: "default",
  eager: true,
});

const locations = import.meta.glob<SceneComponent>(
  "/game/locations/**/index.tsx",
  { import: "default", eager: true },
);

// Each location's folder under game/locations/, e.g. "/crestwood-bay/downtown"
const locationPaths = new Map(
  Object.entries(locations).map(([file, location]) => [
    location,
    file.slice("/game/locations".length, -"/index.tsx".length),
  ]),
);

type Props = {
  src?: string;
};

export default function Image({ src }: Props) {
  const { currentLocation } = useLocationInternals();

  let path: string;
  if (src?.startsWith("/")) {
    path = `/game/assets${src}.jpg`;
  } else {
    const locationPath = locationPaths.get(currentLocation) ?? "";
    const imageName = src ?? locationPath.split("/").at(-1);
    path = `/game/assets${locationPath}/${imageName}.jpg`;
  }

  logger.log("glob keys:", Object.keys(images));
  logger.log("looking for:", path);

  const imageUrl = images[path];
  if (!imageUrl) {
    console.warn(`Image not found: ${path}, using placeholder`);

    return (
      <>
        <img src={images[PLACEHOLDER]} alt={path} />
        <span>fant ikke bilde: {path}</span>
      </>
    );
  }

  return <img src={imageUrl} alt={path} />;
}
