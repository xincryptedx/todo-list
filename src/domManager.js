import newElement from "./domElementBuilder";
import Events from "./events";
import Icons from "./icons";

const domManager = (() => {
  // Element container references
  let mainGridDiv;

  let headerGridDiv;
  let contentGridDiv;
  let footerGridDiv;

  let menuDiv;
  let taskDetailsDiv;
  let subtaskDetailsDiv;

  let taskContainer;
  let subtaskContainer;

  // Input/Dipslay Element references
  let activeProjectText;
  let activeFilterText;
  let activeFormatText;
  let taskNameInput;
  let taskDateInput;
  let priLowBtn;
  let priMediumBtn;
  let priHighBtn;
  let taskNotesTextarea;

  let taskViewDisplayDiv;
  let weekFilterBtn;
  let monthFilterBtn;
  let prioritySortBtn;
  let dateSortBtn;

  let dataLoaded = false;
  Events.on("dataLoaded", () => {
    dataLoaded = true;
  });

  // State references
  const taskViewOpts = {
    format: {
      DateDescending: "DATE-D",
      DateAscending: "DATE-A",
      PriorityDescending: "PRIORITY-D",
      PriorityAscending: "PRIORITY-A",
    },
    filter: {
      All: "ALL",
      Week: "WEEK",
      Month: "MONTH",
    },
    project: {
      All: "ALLTASKS",
      General: "GENERAL",
      Trash: "TRASH",
      UserMade: "PROJECT",
    },
    selectedUserProject: "",
  };

  // Defines default project view and can be updated for reference later
  const taskView = {
    format: taskViewOpts.format.PriorityDescending,
    filter: taskViewOpts.filter.All,
    project: taskViewOpts.project.All,
  };

  let openedTaskObject;
  const setOpenedTask = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;
    openedTaskObject = payload;

    Events.emit("openedTaskSet", openedTaskObject);

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
      classList: ["grid-container", "header", "show"],
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
      Events.emit("newTaskClicked");
    });
    const newTaskIcon = newElement({
      tag: "div",
      classList: ["icon", "new-task-icon"],
      parent: newTaskBtn,
    });
    newTaskIcon.innerHTML = Icons.newTask;
    // Menu btn
    const menuBtn = newElement({
      tag: "div",
      classList: ["div-btn", "header-btn", "menu-btn"],
      parent: element,
    });
    menuBtn.addEventListener("click", () => Events.emit("toggleBtn", "MENU"));
    const menuIcon = newElement({
      tag: "div",
      classList: ["icon", "menu-icon"],
      parent: menuBtn,
    });
    menuIcon.innerHTML = Icons.menu;

    return element;
  };

  // Create content
  const contentGrid = (parent) => {
    // Task container
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "content", "show"],
      parent,
    });
    // Task View Display
    taskViewDisplayDiv = newElement({
      tag: "div",
      classList: ["grid-container", "task-view-display"],
      parent: element,
    });
    activeProjectText = newElement({
      tag: "p",
      classList: "active-project-text",
      parent: taskViewDisplayDiv,
    });
    activeFilterText = newElement({
      tag: "p",
      classList: "active-filter-text",
      parent: taskViewDisplayDiv,
    });
    activeFormatText = newElement({
      tag: "p",
      classList: "active-format-text",
      parent: taskViewDisplayDiv,
    });
    // Generated tasks go here
    taskContainer = newElement({
      tag: "div",
      classList: ["grid-container", "tasks"],
      parent: element,
    });

    return element;
  };

  // Create footer
  const footerGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "footer", "show"],
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
    weekFilterBtn = newElement({
      tag: "div",
      classList: ["div-btn", "week-filter-btn"],
      parent: formatBtnsGrid,
    });
    weekFilterBtn.addEventListener("click", () => {
      Events.emit("filterWeek");
    });
    newElement({
      tag: "p",
      classList: "week-filter-btn-text",
      parent: weekFilterBtn,
      textContent: "Week",
    });
    // Month btn
    monthFilterBtn = newElement({
      tag: "div",
      classList: ["div-btn", "month-filter-btn"],
      parent: formatBtnsGrid,
    });
    monthFilterBtn.addEventListener("click", () => {
      Events.emit("filterMonth");
    });
    newElement({
      tag: "p",
      classList: "month-filter-btn-text",
      parent: monthFilterBtn,
      textContent: "Month",
    });
    // Priority btn
    prioritySortBtn = newElement({
      tag: "div",
      classList: ["grid-container", "div-btn", "priority-sort-btn"],
      parent: formatBtnsGrid,
    });
    prioritySortBtn.addEventListener("click", () => {
      Events.emit("sortPriority");
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-1"],
      parent: prioritySortBtn,
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-2"],
      parent: prioritySortBtn,
    });
    newElement({
      tag: "div",
      classList: ["priority-sort-btn-color-div", "color-3"],
      parent: prioritySortBtn,
    });
    // Date btn
    dateSortBtn = newElement({
      tag: "div",
      classList: ["grid-container", "div-btn", "date-sort-btn"],
      parent: formatBtnsGrid,
    });
    dateSortBtn.addEventListener("click", () => {
      Events.emit("sortDate");
    });
    const dateOneDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-1"],
      parent: dateSortBtn,
    });
    newElement({
      tag: "p",
      classList: "date-1-text",
      parent: dateOneDiv,
      textContent: "March 1st",
    });
    const dateTwoDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-2"],
      parent: dateSortBtn,
    });
    newElement({
      tag: "p",
      classList: "date-2-text",
      parent: dateTwoDiv,
      textContent: "May 2nd",
    });
    const dateThreeDiv = newElement({
      tag: "div",
      classList: ["date-sort-btn-div", "date-3"],
      parent: dateSortBtn,
    });
    newElement({
      tag: "p",
      classList: "date-3-text",
      parent: dateThreeDiv,
      textContent: "July 3rd",
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
    // Date label
    newElement({
      tag: "label",
      for: "due-date-input",
      classList: ["task-details-label", "due-date-label"],
      parent: element,
      textContent: "Due: ",
    });
    // Date input
    taskDateInput = newElement({
      tag: "input",
      type: "date",
      id: "due-date-input",
      classList: ["task-details-input", "due-date-input"],
      parent: element,
      textContent: "Due: ",
    });
    taskDateInput.addEventListener("blur", () => {
      Events.emit("blurTaskDate");
    });
    // Date btn
    const dateBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "date-btn"],
      parent: element,
    });
    dateBtn.addEventListener("click", () => {
      taskDateInput.focus();
    });
    const dateIcon = newElement({
      tag: "div",
      classList: ["icon", "date-icon"],
      parent: dateBtn,
    });
    dateIcon.innerHTML = Icons.date;
    // Close btn
    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "close-btn"],
      parent: element,
    });
    closeBtn.addEventListener("click", () => {
      Events.emit("toggleBtn", "TASK");
    });
    const closeIcon = newElement({
      tag: "div",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    closeIcon.innerHTML = Icons.close;
    // Name input
    taskNameInput = newElement({
      tag: "input",
      type: "text",
      classList: ["text-input", "task-details-text-input", "task-name-input"],
      id: "task-name-input",
      parent: element,
    });
    taskNameInput.addEventListener("blur", () => Events.emit("blurTaskName"));
    // Priority btns
    const priorityBtnsGridContainer = newElement({
      tag: "div",
      classList: ["grid-container", "priority-btns"],
      parent: element,
    });
    // Low btn
    priLowBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "priority-btn", "low-btn"],
      parent: priorityBtnsGridContainer,
    });
    priLowBtn.addEventListener("click", () =>
      Events.emit("priorityClicked", "LOW")
    );
    newElement({
      tag: "p",
      classList: "low-btn-text",
      parent: priLowBtn,
      textContent: "Low",
    });
    // Medium btn
    priMediumBtn = newElement({
      tag: "div",
      classList: [
        "div-btn",
        "task-details-div-btn",
        "priority-btn",
        "medium-btn",
      ],
      parent: priorityBtnsGridContainer,
    });
    priMediumBtn.addEventListener("click", () =>
      Events.emit("priorityClicked", "MEDIUM")
    );
    newElement({
      tag: "p",
      classList: "medium-btn-text",
      parent: priMediumBtn,
      textContent: "Medium",
    });
    // High btn
    priHighBtn = newElement({
      tag: "div",
      classList: [
        "div-btn",
        "task-details-div-btn",
        "priority-btn",
        "high-btn",
      ],
      parent: priorityBtnsGridContainer,
    });
    priHighBtn.addEventListener("click", () =>
      Events.emit("priorityClicked", "HIGH")
    );
    newElement({
      tag: "p",
      classList: "high-btn-text",
      parent: priHighBtn,
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
    taskNotesTextarea = newElement({
      tag: "textarea",
      classList: ["task-details-textarea", "task-notes-textarea"],
      parent: element,
      id: "task-notes-textarea",
    });
    taskNotesTextarea.addEventListener("blur", () => {
      Events.emit("blurTaskNotes");
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
    const addSubtaskIcon = newElement({
      tag: "div",
      classList: ["icon", "add-subtask-icon"],
      parent: addSubtaskBtnTop,
    });
    addSubtaskIcon.innerHTML = Icons.add;
    // Close btn
    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "close-btn"],
      parent: element,
    });
    const closeIcon = newElement({
      tag: "div",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    closeIcon.innerHTML = Icons.close;
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
    detailsBtn.addEventListener("click", () => {
      Events.emit("detailsClicked", taskData);
    });
    const detailsIcon = newElement({
      tag: "div",
      classList: ["icon", "details-icon"],
      parent: detailsBtn,
    });
    detailsIcon.innerHTML = Icons.taskDetails;
    // Subtasks btn
    const subtasksBtn = newElement({
      tag: "div",
      classList: ["div-btn", "tasks-btn", "subtasks-btn"],
      parent: taskContentsGrid,
    });
    const subtaskIcon = newElement({
      tag: "div",
      classList: ["icon", "subtasks-icon"],
      parent: subtasksBtn,
    });
    subtaskIcon.innerHTML = Icons.subtasks;

    if (taskData.uid) element.setAttribute("data-UID", taskData.uid);
    else element.setAttribute("data-UID-Error", "ERROR");

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
    if (!payload) {
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

  const reloadTaskContainer = () => {
    if (!dataLoaded) return;

    const request = { query: "", format: "", filter: "" };

    // Use taskView to create task load request
    if (taskView.project === taskViewOpts.project.UserMade) {
      request.query = `${taskView.project}${taskView.selectedUserProject}`;
    } else request.query = taskView.project;

    request.format = taskView.format;

    request.filter = taskView.filter;

    requestTaskForLoading(request);
  };

  Events.on("toggleBtn", reloadTaskContainer);
  Events.on("dataLoaded", reloadTaskContainer);
  Events.on("taskViewChanged", reloadTaskContainer);

  const hideDefault = () => {
    headerGridDiv.classList.add("hide");
    headerGridDiv.classList.remove("show");

    contentGridDiv.classList.add("hide");
    contentGridDiv.classList.remove("show");

    footerGridDiv.classList.add("hide");
    footerGridDiv.classList.remove("show");
  };

  const showDefault = () => {
    headerGridDiv.classList.add("show");
    headerGridDiv.classList.remove("hide");

    contentGridDiv.classList.add("show");
    contentGridDiv.classList.remove("hide");

    footerGridDiv.classList.add("show");
    footerGridDiv.classList.remove("hide");
  };

  const toggleShowHide = (payload) => {
    if (typeof payload !== "string") return undefined;

    let element;
    let hideDefaultElements = true;

    if (payload === "MENU") {
      element = menuDiv;
      hideDefaultElements = false;
    } else if (payload === "TASK") element = taskDetailsDiv;
    else if (payload === "SUBTASK") element = subtaskDetailsDiv;

    // Toggle menu element class hide/show
    if (element.classList.contains("hide")) {
      element.classList.remove("hide");
      element.classList.add("show");
      if (hideDefaultElements) hideDefault();
    } else if (element.classList.contains("show")) {
      element.classList.remove("show");
      element.classList.add("hide");
      showDefault();
    }

    return payload;
  };

  Events.on("toggleBtn", toggleShowHide);

  const renderTaskViewDisplay = () => {
    activeProjectText.textContent = taskView.project;
    activeFilterText.textContent = taskView.filter;
    activeFormatText.textContent = taskView.format;
  };

  Events.on("taskViewChanged", renderTaskViewDisplay);

  const populateTaskDetails = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;

    taskNameInput.value = payload.userSetName;

    const isoDate = new Date(payload.dueDate);
    const inputDateString = isoDate.toISOString().substring(0, 10);
    taskDateInput.value = inputDateString;

    if (payload.priority === 1) {
      priLowBtn.classList.remove("inactive");
      priMediumBtn.classList.add("inactive");
      priHighBtn.classList.add("inactive");
    } else if (payload.priority === 2) {
      priLowBtn.classList.add("inactive");
      priMediumBtn.classList.remove("inactive");
      priHighBtn.classList.add("inactive");
    } else if (payload.priority === 3) {
      priLowBtn.classList.add("inactive");
      priMediumBtn.classList.add("inactive");
      priHighBtn.classList.remove("inactive");
    }

    taskNotesTextarea.value = payload.notes;

    return payload.userSetName;
  };

  Events.on("detailsClicked", populateTaskDetails);
  Events.on("openedTaskSet", populateTaskDetails);

  const renderFilterBtns = () => {
    if (taskView.filter === taskViewOpts.filter.Week) {
      weekFilterBtn.classList.add("on");
      weekFilterBtn.classList.remove("off");
    } else if (taskView.filter !== taskViewOpts.filter.Week) {
      weekFilterBtn.classList.add("off");
      weekFilterBtn.classList.remove("on");
    }

    if (taskView.filter === taskViewOpts.filter.Month) {
      monthFilterBtn.classList.add("on");
      monthFilterBtn.classList.remove("off");
    } else if (taskView.filter !== taskViewOpts.filter.Month) {
      monthFilterBtn.classList.add("off");
      monthFilterBtn.classList.remove("on");
    }

    if (taskView.format === taskViewOpts.format.DateAscending) {
      dateSortBtn.classList.add("ascending", "on");
      dateSortBtn.classList.remove("descending");
      prioritySortBtn.classList.remove("on");
    } else if (taskView.format === taskViewOpts.format.DateDescending) {
      dateSortBtn.classList.add("descending", "on");
      dateSortBtn.classList.remove("ascending");
      prioritySortBtn.classList.remove("on");
    }

    if (taskView.format === taskViewOpts.format.PriorityAscending) {
      prioritySortBtn.classList.add("ascending", "on");
      prioritySortBtn.classList.remove("descending");
      dateSortBtn.classList.remove("on");
    } else if (taskView.format === taskViewOpts.format.PriorityDescending) {
      prioritySortBtn.classList.add("descending", "on");
      prioritySortBtn.classList.remove("ascending");
      dateSortBtn.classList.remove("on");
    }
  };

  Events.on("taskViewChanged", renderFilterBtns);
  Events.on("toggleBtn", renderFilterBtns);

  // #endregion

  // #region Button Event Response Methods

  // #region Task click event methods
  const newTaskClicked = () => {
    Events.emit("toggleBtn", "TASK");
    Events.once("taskCreated", setOpenedTask);
    Events.emit("createTask", {});
  };

  Events.on("newTaskClicked", newTaskClicked);

  const detailsClicked = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;

    openedTaskObject = payload;

    Events.emit("toggleBtn", "TASK");

    return openedTaskObject;
  };

  Events.on("detailsClicked", detailsClicked);

  const blurTaskName = () => {
    openedTaskObject.userSetName = taskNameInput.value;

    Events.emit(setTask, openedTaskObject);
  };

  Events.on("blurTaskName", blurTaskName);

  const blurTaskDate = () => {
    openedTaskObject.dueDate = taskDateInput.value;

    Events.emit(setTask, openedTaskObject);
  };

  Events.on("blurTaskDate", blurTaskDate);

  const priorityClicked = (payload) => {
    if (payload === "LOW") {
      openedTaskObject.priority = 1;
    } else if (payload === "MEDIUM") {
      openedTaskObject.priority = 2;
    } else if (payload === "HIGH") {
      openedTaskObject.priority = 3;
    }
    setTask(openedTaskObject);
    populateTaskDetails(openedTaskObject);
  };

  Events.on("priorityClicked", priorityClicked);

  const blurTaskNotes = () => {
    openedTaskObject.notes = taskNotesTextarea.value;

    Events.emit("setTask", openedTaskObject);
  };

  Events.on("blurTaskNotes", blurTaskNotes);

  // #endregion

  // #region Format btns event methods

  const filterMonth = () => {
    taskView.filter =
      taskView.filter !== taskViewOpts.filter.Month
        ? taskViewOpts.filter.Month
        : taskViewOpts.filter.All;

    Events.emit("taskViewChanged");
  };

  Events.on("filterMonth", filterMonth);

  const filterWeek = () => {
    taskView.filter =
      taskView.filter !== taskViewOpts.filter.Week
        ? taskViewOpts.filter.Week
        : taskViewOpts.filter.All;

    Events.emit("taskViewChanged");
  };

  Events.on("filterWeek", filterWeek);

  const sortPriority = () => {
    taskView.format =
      taskView.format !== taskViewOpts.format.PriorityDescending
        ? taskViewOpts.format.PriorityDescending
        : taskViewOpts.format.PriorityAscending;

    Events.emit("taskViewChanged");
  };

  Events.on("sortPriority", sortPriority);

  const sortDate = () => {
    taskView.format =
      taskView.format !== taskViewOpts.format.DateAscending
        ? taskViewOpts.format.DateAscending
        : taskViewOpts.format.DateDescending;

    Events.emit("taskViewChanged");
  };

  Events.on("sortDate", sortDate);

  // #endregion

  // #endregion

  // Init method
  const init = () => {
    // Create default html elements
    mainGridDiv = mainGrid();
    headerGridDiv = headerGrid(mainGridDiv);
    contentGridDiv = contentGrid(mainGridDiv);
    footerGridDiv = footerGrid(mainGridDiv);
    menuDiv = menuGrid(mainGridDiv);
    taskDetailsDiv = taskDetailsGrid(mainGridDiv);
    subtasksDisplayGrid(mainGridDiv);
  };
  // Listen for init event and call init method
  Events.on("init", init);

  return { requestTaskForLoading, requestSubtasksForLoading };
})();

export default domManager;
