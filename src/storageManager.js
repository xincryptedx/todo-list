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

      const storedProjects = JSON.parse(localStorage.getItem("projects"));

      storedProjects[projectObject.uid] = projectObject;

      const projectsString = JSON.stringify(storedProjects);

      localStorage.setItem("projects", projectsString);

      return localStorage.projects;
    };

    Events.on("setProject", setProject);

    // get project data and return object

    // take an object and update task data
    const setTask = (taskObject) => {
      if (typeof taskObject !== "object") return undefined;
      if (!taskObject.uid) return undefined;
      if (!localStorage.tasks) return undefined;

      const storedTasks = JSON.parse(localStorage.getItem("tasks"));

      storedTasks[taskObject.uid] = taskObject;

      const taskString = JSON.stringify(storedTasks);

      localStorage.setItem("tasks", taskString);

      return localStorage.projects;
    };

    Events.on("setTask", setTask);
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
