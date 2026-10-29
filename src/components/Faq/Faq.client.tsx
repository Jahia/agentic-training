import { useState } from "react";
import classes from "./styles.module.css";

export default function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number>();

  return (
    <div className={classes.faq}>
      {items.map(({ question, answer }, i) => (
        <div key={question} className={classes.item}>
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? undefined : i)}
          >
            {question}
          </button>
          {open === i && <div dangerouslySetInnerHTML={{ __html: answer }} />}
        </div>
      ))}
    </div>
  );
}
