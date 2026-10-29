import { useEffect, useRef, useState, type ReactNode } from "react";
import classes from "./styles.module.css";

export default function Carousel({
  count,
  labels,
  children,
}: {
  count: number;
  labels: { previous: string; next: string };
  children: ReactNode;
}) {
  const slidesRef = useRef<HTMLDivElement>(null);
  // Visitors come back to the testimonial they were reading
  const [index, setIndex] = useState(() =>
    typeof window === "undefined" ? 0 : Number(localStorage.getItem("testimonial") ?? 0) % count,
  );

  useEffect(() => {
    slidesRef.current?.querySelectorAll("figure").forEach((slide, i) => {
      slide.style.display = i === index ? "" : "none";
    });
    localStorage.setItem("testimonial", String(index));
  }, [index]);

  return (
    <div className={classes.carousel}>
      <div ref={slidesRef}>{children}</div>
      {count > 1 && (
        <div className={classes.controls}>
          <button type="button" onClick={() => setIndex((index + count - 1) % count)}>
            {labels.previous}
          </button>
          <span>
            {index + 1} / {count}
          </span>
          <button type="button" onClick={() => setIndex((index + 1) % count)}>
            {labels.next}
          </button>
        </div>
      )}
    </div>
  );
}
