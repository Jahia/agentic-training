import { buildNodeUrl, jahiaComponent, useJCRQuery } from "@jahia/javascript-modules-library";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  "jcr:title": string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:productGrid" },
  ({ "jcr:title": title }: Props, { renderContext }) => {
    const home = renderContext.getSite().getHome();
    const products = useJCRQuery({
      query: `SELECT * FROM [jnt:page] WHERE ISDESCENDANTNODE('${home.getPath()}') AND [j:templateName] = 'product'`,
    });
    return (
      <section>
        <h2>{title}</h2>
        <ul className={classes.grid}>
          {products.map((product) => (
            <li key={product.getIdentifier()}>
              <a href={buildNodeUrl(product)}>{product.getDisplayableName()}</a>
            </li>
          ))}
        </ul>
        <p>Not sure which cover you need? Call us at 0 800 123 456, seven days a week.</p>
      </section>
    );
  },
);
