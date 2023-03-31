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

function isValidInput(element, inputType) {
  const validInputs = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ];

  if (!element || !inputType) return false;

  if (!validInputs.includes(inputType)) return false;

  if (element.tagName !== "INPUT") return false;

  return true;
}
/**
 *
 * @param {Object} args - Contains properties used to create element. Requires a valid HTML tag value.
 * @param {String} args.tag - HTML tag of the created element. If invalid, fn will return undefined.
 * @param {String} args.id - If truthy this will be set as element's id attr value.
 * @param {String | String[]} args.classList - Accepts a string or array of strings and adds as classes to element.
 * @param {String} args.textContent - If truthy it will be converted to a string and set as elements text content.
 * @param {String} args.type - Sets element's type attr if it is an input element and the type is a valid input type.
 * @param {String} args.for - Sets element's for attr if it is a label element.
 * @param {String | String[]} args.customAttrList - Accepts a string or array of strings and adds as data- attrs to element.
 * @returns {HTMLElement} - Created element. Will have data-x-error:'ERROR' attr if invalid param values passed. If tag invalid, returns undefined.
 */
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

  // Set id

  // Add classes
  if (isValidClassList(args.classList)) {
    if (Array.isArray(args.classList)) {
      args.classList.forEach((className) => {
        element.classList.add(className);
      });
    } else element.classList.add(args.classList); // Must be a string if validated and not an array
  } else if (args.classList) {
    element.setAttribute("data-classList-error", "ERROR");
  }

  // Set text content
  if (args.textContent) {
    element.textContent = args.textContent.toString();
  }

  // Set input type
  if (isValidInput(element, args.type)) {
    element.setAttribute("type", args.type);
  } else if (args.type) {
    element.setAttribute("data-input-type-error", "ERROR");
  }
  // Set label for

  // Set data attr

  // Append to parent element
  if (isValidHTMLElement(args.parent)) {
    args.parent.appendChild(element);
  } else if (args.parent) {
    element.setAttribute("data-parent-error", "ERROR");
  }

  return element;
};

export default createElement;
