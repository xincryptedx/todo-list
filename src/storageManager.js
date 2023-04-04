import storageAvailable from "./storageAvailable";

const storageManager = (() => {
  if (storageAvailable("localStorage")) {
    const DefaultStorageStructure = {
      projects: {},
      tasks: {},
      subtasks: {},
    };

    // get all data and turn into an object

    // take an object and update project data
    // get project data and return object

    // take an object and update task data
    // get task data and return object

    // take an object and udate subtask data
    // get subtask data and return object

    const init = () => {
      if (localStorage.length > 0) {
        // loadJson() with localStorage.get()
        // convert to object
        // emit object
      } else {
        // Initialize local storage with storage.set()
        /* -projects
           -tasks
           -subtasks
        */
        Object.keys(DefaultStorageStructure).forEach((key) => {
          localStorage.setItem(
            key,
            JSON.stringify(DefaultStorageStructure[key])
          );
        });
      }
      return localStorage;
    };

    const nuke = () => {
      localStorage.clear();
    };

    return { init, nuke };
  }
  return "Storage not available";
})();

export default storageManager;
