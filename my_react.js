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

function createDom(fiber) {
  // create dom nodes
  const dom = fiber.type === TEXT_ELEMENT
    ? document.createTextNode("")
    : document.createElement(fiber.type);

  const isProperty = key => key !== "children"

  // assign element props to the node
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  //recursively do the same for each child.
  fiber.props.children.forEach(child =>
    render(child, dom)
  )

  // container.appendChild(dom)
  return dom
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

function commitRoot() {
  // add nodes to dom
  commitWork(wipRoot.children)
}
/*
* And once we finish all the work
*  (we know it because there isn’t a next unit of work)
*  we commit the whole fiber tree to the DOM.
* */
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  // set next unit of work
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null // work in progress root

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  console.log(111)

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  window.requestIdleCallback(workLoop)
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
window.requestIdleCallback(workLoop)

/*
* fiber tree
  1. add the element to the DOM
  2. create the fibers for the element’s children
  3. select the next unit of work
  * child
  * sibling
  * uncle
  * root -> end
*
* */

function performUnitOfWork(fiber) {
  //  add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }

  // create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }
    // And we add it to the fiber tree
    // setting it either as a child or as a sibling,
    // depending on whether it’s the first child or not.
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
  //  return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

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
