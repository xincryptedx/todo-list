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

    // take an object and update task data
    const setTask = (taskObject) => {
      if (typeof taskObject !== "object") return undefined;
      if (!taskObject.uid) return undefined;
      if (!localStorage.tasks) return undefined;

      const storedTasks = JSON.parse(localStorage.getItem("tasks"));

      storedTasks[taskObject.uid] = taskObject;

      const taskString = JSON.stringify(storedTasks);

      localStorage.setItem("tasks", taskString);

      return localStorage.tasks;
    };

    Events.on("setTask", setTask);

    // take an object and udate subtask data
    const setSubtask = (subtaskObject) => {
      if (typeof subtaskObject !== "object") return undefined;
      if (!subtaskObject.uid) return undefined;
      if (!localStorage.subtasks) return undefined;

      const storedSubtasks = JSON.parse(localStorage.getItem("subtasks"));

      storedSubtasks[subtaskObject.uid] = subtaskObject;

      const subtaskString = JSON.stringify(storedSubtasks);

      localStorage.setItem("subtasks", subtaskString);

      return localStorage.subtasks;
    };

    Events.on("setSubtask", setSubtask);

    const deleteSubtask = (subtaskObject) => {
      if (typeof subtaskObject !== "object") return undefined;
      if (!subtaskObject.uid) return undefined;
      if (!localStorage.subtasks) return undefined;

      const storedSubtasks = JSON.parse(localStorage.getItem("subtasks"));

      delete storedSubtasks[subtaskObject.uid];

      const subtaskString = JSON.stringify(storedSubtasks);

      localStorage.setItem("subtasks", subtaskString);

      return localStorage.subtasks;
    };

    Events.on("deleteSubtask", deleteSubtask);

    const deleteTask = (taskObject) => {
      if (typeof taskObject !== "object") return undefined;
      if (!taskObject.uid) return undefined;
      if (!localStorage.tasks) return undefined;

      const storedTasks = JSON.parse(localStorage.getItem("tasks"));

      delete storedTasks[taskObject.uid];

      const taskString = JSON.stringify(storedTasks);

      localStorage.setItem("tasks", taskString);

      return localStorage.tasks;
    };

    Events.on("deleteTask", deleteTask);

    const deleteProject = (projectObject) => {
      if (typeof projectObject !== "object") return undefined;
      if (!projectObject.uid) return undefined;
      if (!localStorage.projects) return undefined;

      const storedProjects = JSON.parse(localStorage.getItem("projects"));

      delete storedProjects[projectObject.uid];

      const projectString = JSON.stringify(storedProjects);

      localStorage.setItem("projects", projectString);

      Events.emit("projectDeleted");

      return localStorage.projects;
    };

    Events.on("deleteProjectFromStorage", deleteProject);

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

    Events.on("init", init);

    return { init, nuke };
  }
  return "Storage not available";
})();

export default storageManager;
