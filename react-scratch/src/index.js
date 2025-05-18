// Function to create a virtual DOM element
function createElement(type, props, ...children) {
  if (typeof type === "function") {
    return type.prototype instanceof Component
      ? new type(props).render()
      : type(props);
  }
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// Function to create a virtual DOM text element
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// Function to render a virtual DOM element to the real DOM
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

// Class to represent a component
class Component {
  constructor(props) {
    this.props = props;
  }
}

// Object to group the createElement and render functions
const Didact = {
  createElement,
  render,
  Component,
};

/** @jsx Didact.createElement */

// Example component
class App extends Didact.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <p>This is a simple component.</p>
      </div>
    );
  }
}

// Get the container element from the real DOM
const container = document.getElementById("root");

// Render the App component into the container
Didact.render(<App />, container);
