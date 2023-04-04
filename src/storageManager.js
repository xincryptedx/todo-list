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
    const setProject = (projectObject) => {
      if (typeof projectObject !== "object") return undefined;
      if (!projectObject.uid) return undefined;
      if (!localStorage.projects) return undefined;

      // Get localStorage.projects and convert to object

      // Edit project entry

      // Stringify the object

      // Put it back in local storage
    };

    Events.on("setProject", setProject);

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
