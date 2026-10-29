import {
  AbsoluteArea,
  AddResources,
  Area,
  buildModuleFileUrl,
  useServerContext,
} from "@jahia/javascript-modules-library";
import type { ReactNode } from "react";

import "modern-normalize/modern-normalize.css";
import "./global.css";

/** Places `children` in an html page, between the shared header and the footer. */
export const Layout = ({ title, children }: { title: string; children: ReactNode }) => {
  const { currentResource, renderContext } = useServerContext();
  const lang = currentResource.getLocale().getLanguage();
  return (
    <html lang={lang}>
      <head>
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header className="site-header">
          <AbsoluteArea
            name="header"
            parent={renderContext.getSite().getHome()}
            allowedNodeTypes={["forsure:navMenu", "forsure:userGreeting"]}
          />
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <Area name="footer" />
        </footer>
      </body>
    </html>
  );
};
