import newElement from "./domElementBuilder";
import Events from "./events";

const domManager = (() => {
  // Element container references
  let mainGridDiv;
  let menuDiv;
  let taskDetailsDiv;
  let subtaskDetailsDiv;

  let taskContainer;
  let subtaskContainer;

  let dataLoaded = false;
  Events.on("dataLoaded", () => {
    dataLoaded = true;
  });

  let openedTaskObject;
  const setOpenedTask = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;
    openedTaskObject = payload;

    return openedTaskObject;
  };

  // #region Init helper methods
  // Create main grid
  const mainGrid = () => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "main-grid"],
      parent: document.body,
    });
    return element;
  };

  // Create header
  const headerGrid = (parent) => {
    // Title
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "header"],
      parent,
    });
    newElement({
      tag: "p",
      classList: ["header-title"],
      parent: element,
      textContent: "To Do...",
    });
    // NewTask btn
    const newTaskBtn = newElement({
      tag: "div",
      classList: ["div-btn", "header-btn", "new-task-btn"],
      parent: element,
    });
    newTaskBtn.addEventListener("click", () => {
      Events.emit("toggleBtn", "TASK");
      Events.once("taskCreated", setOpenedTask);
      Events.emit("createTask", {});
    });
    newElement({
      tag: "img",
      classList: ["icon", "new-task-icon"],
      parent: newTaskBtn,
    });
    // Menu btn
    const menuBtn = newElement({
      tag: "div",
      classList: ["div-btn", "header-btn", "menu-btn"],
      parent: element,
    });
    menuBtn.addEventListener("click", () => Events.emit("toggleBtn", "MENU"));
    newElement({
      tag: "img",
      classList: ["icon", "menu-icon"],
      parent: menuBtn,
    });

    return element;
  };

  // Create content
  const contentGrid = (parent) => {
    // Task container
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "content"],
      parent,
    });
    // Generated tasks go here
    taskContainer = newElement({
      tag: "div",
      classList: ["grid-container", "tasks"],
      parent: element,
    });

    // New task bottom button
    /*     const newTaskBtn = newElement({
      tag: "div",
      classList: ["div-btn", "content-btn", "new-task-btn"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "new-task-icon"],
      parent: newTaskBtn,
    }); */

    return element;
  };

  // Create footer
  const footerGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "footer"],
      parent,
    });
    // Author info
    const authorP = newElement({
      tag: "p",
      classList: "footer-author",
      parent: element,
    });
    authorP.innerHTML =
      "© 2023 Created by <a href='https://github.com/xincryptedx'>xIncryptedx</a>";

    return element;
  };

  // Create menu
  const menuGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "menu", "hide"],
      parent,
    });
    // Projects selection
    const projectsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "projects"],
      parent: element,
    });
    // All tasks btn
    const allTasksDiv = newElement({
      tag: "div",
      classList: ["span-btn-container", "all-tasks-div"],
      parent: projectsGrid,
    });
    newElement({
      tag: "span",
      classList: ["span-btn", "all-tasks-span-btn"],
      parent: allTasksDiv,
      textContent: "All Tasks",
    });
    // General tasks btn
    const generalTasksDiv = newElement({
      tag: "div",
      classList: ["span-btn-container", "general-tasks-div"],
      parent: projectsGrid,
    });
    newElement({
      tag: "span",
      classList: ["span-btn", "general-tasks-span-btn"],
      parent: generalTasksDiv,
      textContent: "General Tasks",
    });
    // Generated projects go here
    // New project btn
    const newProjectDiv = newElement({
      tag: "div",
      classList: ["span-btn-container", "new-project-div"],
      parent: projectsGrid,
    });
    newElement({
      tag: "span",
      classList: ["span-btn", "new-project-span-btn"],
      parent: newProjectDiv,
      textContent: "New Project +",
    });
    // Format btns
    const formatBtnsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "format-btns"],
      parent: element,
    });
    // Week btn
    const weekFilterBtn = newElement({
      tag: "div",
      classList: ["div-btn", "week-filter-btn"],
      parent: formatBtnsGrid,
    });
    newElement({
      tag: "p",
      classList: "week-filter-btn-text",
      parent: weekFilterBtn,
      textContent: "Week",
    });
    // Month btn
    const monthFilterBtn = newElement({
      tag: "div",
      classList: ["div-btn", "month-filter-btn"],
      parent: formatBtnsGrid,
    });
    newElement({
      tag: "p",
      classList: "month-filter-btn-text",
      parent: monthFilterBtn,
      textContent: "Month",
    });
    // Priority btn
    const prioritySortBtnGrid = newElement({
      tag: "div",
      classList: ["grid-container", "div-btn", "priority-sort-btn"],
      parent: formatBtnsGrid,
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-1"],
      parent: prioritySortBtnGrid,
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-2"],
      parent: prioritySortBtnGrid,
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-3"],
      parent: prioritySortBtnGrid,
    });
    // Date btn
    const dateSortBtnGrid = newElement({
      tag: "div",
      classList: ["grid-container", "div-btn", "date-sort-btn"],
      parent: formatBtnsGrid,
    });
    const dateOneDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-1"],
      parent: dateSortBtnGrid,
    });
    newElement({
      tag: "p",
      classList: "date-1-text",
      parent: dateOneDiv,
    });
    const dateTwoDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-2"],
      parent: dateSortBtnGrid,
    });
    newElement({
      tag: "p",
      classList: "date-2-text",
      parent: dateTwoDiv,
    });
    const dateThreeDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-3"],
      parent: dateSortBtnGrid,
    });
    newElement({
      tag: "p",
      classList: "date-3-text",
      parent: dateThreeDiv,
    });

    return element;
  };

  // Create taskDetails
  const taskDetailsGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "task-details", "hide"],
      parent,
    });
    // Name input label
    newElement({
      tag: "label",
      classList: ["task-details-label", "task-name-label"],
      parent: element,
      textContent: "Name:",
      for: "task-name-input",
    });
    newElement({
      tag: "span",
      classList: "edit-icon",
      parent: element,
      textContent: "✏",
    });
    // Date btn
    const dateBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "date-btn"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "date-icon"],
      parent: dateBtn,
    });
    // HasSubtasks btn
    const hasSubtasksBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "has-subtasks-btn"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "has-subtasks-icon"],
      parent: hasSubtasksBtn,
    });
    // Close btn
    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "close-btn"],
      parent: element,
    });
    closeBtn.addEventListener("click", () => {
      Events.emit("toggleBtn", "TASK");
    });
    newElement({
      tag: "img",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    // Name input
    const nameInput = newElement({
      tag: "input",
      type: "text",
      classList: ["text-input", "task-details-text-input", "task-name-input"],
      id: "task-name-input",
      parent: element,
    });
    nameInput.addEventListener("blur", () => Events.emit("updateTaskName"));
    // Priority btns
    const priorityBtnsGridContainer = newElement({
      tag: "div",
      classList: ["grid-container", "priority-btns"],
      parent: element,
    });
    // Low btn
    const lowBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "priority-btn", "low-btn"],
      parent: priorityBtnsGridContainer,
    });
    newElement({
      tag: "p",
      classList: "low-btn-text",
      parent: lowBtn,
      textContent: "Low",
    });
    // Medium btn
    const mediumBtn = newElement({
      tag: "div",
      classList: [
        "div-btn",
        "task-details-div-btn",
        "priority-btn",
        "medium-btn",
      ],
      parent: priorityBtnsGridContainer,
    });
    newElement({
      tag: "p",
      classList: "medium-btn-text",
      parent: mediumBtn,
      textContent: "Medium",
    });
    // High btn
    const highBtn = newElement({
      tag: "div",
      classList: [
        "div-btn",
        "task-details-div-btn",
        "priority-btn",
        "high-btn",
      ],
      parent: priorityBtnsGridContainer,
    });
    newElement({
      tag: "p",
      classList: "high-btn-text",
      parent: highBtn,
      textContent: "High",
    });
    // Task details label and textarea
    newElement({
      tag: "label",
      classList: ["task-details-label", "task-notes-label"],
      parent: element,
      textContent: "Notes:",
      for: "task-notes-textarea",
    });
    newElement({
      tag: "textarea",
      classList: ["task-details-textarea", "task-notes-textarea"],
      parent: element,
      id: "task-notes-textarea",
    });

    return element;
  };

  // Create subtasks display
  const subtasksDisplayGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "subtasks-display", "hide"],
      parent,
    });
    // Task name and project
    const taskInfoGrid = newElement({
      tag: "div",
      classList: ["grid-container", "task-details"],
      parent: element,
    });
    newElement({
      tag: "p",
      classList: "task-name",
      parent: taskInfoGrid,
    });
    newElement({
      tag: "p",
      classList: "task-project",
      parent: taskInfoGrid,
    });
    // Top addSubtask btn
    const addSubtaskBtnTop = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "add-subtask-btn", "top"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "add-subtask-icon"],
      parent: addSubtaskBtnTop,
    });
    // Close btn
    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "close-btn"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    // Set global variable for subtask container
    subtaskContainer = newElement({
      tag: "div",
      classList: ["grid-container", "subtasks"],
      parent: element,
    });
    // Generated subtasks go here
    // Bottom addSubtask btn
    /*     const addSubtaskBtnBottom = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "add-subtask-btn", "bottom"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "add-subtask-icon"],
      parent: addSubtaskBtnBottom,
    });
 */
    return element;
  };

  // #endregion

  // #region Methods for creating task, subtask, and project html elements
  const newTask = (parent, taskData) => {
    if (!(parent instanceof HTMLElement)) return undefined;

    const checkedClass = taskData.checked ? "checked" : "unchecked";
    const priorityClass = `priority-${taskData.priority}`;

    const element = newElement({
      tag: "div",
      classList: ["grid-container", "task", checkedClass],
      parent,
    });
    // Priority Outline Div
    const outlineDiv = newElement({
      tag: "div",
      classList: ["task-outline", priorityClass],
      parent: element,
    });
    // Task contents grid
    const taskContentsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "task-contents"],
      parent: outlineDiv,
    });
    // Name and project
    newElement({
      tag: "p",
      classList: "task-name",
      parent: taskContentsGrid,
      textContent: taskData.userSetName.toString(),
    });
    newElement({
      tag: "p",
      classList: "task-project",
      parent: taskContentsGrid,
      textContent: taskData.projectSetName.toString(),
    });
    // Details btn
    const detailsBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-btn", "details-btn"],
      parent: taskContentsGrid,
    });
    newElement({
      tag: "img",
      classList: ["icon", "details-icon"],
      parent: detailsBtn,
    });
    // Subtasks btn
    const subtasksBtn = newElement({
      tag: "div",
      classList: ["div-btn", "tasks-btn", "subtasks-btn"],
      parent: taskContentsGrid,
    });
    newElement({
      tag: "img",
      classList: ["icon", "subtasks-icon"],
      parent: subtasksBtn,
    });

    if (taskData.uid) element.setAttribute("data-UID", taskData.uid);
    else element.setAttribute("data-UID-Error", "ERROR");

    element.addEventListener("click", () => {
      Events.emit("taskClicked", taskData);
    });

    return element;
  };

  const newSubtask = (parent, subtaskData) => {
    if (!(parent instanceof HTMLElement)) return undefined;

    const description = subtaskData.description ? subtaskData.description : "";
    const initialCheckedState =
      subtaskData.checked === true || subtaskData.checked === false
        ? subtaskData.checked
        : false;

    const element = newElement({
      tag: "div",
      classList: ["grid-container", "subtask"],
      parent,
    });

    newElement({
      tag: "p",
      classList: ["subtask-description"],
      parent: element,
      textContent: description,
    });

    const checkbox = newElement({
      tag: "input",
      type: "checkbox",
      parent: element,
    });

    checkbox.checked = initialCheckedState;

    return element;
  };

  // #endregion

  // #region Methods for loading tasks and subtasks from data object and into containers

  const emptyContainer = (() => {
    const tasks = () => {
      if (taskContainer && taskContainer instanceof HTMLElement) {
        while (taskContainer.firstChild) {
          taskContainer.removeChild(taskContainer.lastChild);
        }
      }
      return taskContainer;
    };

    const subtasks = () => {
      if (subtaskContainer && subtaskContainer instanceof HTMLElement) {
        while (subtaskContainer.firstChild) {
          subtaskContainer.removeChild(subtaskContainer.lastChild);
        }
      }
      return subtaskContainer;
    };

    return { tasks, subtasks };
  })();

  // Load tasks from data
  const loadTasks = (payload) => {
    // Generate tasks based on payload data
    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return undefined;
    }

    emptyContainer.tasks();

    if (Array.isArray(payload)) {
      payload.forEach((entry) => {
        newTask(taskContainer, entry);
      });
    } else {
      newTask(taskContainer, payload);
    }

    return taskContainer;
  };

  const requestTaskForLoading = (request) => {
    // Request data
    Events.once("returnData", loadTasks);
    Events.emit("requestData", request);
  };

  const requestDefaultTasks = () => {
    Events.once("returnData", loadTasks);
    Events.emit("requestData", { query: "ALLTASKS" });
  };

  Events.on("dataLoaded", requestDefaultTasks);

  // Load subtasks from array of objects
  const loadSubtasks = (payload) => {
    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return undefined;
    }

    emptyContainer.subtasks();

    if (Array.isArray(payload)) {
      payload.forEach((entry) => {
        newSubtask(subtaskContainer, entry);
      });
    } else {
      newSubtask(subtaskContainer, payload);
    }

    return subtaskContainer;
  };

  const requestSubtasksForLoading = (request) => {
    Events.once("returnData", loadSubtasks);
    Events.emit("requestData", request);
  };

  // #endregion

  // #region Methods for updating html elements when their corresponding data is changed
  /*  
  This needs to be implemented after projects elmentes are created dynamically.
 const setProject = (payload) => {
    if (!payload || typeof payload !== "object" || !payload.uid) {
      return undefined;
    }

    // Find html element that has data-uid that matches the payload uid
    const projectElement = document.querySelector(
      "data-uid",
      payload.uid.toString()
    );

    // Set text content to userSetName
    if (projectElement) {
    }
  };

  Events.on("setProject", setProject); */

  const setTask = (payload) => {
    if (
      !dataLoaded ||
      !payload ||
      typeof payload !== "object" ||
      !payload.uid
    ) {
      return undefined;
    }

    const oldTaskElement = document.querySelector(
      `[data-uid="${payload.uid}"]`
    );
    if (!oldTaskElement) return undefined;

    const newTaskElement = newTask(oldTaskElement.parentNode, payload);

    oldTaskElement.replaceWith(newTaskElement);

    return newTaskElement;
  };

  Events.on("setTask", setTask);

  /*   const setSubtask = (payload) => {};

  Events.on("setSubtask", setSubtask); */
  // #endregion

  const toggleShowHide = (payload) => {
    if (typeof payload !== "string") return undefined;

    let element;

    if (payload === "MENU") element = menuDiv;
    else if (payload === "TASK") element = taskDetailsDiv;
    else if (payload === "SUBTASK") element = subtaskDetailsDiv;

    // Toggle menu element class hide/show
    if (element.classList.contains("hide")) {
      element.classList.remove("hide");
      element.classList.add("show");
    } else if (element.classList.contains("show")) {
      element.classList.remove("show");
      element.classList.add("hide");
    }

    return payload;
  };

  Events.on("toggleBtn", toggleShowHide);

  const taskClicked = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;

    openedTaskObject = payload;

    Events.emit("toggleBtn", "TASK");

    return openedTaskObject;
  };

  Events.on("taskClicked", taskClicked);

  // Activate a date input
  // Focus an input
  // Get value of input
  /* Method that will hide the p element on a subtask and unhide
     a text input that has the current subtask name as its value */
  // Method that does the reverse of the above
  // Method for toggling appearance of filterBtn icons

  // Init method
  const init = () => {
    // Create default html elements
    mainGridDiv = mainGrid();
    headerGrid(mainGridDiv);
    contentGrid(mainGridDiv);
    footerGrid(mainGridDiv);
    menuDiv = menuGrid(mainGridDiv);
    taskDetailsDiv = taskDetailsGrid(mainGridDiv);
    subtasksDisplayGrid(mainGridDiv);
  };
  // Listen for init event and call init method
  Events.on("init", init);

  return { requestTaskForLoading, requestSubtasksForLoading };
})();

export default domManager;
