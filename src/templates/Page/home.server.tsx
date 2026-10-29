import { Area, jahiaComponent } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout.jsx";

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "home",
    displayName: "Home page",
  },
  ({ "jcr:title": title }) => (
    <Layout title={title}>
      <Area name="main" />
    </Layout>
  ),
);
