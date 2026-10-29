import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  quote?: string;
  name?: string;
  photo?: JCRNodeWrapper;
  product?: JCRNodeWrapper;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:testimonial" },
  ({ quote, name, photo, product }: Props) => (
    <figure className={classes.testimonial}>
      {photo && <img src={buildNodeUrl(photo)} alt="" width={96} height={96} />}
      <blockquote>
        <p>{quote}</p>
      </blockquote>
      <figcaption>
        <strong>{name}</strong>
        {product && <span>{product.getPropertyAsString("jcr:title")}</span>}
      </figcaption>
    </figure>
  ),
);
