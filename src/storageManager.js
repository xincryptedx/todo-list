import storageAvailable from "./storageAvailable";
import Events from "./events";

const storageManager = (() => {
  if (storageAvailable("localStorage")) {
    const DefaultStorageStructure = {
      projects: {},
      tasks: {},
      subtasks: {},
    };

    // take an object and update project data
    // get project data and return object

    // take an object and update task data
    // get task data and return object

    // take an object and udate subtask data
    // get subtask data and return object

    const init = () => {
      const allData = {};
      let needsDefaultProjects = false;

      if (localStorage.length === 0) {
        Object.keys(DefaultStorageStructure).forEach((key) => {
          localStorage.setItem(
            key,
            JSON.stringify(DefaultStorageStructure[key])
          );
        });
        needsDefaultProjects = true;
      }

      /*       Object.keys(localStorage).forEach((key) => {
        allData[key] = JSON.parse(localStorage[key]);
      }); */

      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        allData[key] = JSON.parse(localStorage.getItem(key));
      }

      console.log(
        `Emitting loadAllData Event with payload:${needsDefaultProjects}`
      );
      console.dir(allData);
      Events.emit("loadAllData", { allData, needsDefaultProjects });
      return { allData, needsDefaultProjects };
    };

    const nuke = () => {
      localStorage.clear();
    };

    return { init, nuke };
  }
  return "Storage not available";
})();

export default storageManager;
