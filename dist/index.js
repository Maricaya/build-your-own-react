(() => {
  // createElement.js
  function createElement(type, props, ...children) {
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
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text2,
        children: []
      }
    };
  }
  var Phoebe = {
    createElement
  };
  var element = /* @__PURE__ */ Phoebe.createElement("div", {
    id: "foo"
  }, /* @__PURE__ */ Phoebe.createElement("a", null, "bar"), /* @__PURE__ */ Phoebe.createElement("b", null));
  console.log(element);

  // index.js
  var element2 = {
    type: "h1",
    props: {
      title: "foo",
      children: "Hello"
    }
  };
  var container = document.getElementById("app");
  var node = document.createElement(element2.type);
  node["title"] = element2.props.title;
  var text = document.createTextNode("");
  text["nodeValue"] = element2.props.children;
  node.appendChild(text);
  container.appendChild(node);
})();
