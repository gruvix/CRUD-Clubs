import React from "react";

export default function LoginSpiner({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return <span className="loader" style={style}></span>;
}
