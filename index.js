// React
import "./createElement.js"
// element -> react element
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
​
const container = document.getElementById("app");

// node 
const node = document.createElement(element.type)
node["title"] = element.props.title

// Using textNode instead of setting innerText will allow us to treat all elements in the same way later.
const text = document.createTextNode("")
text["nodeValue"] = element.props.children

node.appendChild(text)
container.appendChild(node)
