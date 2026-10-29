import { getChildNodes, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./styles.module.css";

jahiaComponent(
  { componentType: "view", nodeType: "forsure:navMenu" },
  (_, { renderContext, currentResource }) => {
    const lang = currentResource.getLocale().getLanguage();
    const home = renderContext.getSite().getHome();
    const current = renderContext.getMainResource().getNode().getPath();
    const pages = [home, ...getChildNodes(home, -1, 0, (node) => node.isNodeType("jnt:page"))];
    return (
      <nav aria-label="Main menu" className={classes.nav}>
        <ul>
          {pages.map((page) => (
            <li key={page.getIdentifier()}>
              <a
                href={`/cms/render/live/${lang}${page.getPath()}.html`}
                aria-current={page.getPath() === current ? "page" : undefined}
              >
                {page.getDisplayableName()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);
