import { getChildNodes, Island, jahiaComponent } from "@jahia/javascript-modules-library";
import Faq from "./Faq.client.jsx";

/** Properties defined in ./definition.cnd */
interface Props {
  "jcr:title": string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:faq" },
  ({ "jcr:title": title }: Props, { currentNode }) => {
    const items = getChildNodes(currentNode, -1).map((item) => ({
      question: item.getPropertyAsString("jcr:title"),
      answer: item.getPropertyAsString("answer"),
    }));
    return (
      <section>
        <h2>{title}</h2>
        <Island component={Faq} props={{ items }} clientOnly>
          <p>Loading questions…</p>
        </Island>
      </section>
    );
  },
);
