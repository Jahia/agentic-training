import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  image?: JCRNodeWrapper;
  imageAlt?: string;
  caption?: string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:imageWithCaption" },
  ({ image, imageAlt, caption }: Props) => (
    <figure className={classes.figure}>
      {image && <img src={buildNodeUrl(image)} alt={imageAlt ?? ""} loading="lazy" />}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
);
