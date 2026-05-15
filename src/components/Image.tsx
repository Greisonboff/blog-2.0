import { useState } from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function Image(props: ImageProps) {
  const [error, setError] = useState(false);

  if (error || !props.src || !props.src.length) return null;

  return <img {...props} onError={() => setError(true)} />;
}

export default Image;
