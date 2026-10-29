import { jahiaComponent } from "@jahia/javascript-modules-library";

jahiaComponent(
  { componentType: "view", nodeType: "forsure:userGreeting" },
  (_, { renderContext }) => {
    const user = renderContext.getUser();
    if (user.getUsername() === "guest") return <a href="/cms/login">Log in</a>;
    return <span>Hello, {user.getUsername()}!</span>;
  },
);
