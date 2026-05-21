import { useLocations } from "@systems";
import { logger } from "@utils/logger";

const images = import.meta.glob<string>("/game/assets/**/*.jpg", {
  query: "?url",
  import: "default",
  eager: true,
});

type Props = {
  src?: string;
};

export default function Image({ src }: Props) {
  const { currentLocation } = useLocations();
  
  const locationName = (currentLocation.displayName ?? "").toLowerCase().replaceAll(" ", "-");
  const imageName = (src ?? currentLocation.displayName ?? "").toLowerCase().replaceAll(" ", "-");
  const path = `/game/assets/${locationName}/${imageName}.jpg`;
  
  logger.log("glob keys:", Object.keys(images));
  logger.log("looking for:", path);
  
  const url = images[path];
  if (!url) return <div>fant ikke bilde</div>;

  return <img src={url} alt={src} />;
}
