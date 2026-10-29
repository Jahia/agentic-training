import { jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  "jcr:title": string;
  "body"?: string;
  "features"?: string[];
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:textCard" },
  ({ "jcr:title": title, body, features }: Props) => (
    <article className={classes.card}>
      <h3>{title}</h3>
      {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
      {features && features.length > 0 && (
        <ul className={classes.features}>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
    </article>
  ),
);
