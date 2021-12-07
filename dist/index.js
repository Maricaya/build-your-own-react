(() => {
  // my_react.js
  var TEXT_ELEMENT = "TEXT_ELEMENT";
  function my_react(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => typeof child === "object" ? child : createTextElement(child))
      }
    };
  }
  function createTextElement(text2) {
    return {
      type: TEXT_ELEMENT,
      props: {
        nodeValue: text2,
        children: []
      }
    };
  }
  function render(element3, container3) {
    const dom = element3.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(element3.type);
    const isProperty = (key) => key !== "children";
    Object.keys(element3.props).filter(isProperty).forEach((name) => {
      dom[name] = element3.props[name];
    });
    element3.props.children.forEach((child) => render(child, dom));
    container3.appendChild(dom);
  }
  var nextUnitOfWork = null;
  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfUnit);
      shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
  }
  requestIdleCallback(workLoop);
  function performUnitOfWork(nextUnitOfWork2) {
  }
  var Phoebe = {
    createElement: my_react,
    render
  };
  var element = /* @__PURE__ */ Phoebe.createElement("div", {
    id: "foo"
  }, /* @__PURE__ */ Phoebe.createElement("a", null, "bar111"), /* @__PURE__ */ Phoebe.createElement("b", null));
  var container = document.getElementById("app");
  console.log(element);
  Phoebe.render(element, container);

  // index.js
  var element2 = {
    type: "h1",
    props: {
      title: "foo",
      children: "Hello"
    }
  };
  var container2 = document.getElementById("app");
  var node = document.createElement(element2.type);
  node["title"] = element2.props.title;
  var text = document.createTextNode("");
  text["nodeValue"] = element2.props.children;
  node.appendChild(text);
  container2.appendChild(node);
})();
