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
  function createDom(fiber) {
    const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type);
    const isProperty = (key) => key !== "children";
    Object.keys(fiber.props).filter(isProperty).forEach((name) => {
      dom[name] = fiber.props[name];
    });
    fiber.props.children.forEach((child) => render(child, dom));
    return dom;
  }
  function commitRoot() {
    commitWork(wipRoot.children);
  }
  function commitWork(fiber) {
    if (!fiber) {
      return;
    }
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
  function render(element3, container3) {
    wipRoot = {
      dom: container3,
      props: {
        children: [element3]
      }
    };
    nextUnitOfWork = wipRoot;
  }
  var nextUnitOfWork = null;
  var wipRoot = null;
  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    console.log(111);
    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }
    window.requestIdleCallback(workLoop);
  }
  window.requestIdleCallback(workLoop);
  function performUnitOfWork(fiber) {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;
    while (index < elements.length) {
      const element3 = elements[index];
      const newFiber = {
        type: element3.type,
        props: element3.props,
        parent: fiber,
        dom: null
      };
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
      index++;
    }
    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
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
