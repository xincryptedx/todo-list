import isValidDate from "date-fns/isValid";
import isFuture from "date-fns/isFuture";
import deepCopy from "./deepCopy";
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
        if (newName) {
          userSetName = newName.toString();
          Events.emit("setProject", project);
        }
      },
    };

    addProjectToData(project);

    Events.emit("setProject", project);

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

  const createTask = (taskData) => {
    if (!taskData) return undefined;
    let projectUID = validateProject(taskData.projectUID, true);
    let projectSetName = projectUID
      ? data.projects[projectUID].userSetName
      : "Project";
    const uid = newUID();
    let userSetName = taskData.userSetName
      ? taskData.userSetName.toString()
      : "";
    let notes = taskData.notes ? taskData.notes : "";
    let priority = Object.values(TaskPriority).includes(taskData.priority)
      ? taskData.priority
      : TaskPriority.low;
    let dueDate = isValidDate(new Date(taskData.dueDate))
      ? taskData.dueDate
      : new Date().toISOString();
    let hasSubtasks = false;
    let checked = false;

    const task = {
      uid,
      get projectUID() {
        return projectUID;
      },
      set projectUID(newProjectUID) {
        const validatedUID = validateProject(newProjectUID, false);
        if (validatedUID) {
          projectUID = validatedUID;
          projectSetName = data.projects[validatedUID].userSetName;
          Events.emit("setTask", task);
        }
      },
      get projectSetName() {
        return projectSetName;
      },
      get userSetName() {
        return userSetName;
      },
      set userSetName(newName) {
        if (newName) {
          userSetName = newName.toString();
          Events.emit("setTask", task);
        }
      },
      get description() {
        return notes;
      },
      set description(newDesc) {
        if (newDesc) {
          notes = newDesc.toString();
          Events.emit("setTask", task);
        }
      },
      get priority() {
        return priority;
      },
      set priority(newPriority) {
        if (Object.values(TaskPriority).includes(newPriority)) {
          priority = newPriority;
          Events.emit("setTask", task);
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
          Events.emit("setTask", task);
        }
      },
      get hasSubtasks() {
        return hasSubtasks;
      },
      set hasSubtasks(bool) {
        if (typeof bool === "boolean") {
          hasSubtasks = bool;
          Events.emit("setTask", task);
        }
      },
      get checked() {
        return checked;
      },
      set checked(bool) {
        if (typeof bool === "boolean") {
          checked = bool;
          Events.emit("setTask", task);
        }
      },
    };

    addTaskToData(task);

    Events.emit("setTask", task);

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

    Events.emit("setSubtask", subtask);

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

  const loadDataFromStorage = (payload) => {
    if (payload.allData) {
      data.projects = deepCopy(payload.allData.projects);
      data.tasks = deepCopy(payload.allData.tasks);
      data.subtasks = deepCopy(payload.allData.subtasks);
    }
    if (payload.needsDefaultProjects) {
      createProject("Trash", "trash");
      createProject("General", "general");
    }
    defaultProjects.generalUID = getGeneralProject();
    defaultProjects.trashUID = getTrashProject();
  };

  Events.on("loadAllData", loadDataFromStorage);

  // #endregion

  // #region Get method for getting different kinds of data objects
  /**
   *
   * @param {Object} payload - Query is the data requested. Format is the requested format.
   * @param {String} payload.query - 'ALLTASKS', 'GENERAL', 'TRASH', 'ALL-IN{uid}', or a single UID.
   * @param {String} payload.format - Requested formatting if returning object array.
   * @returns {Object} - The requested data object based on the query. Also emits returnData with results and original query.
   */
  const get = (payload) => {
    if (!payload) return undefined;
    let returnData;
    let needsFormatting = true;

    if (payload.query === "ALLTASKS") returnData = data.tasks;
    else if (payload.query === "GENERAL") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === defaultProjects.generalUID
      );
    } else if (payload.query === "TRASH") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === defaultProjects.trashUID
      );
    } else if (
      typeof payload.query === "string" &&
      payload.query.startsWith("PROJECT")
    ) {
      const projectUID = payload.query.substring(7); // UID starts in this position
      returnData = Object.values(data.tasks).filter(
        (task) => task.project === projectUID
      );
    } else if (
      typeof payload.query === "string" &&
      payload.query.startsWith("SUBTASKS")
    ) {
      const taskUID = payload.query.substring(8); // UID starts in this position
      returnData = Object.values(data.subtasks).filter(
        (subtask) => subtask.task === taskUID
      );

      needsFormatting = false;
    }
    // Return individual task, project, or subtask
    else {
      returnData = Object.values(data.tasks).filter(
        (dataObject) => dataObject.uid === payload.query
      );
      if (returnData.length === 0) {
        returnData = Object.values(data.subtasks).filter(
          (dataObject) => dataObject.uid === payload.query
        );
      }
      if (returnData.length === 0) {
        returnData = Object.values(data.projects).filter(
          (dataObject) => dataObject.uid === payload.query
        );
      }
    }

    // Unwrap returnData from array if it is only one entry long
    if (Array.isArray(returnData) && returnData.length === 1) {
      [returnData] = returnData;
      needsFormatting = false;
    }

    if (needsFormatting) {
      Events.emit("returnDataForFormat", {
        returnData,
        format: payload.format,
      });
    } else Events.emit("returnData", returnData);

    return returnData;
  };

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
