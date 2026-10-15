import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

type SceneVideoProps = {
  src: string;
  defer?: boolean;
};

export default function SceneVideo({ src, defer = false }: SceneVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nearViewport = useInView(containerRef, { once: true, margin: '200px' });
  const inViewport = useInView(containerRef);
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const shouldLoad = !reducedMotion && !failed && (!defer || nearViewport);
  const shouldPlay = shouldLoad && inViewport;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }

    return () => {
      video.pause();
    };
  }, [shouldPlay]);

  return (
    <div ref={containerRef} className="scene-media">
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
