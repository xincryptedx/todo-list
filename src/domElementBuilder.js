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

const createElement = ({ type, classList, parent, textContent }) => {
  const element = document.createElement(type);

  if (!isValidHTMLElement(element)) {
    return undefined;
  }

  if (areValidClasses(classList)) {
    classList.forEach((className) => {
      element.classList.add(className);
    });
  }

  if (isValidHTMLElement(parent)) {
    parent.appendChild(element);
  }

  if (textContent) {
    element.textContent = textContent.toString();
  }

  return element;
};

export default createElement;
