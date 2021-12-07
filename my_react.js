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

function my_react(type, props, ...children) {
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

// here is a problem with this recursive call
/*
* Once we start rendering,
*  we won’t stop until we have rendered the complete element tree.
*  If the element tree is big, it may block the main thread for too long.
*  And if the browser needs to do high priority stuff
* like handling user input or keeping an animation smooth,
*  it will have to wait until the render finishes.
* */
/*
* So we are going to break the work into small units,
*  and after we finish each unit we’ll let the browser interrupt the rendering
*  if there’s anything else that needs to be done.
*
* */

/*
* requestIdleCallback to make a loop
* */
let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(nextUnitOfWork) {
//   todo
}


const Phoebe = {
  createElement: my_react,
  render
};

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

// const element = Phoebe.createElement(
//   'div',
//   { id: 'foo' },
//   Phoebe.createElement('a', null, 'bar'),
//   Phoebe.createElement('b')
// );

const container = document.getElementById('app');

console.log(element)

Phoebe.render(element, container);
