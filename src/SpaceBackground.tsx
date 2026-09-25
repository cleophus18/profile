/**
 * Animated "deep space" backdrop: drifting star layers, slow nebula clouds and
 * two orbiting glow rings. Purely decorative, so it is hidden from assistive
 * tech and the animation is disabled for anyone who asks for reduced motion.
 */

const STAR_COUNT = 90;

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  layer: number;
};

/** Deterministic pseudo-random so the field looks identical on every render. */
function makeStars(count: number): Star[] {
  const stars: Star[] = [];
  let seed = 20250518;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    stars.push({
      left: random() * 100,
      top: random() * 100,
      size: 1 + random() * 2.2,
      delay: random() * 6,
      duration: 3 + random() * 5,
      layer: Math.floor(random() * 3),
    });
  }
  return stars;
}

const stars = makeStars(STAR_COUNT);

export default function SpaceBackground() {
  return (
    <div className="space-bg" aria-hidden="true">
      <div className="space-nebula" />
      <div className="space-grid" />

      <div className="space-stars">
        {stars.map((star, index) => (
          <span
            key={index}
            className={`star layer-${star.layer}`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="space-orbit orbit-a" />
      <div className="space-orbit orbit-b" />
      <div className="space-vignette" />
    </div>
  );
}
