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

const domManager = (() => {
  // Base method for creating elements
  // Create main grid
  // Create header
  // Method for creating task div
  // Create content
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
  // Listen for init event and call init method
})();

export default domManager;
