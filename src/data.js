import isValidDate from "date-fns/isValid";
import isFuture from "date-fns/isFuture";
import Events from "./events";

const dataManager = (() => {
  // #region data model objects
  const data = {
    projects: {},
    tasks: {},
    subtasks: {},
  };

  const TaskPriority = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const defaultProjects = {
    generalUID: "",
    trashUID: "",
  };
  // #endregion

  // #region General Use Factories
  const newUID = () => {
    let uid = Math.random().toString(36).substring(2, 32);

    let isDuplicate = true;
    const checkDuplicates = () => {
      Object.values(data.tasks).forEach((task) => {
        if (task === uid) {
          uid = Math.random().toString(36).substring(2, 32);
          isDuplicate = true;
        }
      });
      Object.values(data.projects).forEach((project) => {
        if (project === uid) {
          uid = Math.random().toString(36).substring(2, 32);
          isDuplicate = true;
        }
      });
    };

    while (isDuplicate) {
      isDuplicate = false;
      checkDuplicates();
    }

    return uid;
  };
  // #endregion

  // #region Project Factory, Initialization Helpers, and Validation
  const addProjectToData = (project) => {
    data.projects[project.uid] = project;
  };

  const createProject = (projectName, projectType) => {
    let userSetName;
    if (projectName) userSetName = projectName.toString();
    else userSetName = "project";

    let type;
    if (projectType) type = projectType.toString();
    else type = "userMade";

    const uid = newUID();

    const project = {
      uid,
      type,
      get userSetName() {
        return userSetName;
      },
      set userSetName(newName) {
        if (newName) userSetName = newName.toString();
      },
    };

    addProjectToData(project);

    return project;
  };

  const getGeneralProject = () => {
    let foundProjectUID;
    Object.keys(data.projects).forEach((key) => {
      if (data.projects[key].type === "general") foundProjectUID = key;
    });
    return foundProjectUID;
  };

  const getTrashProject = () => {
    let foundProjectUID;
    Object.keys(data.projects).forEach((key) => {
      if (data.projects[key].type === "trash") foundProjectUID = key;
    });
    return foundProjectUID;
  };

  const validateProject = (projectUID, setDefault = true) => {
    let validatedUID = projectUID;
    if (!data.projects[projectUID] && setDefault) {
      validatedUID = defaultProjects.generalUID;
    }
    if (!data.projects[projectUID] && !setDefault) {
      validatedUID = undefined;
    }
    return validatedUID;
  };

  // #endregion

  // #region Task Factory and Validation
  const addTaskToData = (task) => {
    data.tasks[task.uid] = task;
  };

  const createTask = (projectUID) => {
    let project = validateProject(projectUID, true);
    const uid = newUID();
    let userSetName = "";
    let description = "";
    let priority = TaskPriority.low;
    let dueDate = new Date().toISOString();
    let hasSubtasks = false;
    let checked = false;

    const task = {
      uid,
      get project() {
        return project;
      },
      set project(newProjectUID) {
        const validatedUID = validateProject(newProjectUID, false);
        if (validatedUID) project = validatedUID;
      },
      get userSetName() {
        return userSetName;
      },
      set userSetName(newName) {
        if (newName) userSetName = newName.toString();
      },
      get description() {
        return description;
      },
      set description(newDesc) {
        if (newDesc) description = newDesc.toString();
      },
      get priority() {
        return priority;
      },
      set priority(newPriority) {
        if (Object.values(TaskPriority).includes(newPriority)) {
          priority = newPriority;
        }
      },
      get dueDate() {
        return dueDate;
      },
      set dueDate(newDateISO) {
        if (!newDateISO) return;
        const newDate = new Date(newDateISO.toString());
        if (isValidDate(newDate) && isFuture(newDate)) {
          dueDate = newDate.toISOString();
        }
      },
      get hasSubtasks() {
        return hasSubtasks;
      },
      set hasSubtasks(bool) {
        if (typeof bool === "boolean") hasSubtasks = bool;
      },
      get checked() {
        return checked;
      },
      set checked(bool) {
        if (typeof bool === "boolean") checked = bool;
      },
    };

    addTaskToData(task);

    return task;
  };

  const validateTask = (uid) => {
    let validatedUID;
    Object.keys(data.tasks).forEach((key) => {
      if (key === uid) {
        validatedUID = data.tasks[key];
      }
    });
    return validatedUID;
  };

  // #endregion

  // #region Subtask Factory
  const addSubtaskToData = (subtask) => {
    data.subtasks[subtask.uid] = subtask;
  };

  const createSubtask = (taskUID) => {
    const validatedTask = validateTask(taskUID);
    if (!validatedTask) return undefined;

    const uid = newUID();
    const task = taskUID;
    const index = Object.keys(data.subtasks).length;
    let description = "";
    let checked = false;

    const subtask = {
      uid,
      task,
      index,
      get description() {
        return description;
      },
      set description(newDesc) {
        if (newDesc) description = newDesc.toString();
      },
      get checked() {
        return checked;
      },
      set checked(bool) {
        if (typeof bool === "boolean") checked = bool;
      },
    };

    addSubtaskToData(subtask);

    return subtask;
  };

  // #endregion

  // #region General Methods

  const moveToTrash = (uid) => {
    let taskToMove;

    Object.keys(data.tasks).forEach((key) => {
      if (uid === key) taskToMove = data.tasks[key];
    });

    if (taskToMove) taskToMove.project = defaultProjects.trashUID;

    return taskToMove;
  };

  const emptyTrash = () => {
    Object.keys(data.tasks).forEach((key) => {
      if (data.tasks[key].project === defaultProjects.trashUID) {
        delete data.tasks[key];
      }
    });
  };

  const init = () => {
    createProject("Trash", "trash");
    createProject("General", "general");
    defaultProjects.generalUID = getGeneralProject();
    defaultProjects.trashUID = getTrashProject();
  };

  // #endregion

  /**
   *
   * @param {String} query - 'ALLTASKS','GENERAL', 'TRASH', or UID string denoting a project, task, or subtask. Sent by event.
   * @returns {Object} - The requested data object based on the query. Also emits returnData with results and original query.
   */
  const get = (query) => {
    if (!query) return undefined;
    let returnData;

    if (query === "ALLTASKS") returnData = data.tasks;
    else if (query === "GENERAL") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === defaultProjects.generalUID
      );
    } else if (query === "TRASH") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === defaultProjects.trashUID
      );
    } else if (query.startsWith("ALL-IN")) {
      const projectUID = query.substring(6);
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === projectUID
      );
    }
    // Return individual task, project, or subtask
    else {
      returnData = Object.values(data.tasks).filter(
        (dataObject) => dataObject.uid === query
      );
      if (returnData.length === 0) {
        returnData = Object.values(data.subtasks).filter(
          (dataObject) => dataObject.uid === query
        );
      }
      if (returnData.length === 0) {
        returnData = Object.values(data.projects).filter(
          (dataObject) => dataObject.uid === query
        );
      }
    }

    // Unwrap returnData from array if it is only one entry long
    if (Array.isArray(returnData) && returnData.length === 1) {
      [returnData] = returnData;
    }

    console.log(`Returning data...${returnData} with query: ${query}`);
    Events.emit("returnData", { returnData, query });

    return returnData;
  };

  // #region Events
  Events.on("init", init);
  Events.on("requestData", get);
  // #endregion

  return {
    createTask,
    createSubtask,
    createProject,
    moveToTrash,
    emptyTrash,
    get,
    data,
  };
})();

export default dataManager;
