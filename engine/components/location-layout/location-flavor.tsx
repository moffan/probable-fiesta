import Markdown from "react-markdown";

type Props = {
  children: string;
};

export default function LocationFlavor({ children }: Props) {
  return (
    <div className="location-flavor">
      <Markdown>{children}</Markdown>
    </div>
  );
}
