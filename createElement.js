// as we can see in previous step
// The only thing that our function needs to do is create that object
/**
 const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
 */

/**
 * for example
 *
 * createElement("div")
 *
 * {
 *  "type": "div",
 *  "props": { "children": [] }
 * }
 *
 */

const TEXT_ELEMENT = "TEXT_ELEMENT"

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // warp primitive value, for example ‘string’
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  // create dom nodes
  const dom = element.type === TEXT_ELEMENT
    ? document.createTextNode("")
    : document.createElement(element.type);

  const isProperty = key => key !== "children"

  // assign element props to the node
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })

  //recursively do the same for each child.
  element.props.children.forEach(child =>
    render(child, dom)
  )

  container.appendChild(dom)
}

const Phoebe = {
  createElement,
  render
};

// const element = Phoebe.createElement(
//   'div',
//   { id: 'foo' },
//   Phoebe.createElement('a', null, 'bar'),
//   Phoebe.createElement('b')
// );

/*
* https://esbuild.github.io/content-types/#jsx
* */

/** @jsx Phoebe.createElement **/
const element = (
  <div id="foo">
    <a>bar111</a>
    <b/>
  </div>
);

const container = document.getElementById('app');

console.log(element)

Phoebe.render(element, container);
