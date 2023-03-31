function isValidHTMLElement(element) {
  return element.toString() !== "[object HTMLUnknownElement]";
}

export function areValidClasses(classList) {
  if (!classList) return false;

  if (typeof classList === "string") return true;

  if (Array.isArray(classList)) {
    const entriesValid = classList.every(
      (entry) => typeof entry === "string" && entry.trim().length > 0
    );

    return entriesValid;
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
