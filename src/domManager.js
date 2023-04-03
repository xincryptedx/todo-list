// #region Default Dom Structure
/* 
       -mainGridContainer div
         -headerGridContainer div
           -title p
           -newTaskBtn div
             -icon img
           -mainMenuBtn div
             -icon img
         -contentGridContainer div
            
           ~task divs
              -priorityOutline div
              -taskGridContainer div
                  -name p
                  -project p
                  -taskDetailsBtn div
                    -icon img
                  -subtasksBtn div
                    -icon img

            -newTaskBtn div
              -icon img
         -footerGridContainer
           -author<a> p
           -attributions ???
         -mainMenuGridContainer div
           -projectsGridContainer div
             -allTasks div
               -allTasksBtn span
             -generalTasks div
               -generalTasksBtn -span

             ~projects divs
               -projectBtn -span

             -newProject div
               -newProjectBtn span
           -formatBtnsGridContainer div
             -weekFilterBtn div
               -name p
             -monthFilterBtn
               -name p
             -prioritySortIconGridContainer div
               -colorOne div
               -colorTwo div
               -colorThree div
             -dateSortIconGridContainer div
               -dateOne div
                 -date p
               -dateTwo div
                 -date p
               -dateThree div
                 -date p
         -taskDetailsGridContainer div 
           -taskNameLabel label
           -dateBtn div
             -icon img
           -hasSubtasksBtn div
             -icon img
           -closeMenuBtn div
             -icon img
           -taskNameInput input
           -priorityBtnsGridContainer
             -lowBtn div
               -name p
             -medBtn div
               -name p
             -highBtn div
               -name p
           -notesLabel label
           -notesTextArea textArea
         -subtasksGridContainer div
           -taskDetailsGridContainer div
             -taskName p
             -taskProject p
           -addSubtaskBtn div
             -icon img
           -closeMenuBtn div
             -icon img
           -subtasksGridContainer

             ~subtaskDivs divs
               -name p
               -checkbox input

           -addSubtaskBtn
             -imgIcon
          */

// #endregion

import newElement from "./domElementBuilder";
import Events from "./events";

const domManager = (() => {
  let taskContainer;
  let subtaskContainer;

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
    // New task bottom button
    const newTaskBtn = newElement({
      tag: "div",
      classList: ["div-btn", "content-btn", "new-task-btn"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "new-task-icon"],
      parent: newTaskBtn,
    });

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
      classList: ["grid-container", "menu"],
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
      classList: ["grid-container", "task-details"],
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
    newElement({
      tag: "img",
      classList: ["icon", "close-icon"],
      parent: closeBtn,
    });
    // Name input
    newElement({
      tag: "input",
      classList: ["text-input", "task-details-text-input", "task-name-input"],
      id: "task-name-input",
      parent: element,
    });
    // Priority btns
    const priorityBtnsGridContainer = newElement({
      tag: "div",
      classList: ["grid-container", "priority-btns"],
      parent: element,
    });
    // Low btn
    const lowBtn = newElement({
      tag: "div",
      classList: ["div-btn", "task-details-div-btn", "low-btn"],
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
      classList: ["div-btn", "task-details-div-btn", "medium-btn"],
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
      classList: ["div-btn", "task-details-div-btn", "high-btn"],
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
      classList: ["grid-container", "subtasks-display"],
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
    const addSubtaskBtnBottom = newElement({
      tag: "div",
      classList: ["div-btn", "subtasks-div-btn", "add-subtask-btn", "bottom"],
      parent: element,
    });
    newElement({
      tag: "img",
      classList: ["icon", "add-subtask-icon"],
      parent: addSubtaskBtnBottom,
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
    newElement({
      tag: "div",
      classList: ["task-outline", priorityClass],
      parent: element,
    });
    // Task contents grid
    const taskContentsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "task-contents"],
      parent: element,
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

    return element;
  };

  // #endregion

  // Load projects from data object

  // Remove html child objects from taskContainer
  const emptyTaskContainer = (() => {
    const tasks = () => {
      if (taskContainer && taskContainer instanceof HTMLElement) {
        while (taskContainer.firstChild) {
          taskContainer.removeChild(taskContainer.lastChild);
        }
      }
    };

    return { tasks };
  })();

  // Load tasks from data
  const loadTasks = (payload) => {
    // Generate tasks based on payload data
    console.log(`Got payload for tasks loading: `);
    console.dir(payload);

    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return undefined;
    }

    emptyTaskContainer.tasks();

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

  // Open menus (main, taskDetails, subtasks)
  // Close menus (same)
  // Activate a date input
  // Focus an input
  // Get value of input
  /* Method that will hide the p element on a subtask and unhide
     a text input that has the current subtask name as its value */
  // Method that does the reverse of the above
  // Method for toggling appearance of filterBtn icons
  // Init method
  const init = () => {
    const mainGridDiv = mainGrid();
    headerGrid(mainGridDiv);
    taskContainer = contentGrid(mainGridDiv);
    footerGrid(mainGridDiv);
    menuGrid(mainGridDiv);
    taskDetailsGrid(mainGridDiv);
    subtasksDisplayGrid(mainGridDiv);
  };
  // Listen for init event and call init method
  Events.on("init", init);

  return { requestTaskForLoading };
})();

export default domManager;
