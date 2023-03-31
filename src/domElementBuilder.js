function isValidTag(type) {
  if (!type) return false;
  const htmlTagRegex = /^(?!xml)[a-z][\w.-]*$/i;
  return htmlTagRegex.test(type);
}

function isValidHTMLElement(element) {
  if (!(element instanceof HTMLElement)) return false;
  return element.toString() !== "[object HTMLUnknownElement]";
}

function isValidClassList(classList) {
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

const createElement = (args) => {
  if (!args) return undefined;

  // Element Creation
  const element = isValidTag(args.tag)
    ? document.createElement(args.tag.toString())
    : undefined;
  if (!element) return undefined;

  if (!isValidHTMLElement(element)) {
    return undefined;
  }

  // Add classes
  if (isValidClassList(args.classList)) {
    if (Array.isArray(args.classList)) {
      args.classList.forEach((className) => {
        element.classList.add(className);
      });
    } else element.classList.add(args.classList); // Must be a string if validated and not an array
  } else if (args.classList)
    element.setAttribute("data-classList-error", "ERROR");

  // Set text content
  if (args.textContent) {
    element.textContent = args.textContent.toString();
  }

  // Append to parent element
  if (isValidHTMLElement(args.parent)) {
    args.parent.appendChild(element);
  } else if (args.parent) element.setAttribute("data-parent-error", "ERROR");

  return element;
};

export default createElement;
