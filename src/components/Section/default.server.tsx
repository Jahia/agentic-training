import { getChildNodes, jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import classes from "./styles.module.css";

/** Properties defined in ./definition.cnd */
interface Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  layout?: string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:section" },
  ({ sectionTitle, sectionSubtitle, layout }: Props, { currentNode }) => {
    const items = getChildNodes(currentNode, -1);
    return (
      <section className={classes.section}>
        <h1>{sectionTitle}</h1>
        {sectionSubtitle && <p className={classes.subtitle}>{sectionSubtitle}</p>}
        {items.length > 0 && (
          <div className={classes.grid} data-layout={layout}>
            <RenderChildren />
          </div>
        )}
      </section>
    );
  },
);
