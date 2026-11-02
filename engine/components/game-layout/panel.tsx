import type React from "react";

type Props = {
  children: React.ReactNode;
};

function Left({ children }: Props) {
  return <div className="panel-left">{children}</div>;
}

function Center({ children }: Props) {
  return <div className="panel-center">{children}</div>;
}

function Right({ children }: Props) {
  return <div className="panel-right">{children}</div>;
}

const Panel = { Left, Center, Right };

export default Panel;
