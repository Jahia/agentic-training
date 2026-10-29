import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  "jcr:title": string;
  "subtitle"?: string;
  "background"?: JCRNodeWrapper;
  "ctaLabel"?: string;
  "ctaLink"?: string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:hero" },
  ({ "jcr:title": title, subtitle, background, ctaLabel, ctaLink }: Props) => (
    <section
      className={classes.hero}
      style={background ? { backgroundImage: `url(${buildNodeUrl(background)})` } : undefined}
    >
      <div className={classes.content}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {ctaLink && (
          <a className={classes.cta} href={ctaLink}>
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  ),
);
