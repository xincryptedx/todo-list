function isValidHTMLElement(element) {
  if (!(element instanceof HTMLElement)) return false;
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
    if (Array.isArray(classList)) {
      classList.forEach((className) => {
        element.classList.add(className);
      });
    } else element.classList.add(classList); // Must be a string if validated and not an array
  }

  if (isValidHTMLElement(parent)) {
    parent.appendChild(element);
  } else if (parent) element.setAttribute("data-parent-error", "ERROR");

  if (textContent) {
    element.textContent = textContent.toString();
  }

  return element;
};

export default createElement;
