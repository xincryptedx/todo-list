function isValidHTMLElement(element) {
  return element.toString() !== "[object HTMLUnknownElement]";
}

const createElement = ({ type, classes, parent, textContent }) => {
  const element = document.createElement(type);

  if (!isValidHTMLElement(element)) {
    return undefined;
  }

  if (classes) {
    classes.forEach((className) => {
      element.classList.add(className);
    });
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
};

export default createElement;
