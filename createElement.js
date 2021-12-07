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
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const Phoebe = {
  createElement,
};

// const element = Phoebe.createElement(
//   'div',
//   { id: 'foo' },
//   Phoebe.createElement('a', null, 'bar'),
//   Phoebe.createElement('b')
// );

/** @jsx Phoebe.createElement **/
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
const container = document.getElementById('id');
ReactDOM.render(element, container);
