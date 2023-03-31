function isValidHTMLElement(element) {
  return element.toString() !== "[object HTMLUnknownElement]";
}

export function areValidClasses(classes) {
  if (!classes) return false;
  if (classes.constructor === String) return true;
  if (classes.constructor === Array) {
    classes.forEach((key) => {
      if (key.constructor !== String) return false;
      return true;
    });
  }
  return false;
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
