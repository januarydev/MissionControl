interface NoleProps {
  text: string;
}

export function Nole(props: NoleProps) {
  return (
    <div className="NoleContainer">
      <img className="Nole" src="Nole.png" />
      <div className="NoleText">{props.text}</div>
    </div>
  );
}
