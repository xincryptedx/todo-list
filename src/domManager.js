/* Default Dom Structure 
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

import newElement from "./domElementBuilder";

const domManager = (() => {
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
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "content"],
      parent,
    });
    // Generated tasks go here
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

    const projectsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "projects"],
      parent: element,
    });
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

    const formatBtnsGrid = newElement({
      tag: "div",
      classList: ["grid-container", "format-btns"],
      parent: element,
    });
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

    newElement({
      tag: "label",
      classList: ["task-details-label", "task-name-label"],
      parent: element,
      textContent: "Name:",
      for: "task-name-input",
    });
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
    newElement({
      tag: "input",
      classList: ["text-input", "task-details-text-input", "task-name-input"],
      id: "task-name-input",
      parent: element,
    });
    const priorityBtnsGridContainer = newElement({
      tag: "div",
      classList: ["grid-container", "priority-btns"],
      parent: element,
    });
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

    newElement({
      tag: "div",
      classList: ["grid-container", "subtasks"],
      parent: element,
    });
    // Generated subtasks go here

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

  // Method for creating task divs
  const taskGrid = (parent, uid) => {
    const element = newElement({
      tag: "div",
      classList: ["grid-container", "task"],
      parent,
    });

    if (uid) element.setAttribute("data-uid", uid.toString());
    else element.setAttribute("data-uid", "ERROR");

    return element;
  };

  // Pool of task divs
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
    contentGrid(mainGridDiv);
    footerGrid(mainGridDiv);
    menuGrid(mainGridDiv);
    taskDetailsGrid(mainGridDiv);
    subtasksDisplayGrid(mainGridDiv);
  };
  // Listen for init event and call init method

  return { init };
})();

export default domManager;
