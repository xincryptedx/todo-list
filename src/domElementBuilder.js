function isValidHTMLElement(element) {
  return element.toString() !== "[object HTMLUnknownElement]";
}

export function areValidClasses(classes) {
  if (!classes) return false;
  if (classes.constructor === String) return true;
  if (classes.constructor === Array) {
    let areStrings = true;
    classes.forEach((entry) => {
      if (entry.constructor !== String || entry === "") areStrings = false;
    });
    return areStrings;
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
