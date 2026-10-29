import {
  getChildNodes,
  Island,
  jahiaComponent,
  RenderChildren,
} from "@jahia/javascript-modules-library";
import { useTranslation } from "react-i18next";
import Carousel from "./Carousel.client.jsx";

/** Properties defined in ./definition.cnd */
interface Props {
  "jcr:title": string;
}

jahiaComponent(
  { componentType: "view", nodeType: "forsure:testimonials" },
  ({ "jcr:title": title }: Props, { currentNode }) => {
    const { t } = useTranslation();
    const count = getChildNodes(currentNode, -1).length;
    return (
      <section>
        <h2>{title}</h2>
        <Island
          component={Carousel}
          props={{
            count,
            labels: { previous: t("testimonials.previous"), next: t("testimonials.next") },
          }}
        >
          <RenderChildren />
        </Island>
      </section>
    );
  },
);
