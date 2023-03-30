export default function createElement({
  elementType: type,
  classes,
  parent,
  textContent,
}) {
  const element = document.createElement(type);

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
}
