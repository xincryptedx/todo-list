import newElement from "./domElementBuilder";
import Events from "./events";
import Icons from "./icons";

const domManager = (() => {
  // #region References and State variables
  // Element container references
  let mainGridDiv;

  let headerGridDiv;
  let contentGridDiv;
  let footerGridDiv;

  let menuDiv;
  let taskDetailsDiv;
  let subtaskDetailsDiv;
  let logDiv;
  let helpDiv;

  let taskContainer;
  let projectContainer;
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

  let subtaskTaskName;
  let subtaskTaskProject;

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
    selectedProjectSetName: "",
    generalProject: "",
    trashProject: "",
  };

  // Gets the uids for general project and trash project
  const setDefaultProjects = (payload) => {
    if (payload.general && payload.trash) {
      taskViewOpts.generalProject = payload.general;
      taskViewOpts.trashProject = payload.trash;
    }
  };

  Events.on("setDefaultProjects", setDefaultProjects);

  const getDefaultProjects = () => {
    Events.emit("getDefaultProjects");
  };

  Events.on("dataLoaded", getDefaultProjects);

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

  const touch = {
    startX: null,
    startY: null,
  };

  let isScrolling = false;

  const setScrollTimeout = (container) => {
    clearTimeout(container.scrollTimeout);
    const containerToSet = container;
    containerToSet.scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 250); // set the timeout to the duration of the scroll event
  };

  // #endregion

  // #region Init helper methods

  const addScrollTimeoutEvent = (element) => {
    element.addEventListener("scroll", () => {
      isScrolling = true;
      setScrollTimeout(element);
    });
  };

  // Helper method for adding touch and hold events to an element
  const addTouchAndHoldEvents = (payload) => {
    let touchTimer;
    const touchTimeout = 500;

    payload.element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    payload.element.addEventListener(
      "touchstart",
      () => {
        touchTimer = setTimeout(() => {
          Events.emit("checkDelete", payload);
        }, touchTimeout);
      },
      { passive: true }
    );

    payload.element.addEventListener("touchend", () => {
      clearTimeout(touchTimer);
    });
  };

  // Helper method for adding touch events that check for a swipe
  const addSwipeToDeleteEvents = (element, type) => {
    // Set the initial touch coordinates to null
    touch.startX = null;
    touch.startY = null;

    const distanceThreshold = 0.4 * window.innerWidth;

    // Add touch event listeners to the element
    element.addEventListener(
      "touchstart",
      (e) => {
        // Get the coordinates of the initial touch
        if (!isScrolling) {
          touch.startX = e.touches[0].clientX;
          touch.startY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );

    element.addEventListener("touchend", (e) => {
      if (!isScrolling) {
        // Get the coordinates of the end touch
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        // Calculate the distance traveled in the X and Y directionss
        const deltaX = endX - touch.startX;
        const deltaY = endY - touch.startY;

        // Check if the distance traveled in the X direction is greater than the distance traveled in the Y direction
        if (
          Math.abs(deltaX) >= distanceThreshold &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          // If the distance traveled in the X direction is greater, check the direction of the swipe
          if (deltaX > 0) {
            // If the swipe is to the right
            if (type === "SUBTASK") {
              const focusedElement = document.activeElement;
              if (focusedElement) {
                focusedElement.blur();
              }
              Events.emit("deleteUID", element.dataset.uid);
            } else if (type === "TASK") {
              Events.emit("moveToTrash", element.dataset.uid);
            }
          } else {
            // If the swipe is to the left
          }
        }
      }
    });
  };

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
      classList: ["grid-container", "header", "show", "display-grid-1024"],
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
      classList: ["div-btn", "header-btn", "menu-btn", "show-1024"],
      parent: element,
    });
    menuBtn.addEventListener("click", () =>
      Events.emit("toggleBtn", { query: "MENU" })
    );
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
    const activeProjectContainer = newElement({
      tag: "div",
      classList: [
        "grid-container",
        "task-view-container",
        "active-project-container",
      ],
      parent: taskViewDisplayDiv,
    });
    activeProjectText = newElement({
      tag: "p",
      classList: "active-project-text",
      parent: activeProjectContainer,
    });
    const activeFilterContainer = newElement({
      tag: "div",
      classList: [
        "grid-container",
        "task-view-container",
        "active-filter-container",
      ],
      parent: taskViewDisplayDiv,
    });
    activeFilterText = newElement({
      tag: "p",
      classList: "active-filter-text",
      parent: activeFilterContainer,
    });
    const activeFormatContainer = newElement({
      tag: "div",
      classList: [
        "grid-container",
        "task-view-container",
        "active-format-container",
      ],
      parent: taskViewDisplayDiv,
    });
    activeFormatText = newElement({
      tag: "p",
      classList: "active-format-text",
      parent: activeFormatContainer,
    });
    // Generated tasks go here
    taskContainer = newElement({
      tag: "div",
      classList: ["grid-container", "tasks"],
      parent: element,
    });
    addScrollTimeoutEvent(taskContainer);

    return element;
  };

  // Create footer
  const footerGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "footer", "show", "display-grid-1024"],
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

    const helpBtn = newElement({
      tag: "div",
      classList: ["div-btn", "footer-btn", "help-btn", "display-none-769"],
      parent: element,
    });
    helpBtn.addEventListener("click", () => Events.emit("helpBtnClicked"));
    const helpIcon = newElement({
      tag: "div",
      classList: ["icon", "help-icon"],
      parent: helpBtn,
    });
    helpIcon.innerHTML = Icons.help;

    return element;
  };

  // Create menu
  const menuGrid = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "menu", "hide", "display-grid-1024"],
      parent,
    });
    // Projects selection
    projectContainer = newElement({
      tag: "div",
      classList: ["grid-container", "projects"],
      parent: element,
    });
    addScrollTimeoutEvent(projectContainer);
    // Generated projects go here
    // New project btn
    const newProjectDiv = newElement({
      tag: "div",
      classList: ["span-btn-container", "new-project-div"],
      parent: element,
    });
    const newProjectBtn = newElement({
      tag: "span",
      classList: ["span-btn", "new-project-span-btn"],
      parent: newProjectDiv,
      textContent: "New Project +",
    });
    newProjectBtn.addEventListener("click", () => {
      Events.emit("newProjectClicked");
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
      Events.emit("dateBtnClicked");
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
      Events.emit("toggleBtn", { query: "TASK" });
    });
    const closeIcon = newElement({
      tag: "div",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    closeIcon.innerHTML = Icons.back;
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
      classList: ["grid-container", "subtask-task-details"],
      parent: element,
    });
    subtaskTaskName = newElement({
      tag: "p",
      classList: "task-name",
      parent: taskInfoGrid,
    });
    subtaskTaskProject = newElement({
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
    addSubtaskBtnTop.addEventListener("click", () => {
      Events.emit("newSubtaskClicked");
    });
    const addSubtaskIcon = newElement({
      tag: "div",
      classList: ["icon", "add-subtask-icon"],
      parent: addSubtaskBtnTop,
    });
    addSubtaskIcon.innerHTML = Icons.newTask;
    // Close btn
    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "close-btn"],
      parent: element,
    });
    closeBtn.addEventListener("click", () => {
      Events.emit("toggleBtn", { query: "SUBTASK" });
    });
    const closeIcon = newElement({
      tag: "div",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    closeIcon.innerHTML = Icons.back;
    // Set global variable for subtask container
    subtaskContainer = newElement({
      tag: "div",
      classList: ["grid-container", "subtasks"],
      parent: element,
    });
    addScrollTimeoutEvent(subtaskContainer);
    // Generated subtasks go here

    return element;
  };

  // Create log elements
  const logContainerDiv = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "log-container", "hide"],
      parent,
    });

    newElement({
      tag: "p",
      classList: "log-text",
      parent: element,
    });

    return element;
  };

  // Create help elements
  const helpContainerDiv = (parent) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "help", "hide"],
      parent,
    });

    newElement({
      tag: "p",
      classList: "help-title",
      parent: element,
      textContent: "Tips:",
    });

    const closeBtn = newElement({
      tag: "div",
      classList: ["div-btn", "help-div-btn", "close-btn"],
      parent: element,
    });
    closeBtn.addEventListener("click", () => {
      Events.emit("toggleBtn", { query: "HELP" });
    });
    const closeIcon = newElement({
      tag: "div",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    closeIcon.innerHTML = Icons.back;

    const helpTextContainer = newElement({
      tag: "div",
      classList: ["grid-container", "help-text-container"],
      parent: element,
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent:
        "New tasks are created in the selected project, found in the menu.",
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent:
        "You can swipe right on a task to move it to the trash and back.",
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent: "You can swipe right on a subtask to delete it.",
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent:
        "You touch and hold a project in the menu to delete it and all of its tasks.",
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent:
        "Use the format buttons in the menu to change how tasks are filtered and sorted.",
    });

    newElement({
      tag: "p",
      classList: "help-text",
      parent: helpTextContainer,
      textContent:
        "Data is saved in local storage. Clearing browser history/cache will delete stored data.",
    });

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
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(taskData.dueDate);
    newElement({
      tag: "p",
      classList: ["date-text", "show-480-plus"],
      parent: taskContentsGrid,
      textContent: date.toLocaleDateString("en-US", options),
    });
    // Details btn
    const detailsBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-btn", "details-btn"],
      parent: taskContentsGrid,
    });
    detailsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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
    subtasksBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      Events.emit("subtasksClicked", taskData);
    });
    const subtaskIcon = newElement({
      tag: "div",
      classList: ["icon", "subtasks-icon"],
      parent: subtasksBtn,
    });
    subtaskIcon.innerHTML = Icons.subtasks;
    // Delete btn
    const deleteBtn = newElement({
      tag: "div",
      classList: ["div-btn", "menu-btn", "delete-btn", "show-769-plus"],
      parent: taskContentsGrid,
    });
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      Events.emit("deleteTaskClicked", taskData);
    });
    const deleteIcon = newElement({
      tag: "div",
      classList: ["icon", "delete-icon"],
      parent: deleteBtn,
    });
    deleteIcon.innerHTML = Icons.trash;

    if (taskData.uid) element.setAttribute("data-UID", taskData.uid);
    else element.setAttribute("data-UID-Error", "ERROR");

    addSwipeToDeleteEvents(element, "TASK");
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

    if (subtaskData.uid) element.setAttribute("data-UID", subtaskData.uid);
    else {
      element.setAttribute("data-UID-Error", "ERROR");
      return undefined;
    }

    const subtaskDetailsInput = newElement({
      tag: "input",
      type: "text",
      classList: ["text-input", "subtask-description"],
      parent: element,
    });
    subtaskDetailsInput.value = description;
    const checkbox = newElement({
      tag: "input",
      type: "checkbox",
      classList: "subtask-checkbox",
      parent: element,
    });
    subtaskDetailsInput.addEventListener("blur", () => {
      Events.emit("subtaskBlurred", {
        data: subtaskData,
        input: subtaskDetailsInput,
      });
    });
    // Delete btn
    const deleteBtn = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-btn", "delete-btn", "show-769-plus"],
      parent: element,
    });
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      Events.emit("deleteSubtaskClicked", subtaskData);
    });
    const deleteIcon = newElement({
      tag: "div",
      classList: ["icon", "delete-icon"],
      parent: deleteBtn,
    });
    deleteIcon.innerHTML = Icons.trash;

    checkbox.checked = initialCheckedState;

    addSwipeToDeleteEvents(element, "SUBTASK");
    checkbox.addEventListener("click", () => {
      Events.emit("subtaskChecked", { data: subtaskData, input: checkbox });
    });

    return element;
  };

  const newProject = (parent, projectData) => {
    if (!(parent instanceof HTMLElement)) return undefined;

    const isDefaultType =
      projectData.type === "trash" || projectData.type === "general";

    const element = newElement({
      tag: "div",
      classList: ["grid-container", "project"],
      parent,
    });

    if (projectData.uid) element.setAttribute("data-UID", projectData.uid);
    else {
      element.setAttribute("data-UID-Error", "ERROR");
      return undefined;
    }

    const projectText = newElement({
      tag: "p",
      classList: ["menu-text", "project-text", "show"],
      textContent: projectData.userSetName,
      parent: element,
    });
    projectText.addEventListener("click", () => {
      Events.emit("projectTextClicked", projectData);
    });

    if (!isDefaultType) {
      const labelContainer = newElement({
        tag: "div",
        classList: ["grid-container", "project-label-container"],
        parent: element,
      });
      const projectLabel = newElement({
        tag: "label",
        for: `project${projectData.uid}`,
        classList: ["menu-label", "project-input-label"],
        parent: labelContainer,
        textContent: "✎",
      });
      const projectInput = newElement({
        tag: "input",
        type: "text",
        id: `project${projectData.uid}`,
        classList: ["menu-text-input", "project-input", "hide"],
        parent: element,
      });

      projectLabel.addEventListener("click", (e) => {
        e.preventDefault();
        Events.emit("projectLabelClicked", {
          projectData,
          projectInput,
          projectText,
          projectElement: element,
        });
      });
      projectInput.addEventListener("blur", () => {
        Events.emit("blurProjectInput", {
          projectData,
          projectInput,
          projectText,
        });
      });
      // Delete btn
      const deleteBtn = newElement({
        tag: "div",
        classList: ["div-btn", "tasks-btn", "delete-btn", "show-769-plus"],
        parent: element,
      });
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        Events.emit("deleteProjectClicked", projectData);
      });
      const deleteIcon = newElement({
        tag: "div",
        classList: ["icon", "delete-icon"],
        parent: deleteBtn,
      });
      deleteIcon.innerHTML = Icons.trash;
    }

    addTouchAndHoldEvents({ element, data: projectData });

    return element;
  };

  // #endregion

  // #region Methods for loading projects, tasks and subtasks from data object and into containers

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

    const projects = () => {
      if (projectContainer && projectContainer instanceof HTMLElement) {
        while (projectContainer.firstChild) {
          projectContainer.removeChild(projectContainer.lastChild);
        }
      }
      return projectContainer;
    };

    return { tasks, subtasks, projects };
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
    if (!payload) {
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

  const loadProjects = (payload) => {
    if (!payload) {
      return undefined;
    }

    emptyContainer.projects();

    Object.keys(payload).forEach((key) => {
      newProject(projectContainer, payload[key]);
    });

    return projectContainer;
  };

  const requestProjectsForLoading = () => {
    const request = { query: "ALLPROJECTS" };

    Events.once("returnData", loadProjects);
    Events.emit("requestData", request);
  };

  // #endregion

  // #region Methods for updating html elements when their corresponding data is changed

  const setProject = (payload) => {
    if (!payload || typeof payload !== "object" || !payload.uid) {
      return undefined;
    }

    const oldProjectElement = document.querySelector(
      `[data-uid="${payload.uid}"]`
    );

    if (!oldProjectElement) {
      return undefined;
    }

    const newProjectElement = newProject(oldProjectElement.parentNode, payload);

    oldProjectElement.replaceWith(newProjectElement);

    Events.emit("projectSet");

    return newProjectElement;
  };

  Events.on("setProject", setProject);

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

  const setSubtask = (payload) => {
    if (
      !dataLoaded ||
      !payload ||
      typeof payload !== "object" ||
      !payload.uid ||
      !openedTaskObject
    ) {
      return undefined;
    }

    const oldSubtaskElement = subtaskContainer.querySelector(
      `[data-uid="${payload.uid}"]`
    );

    if (!oldSubtaskElement) return undefined;

    const newSubtaskElement = newSubtask(oldSubtaskElement.parentNode, payload);

    oldSubtaskElement.replaceWith(newSubtaskElement);

    Events.emit("subtaskSet");

    return newSubtaskElement;
  };

  Events.on("setSubtask", setSubtask);

  const reloadTaskContainer = () => {
    if (!dataLoaded) return;

    const request = { query: "", format: "", filter: "" };

    // Use taskView to create task load request
    if (taskView.project === taskViewOpts.project.UserMade) {
      request.query = `${taskView.project}${taskViewOpts.selectedUserProject}`;
    } else request.query = taskView.project;

    request.format = taskView.format;

    request.filter = taskView.filter;

    requestTaskForLoading(request);
  };

  Events.on("toggleBtn", reloadTaskContainer);
  Events.on("dataLoaded", reloadTaskContainer);
  Events.on("taskViewChanged", reloadTaskContainer);
  Events.on("trashMoved", reloadTaskContainer);
  Events.on("projectDeleted", reloadTaskContainer);

  const hideDefault = () => {
    headerGridDiv.classList.add("hide");
    headerGridDiv.classList.remove("show");

    contentGridDiv.classList.add("hide");
    contentGridDiv.classList.remove("show");

    footerGridDiv.classList.add("hide");
    footerGridDiv.classList.remove("show");

    menuDiv.classList.add("hide");
    menuDiv.classList.remove("show");
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
    if (typeof payload !== "object" || !payload.query) return undefined;

    let element;
    let pairedElement;
    let hideDefaultElements = true;

    if (payload.query === "MENU") {
      element = menuDiv;
      hideDefaultElements = false;
    } else if (payload.query === "TASK") element = taskDetailsDiv;
    else if (payload.query === "SUBTASK") element = subtaskDetailsDiv;
    else if (payload.query === "PROJECT" && payload.uid) {
      const projectDiv = projectContainer.querySelector(
        `[data-uid="${payload.uid}"]`
      );
      element = projectDiv.querySelector(".project-text");
      pairedElement = projectDiv.querySelector(".project-input");

      hideDefaultElements = false;
    } else if (payload.query === "HELP") {
      element = helpDiv;
      hideDefaultElements = true;
    } else return undefined;

    if (!element) return undefined;

    // Toggle the paired element if needed
    if (pairedElement) {
      if (element.classList.contains("show")) {
        pairedElement.classList.remove("hide");
        pairedElement.classList.add("show");
      } else if (element.classList.contains("hide")) {
        pairedElement.classList.remove("show");
        pairedElement.classList.add("hide");
      }
    }

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

    Events.emit("elementToggled");

    return payload;
  };

  Events.on("toggleBtn", toggleShowHide);

  const renderTaskViewDisplay = () => {
    if (taskView.project === taskViewOpts.project.All) {
      activeProjectText.textContent = "All Tasks";
    } else if (taskView.project === taskViewOpts.project.General) {
      activeProjectText.textContent = "General";
    } else if (taskView.project === taskViewOpts.project.Trash) {
      activeProjectText.textContent = "Trash";
    } else activeProjectText.textContent = taskViewOpts.selectedProjectSetName;

    if (taskView.filter === taskViewOpts.filter.All) {
      activeFilterText.textContent = "Anytime";
    } else if (taskView.filter === taskViewOpts.filter.Month) {
      activeFilterText.textContent = "This Month";
    } else if (taskView.filter === taskViewOpts.filter.Week) {
      activeFilterText.textContent = "This Week";
    }

    if (taskView.format === taskViewOpts.format.DateAscending) {
      activeFormatText.textContent = "Date Asc.";
    } else if (taskView.format === taskViewOpts.format.DateDescending) {
      activeFormatText.textContent = "Date Desc.";
    } else if (taskView.format === taskViewOpts.format.PriorityAscending) {
      activeFormatText.textContent = "Priority Asc.";
    } else if (taskView.format === taskViewOpts.format.PriorityDescending) {
      activeFormatText.textContent = "Priority Desc.";
    }
  };

  Events.on("dataLoaded", renderTaskViewDisplay);
  Events.on("taskViewChanged", renderTaskViewDisplay);

  const reloadProjectContainer = () => {
    if (!dataLoaded) return;

    requestProjectsForLoading();
  };

  Events.on("projectSet", reloadProjectContainer);
  Events.on("dataLoaded", reloadProjectContainer);
  Events.on("projectDeleted", reloadProjectContainer);

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

  const renderProjectColors = () => {
    const allTextElements = projectContainer.querySelectorAll(".menu-text");
    if (allTextElements) {
      for (let i = 0; i < allTextElements.length; i += 1) {
        allTextElements[i].classList.remove("highlight");
      }
    }

    if (taskView.project === taskViewOpts.project.General) {
      const textToColor = projectContainer.querySelector(
        `[data-uid="${taskViewOpts.generalProject}"] p`
      );

      if (textToColor) {
        textToColor.classList.add("highlight");
      }
    } else if (taskView.project === taskViewOpts.project.Trash) {
      const textToColor = projectContainer.querySelector(
        `[data-uid="${taskViewOpts.trashProject}"] p`
      );

      if (textToColor) {
        textToColor.classList.add("highlight");
      }
    } else if (taskView.project === taskViewOpts.project.UserMade) {
      const textToColor = projectContainer.querySelector(
        `[data-uid="${taskViewOpts.selectedUserProject}"] p`
      );

      if (textToColor) {
        textToColor.classList.add("highlight");
      }
    }
  };

  Events.on("taskViewChanged", renderProjectColors);

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

  const renderSubtaskTaskDetails = () => {
    if (openedTaskObject) {
      subtaskTaskName.textContent = openedTaskObject.userSetName;
      subtaskTaskProject.textContent = openedTaskObject.projectSetName;
    }
  };

  Events.on("openedTaskSetForSubtasks", renderSubtaskTaskDetails);

  const reloadSubtaskContainer = () => {
    if (!dataLoaded) return;

    const request = { query: `SUBTASKS${openedTaskObject.uid}` };

    requestSubtasksForLoading(request);
  };

  Events.on("setSubtask", reloadSubtaskContainer);
  Events.on("openedTaskSetForSubtasks", reloadSubtaskContainer);
  Events.on("subtaskDeleted", reloadSubtaskContainer);

  const renderLog = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;
    const pElement = logDiv.firstChild;
    pElement.textContent = payload.log;

    logDiv.classList.add("show");
    logDiv.classList.remove("hide");

    setTimeout(() => {
      logDiv.classList.remove("show");
      logDiv.classList.add("hide");
    }, payload.timeout);

    return logDiv;
  };

  Events.on("log", renderLog);

  const updateViewOnProjectDelete = () => {
    taskView.project = taskViewOpts.project.All;
    Events.emit("taskViewChanged");
  };

  Events.on("projectDeleted", updateViewOnProjectDelete);

  // #endregion

  // #region Button Event Response Methods

  const helpBtnClicked = () => {
    Events.emit("toggleBtn", { query: "HELP" });
  };

  Events.on("helpBtnClicked", helpBtnClicked);

  // #region Task event methods
  const newTaskClicked = () => {
    Events.emit("toggleBtn", { query: "TASK" });
    Events.once("taskCreated", setOpenedTask);
    // Create task in proper project
    if (
      taskView.project === taskViewOpts.project.General ||
      taskView.project === taskViewOpts.project.All
    ) {
      Events.emit("createTask", {});
    } else if (taskView.project === taskViewOpts.project.UserMade) {
      Events.emit("createTask", {
        projectUID: taskViewOpts.selectedUserProject,
      });
    }
  };

  Events.on("newTaskClicked", newTaskClicked);

  const focusNewTaskInput = () => {
    taskNameInput.focus();
  };

  Events.on("openedTaskSet", focusNewTaskInput);

  const taskClicked = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;

    const dataObject = payload;
    if (payload.checked === true || payload.checked === false) {
      dataObject.checked = !dataObject.checked;
    }

    return dataObject;
  };

  Events.on("taskClicked", taskClicked);

  const detailsClicked = (payload) => {
    if (!payload || typeof payload !== "object") return undefined;

    openedTaskObject = payload;

    Events.emit("toggleBtn", { query: "TASK" });

    return openedTaskObject;
  };

  Events.on("detailsClicked", detailsClicked);

  const subtasksClicked = (payload) => {
    openedTaskObject = payload;
    Events.emit("openedTaskSetForSubtasks");
    Events.emit("toggleBtn", { query: "SUBTASK" });
  };

  Events.on("subtasksClicked", subtasksClicked);

  const deleteTaskClicked = (payload) => {
    Events.emit("moveToTrash", payload.uid);
  };

  Events.on("deleteTaskClicked", deleteTaskClicked);

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

  const dateBtnClicked = () => {
    taskDateInput.focus();
  };

  Events.on("dateBtnClicked", dateBtnClicked);

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

  // #region Project event methods
  let activeProjectElements;
  const updateReturnedProject = (payload) => {
    if (!payload.uid) return undefined;

    const activeProjectData = payload;

    activeProjectData.userSetName = activeProjectElements.projectInput.value;

    return payload;
  };

  const blurProjectInput = (payload) => {
    if (
      !payload.projectData.uid ||
      !payload.projectText ||
      !payload.projectInput
    ) {
      return undefined;
    }

    activeProjectElements = payload;

    Events.once("returnData", updateReturnedProject);
    Events.emit("requestData", {
      query: `DATAPROJECT${payload.projectData.uid}`,
    });

    return payload.projectInput;
  };

  Events.on("blurProjectInput", blurProjectInput);

  const projectLabelClicked = (payload) => {
    if (payload.projectElement.classList.contains("check-delete")) {
      Events.emit("deleteProject", payload.projectData);
    } else {
      Events.once("elementToggled", () => {
        payload.projectInput.focus();
      });
      Events.emit("toggleBtn", {
        query: "PROJECT",
        uid: payload.projectData.uid,
      });
      const { projectInput } = payload;
      projectInput.value = payload.projectText.textContent;
    }
  };

  Events.on("projectLabelClicked", projectLabelClicked);

  const deleteProjectClicked = (payload) => {
    const focusedElement = document.activeElement;
    if (focusedElement) {
      focusedElement.blur();
    }

    Events.emit("deleteProject", payload);
  };

  Events.on("deleteProjectClicked", deleteProjectClicked);

  const projectTextClicked = (payload) => {
    if (!payload.uid) return undefined;

    if (payload.type === "usermade") {
      if (
        taskViewOpts.selectedUserProject === payload.uid &&
        taskView.project === taskViewOpts.project.UserMade
      ) {
        taskView.project = taskViewOpts.project.All;
      } else {
        taskViewOpts.selectedUserProject = payload.uid;
        taskViewOpts.selectedProjectSetName = payload.userSetName;
        taskView.project = taskViewOpts.project.UserMade;
      }
    } else if (payload.type === "general") {
      if (taskView.project === taskViewOpts.project.General) {
        taskView.project = taskViewOpts.project.All;
      } else taskView.project = taskViewOpts.project.General;
    } else if (payload.type === "trash") {
      if (taskView.project === taskViewOpts.project.Trash) {
        taskView.project = taskViewOpts.project.All;
      } else taskView.project = taskViewOpts.project.Trash;
    }

    Events.emit("taskViewChanged");

    return taskView;
  };

  Events.on("projectTextClicked", projectTextClicked);

  const focusNewProject = () => {
    reloadProjectContainer();
    const elements = projectContainer.querySelectorAll(".project-input-label");
    const element = elements[elements.length - 1];
    element.click();
  };

  const newProjectClicked = () => {
    Events.once("setProject", focusNewProject);
    Events.emit("createProject", {});
  };

  Events.on("newProjectClicked", newProjectClicked);

  const checkProjectDelete = (payload) => {
    if (!payload.data.type || !(payload.element instanceof HTMLElement))
      return undefined;

    if (payload.data.type === "general" || payload.data.type === "trash")
      return undefined;

    const { element } = payload;

    const projectLabel = element.querySelector(".project-input-label");

    element.classList.toggle("check-delete");

    if (projectLabel && element.classList.contains("check-delete")) {
      projectLabel.textContent = "X";
    } else if (projectLabel) {
      projectLabel.textContent = "✎";
    }

    document.addEventListener(
      "click",
      () => {
        const projects = projectContainer.querySelectorAll(".project");
        if (projects) {
          Object.values(projects).forEach((project) => {
            project.classList.remove("check-delete");
          });
          if (projectLabel) {
            projectLabel.textContent = "✎";
          }
        }
      },
      { once: true, passive: true }
    );

    return payload;
  };

  Events.on("checkDelete", checkProjectDelete);

  // #endregion

  // #region Subtasks Event Methods
  const newSubtaskClicked = () => {
    Events.emit("createSubtask", { taskUID: openedTaskObject.uid });
  };

  Events.on("newSubtaskClicked", newSubtaskClicked);

  const focusNewSubtaskInput = () => {
    const elements = subtaskContainer.querySelectorAll(".text-input");
    if (!elements) return undefined;

    const elementToFocus = elements[elements.length - 1];
    if (!elementToFocus) return undefined;

    elementToFocus.focus();
    return elementToFocus;
  };

  Events.on("subtaskCreated", focusNewSubtaskInput);

  const subtaskBlurred = (payload) => {
    if (!payload.data || typeof payload.data !== "object") return undefined;

    const activeSubtask = payload.data;

    activeSubtask.description = payload.input.value;

    return activeSubtask;
  };

  Events.on("subtaskBlurred", subtaskBlurred);

  const subtaskChecked = (payload) => {
    if (!payload.data || typeof payload.data !== "object") return undefined;

    const activeSubtask = payload.data;
    const activeInput = payload.input;

    if (!activeSubtask || !activeInput) return undefined;

    activeSubtask.checked = !activeSubtask.checked;

    return activeSubtask;
  };

  Events.on("subtaskChecked", subtaskChecked);

  const deleteSubtaskClicked = (payload) => {
    const focusedElement = document.activeElement;
    if (focusedElement) {
      focusedElement.blur();
    }
    Events.emit("deleteUID", payload.uid);
  };

  Events.on("deleteSubtaskClicked", deleteSubtaskClicked);

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
    subtaskDetailsDiv = subtasksDisplayGrid(mainGridDiv);
    logDiv = logContainerDiv(mainGridDiv);
    helpDiv = helpContainerDiv(mainGridDiv);
  };
  // Listen for init event and call init method
  Events.on("init", init);

  return { requestTaskForLoading, requestSubtasksForLoading };
})();

export default domManager;
