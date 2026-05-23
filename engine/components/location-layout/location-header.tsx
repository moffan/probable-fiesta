type LocationHeaderProps = {
  title: string;
};

export default function LocationHeader(props: LocationHeaderProps) {
  return <h1 className="location-header">{props.title}</h1>;
}
