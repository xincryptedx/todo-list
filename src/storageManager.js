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
        const allData = {};
        // loadJson() with localStorage.get()
        // convert to object
        Object.keys(localStorage).forEach((key) => {
          allData[key] = JSON.parse(localStorage[key]);
        });
        return allData;
        // emit object
      }

      Object.keys(DefaultStorageStructure).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(DefaultStorageStructure[key]));
      });
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
