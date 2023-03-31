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
             -prioritySortBtn
               -prioritySortIconGridContainer div
                 -colorOne div
                 -colorTwo div
                 -colorThree div
             -dateSortBtn
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

  // Create footer
  // Create menu
  // Create taskDetails
  // Create subtaskDetails
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
  };
  // Listen for init event and call init method

  return { init };
})();

export default domManager;
