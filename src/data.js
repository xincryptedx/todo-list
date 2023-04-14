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

  const createProject = (projectData) => {
    let userSetName = projectData.userSetName
      ? projectData.userSetName.toString()
      : "Project";

    const type = projectData.type ? projectData.type : "usermade";

    const uid = projectData.uid ? projectData.uid : newUID();

    const project = {
      uid,
      type,
      get userSetName() {
        return userSetName;
      },
      set userSetName(newName) {
        if (newName || newName === "") {
          if (newName === "") userSetName = "Project";
          else userSetName = newName.toString();
          Events.emit("setProject", project);
        }
      },
    };

    addProjectToData(project);

    Events.emit("setProject", project);

    return project;
  };

  Events.on("createProject", createProject);

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
    let projectUIDPrevious = "";
    let projectSetName = projectUID
      ? data.projects[projectUID].userSetName
      : "Project";
    const uid = taskData.uid ? taskData.uid : newUID();
    let userSetName = taskData.userSetName
      ? taskData.userSetName.toString()
      : "Task";
    let notes = taskData.notes ? taskData.notes : "";
    let priority = Object.values(TaskPriority).includes(taskData.priority)
      ? taskData.priority
      : TaskPriority.low;
    let dueDate = isValidDate(new Date(taskData.dueDate))
      ? taskData.dueDate
      : new Date().toISOString();
    let hasSubtasks = taskData.hasSubtasks ? taskData.hasSubtasks : true;
    let checked = taskData.checked ? taskData.checked : false;

    const task = {
      uid,
      get projectUIDPrevious() {
        return projectUIDPrevious;
      },
      set projectUIDPrevious(newProjectUID) {
        const validatedUID = validateProject(newProjectUID, false);
        if (validatedUID) {
          projectUIDPrevious = validatedUID;
        }
      },
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
      get notes() {
        return notes;
      },
      set notes(newNotes) {
        if (newNotes || newNotes === "") {
          notes = newNotes.toString();
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

    Events.emit("taskCreated", task);

    return task;
  };

  Events.on("createTask", createTask);

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

  const countSubtasksOnTask = (taskUID) => {
    const countedSubtasks = [];

    Object.keys(data.subtasks).forEach((key) => {
      if (data.subtasks[key].taskUID === taskUID) {
        countedSubtasks.push(data.subtasks[key]);
      }
    });

    return countedSubtasks.length;
  };

  const createSubtask = (subtaskData) => {
    const validatedTask = validateTask(subtaskData.taskUID);
    if (!validatedTask) return undefined;

    const uid = subtaskData.uid ? subtaskData.uid : newUID();
    const { taskUID } = subtaskData;
    const index = subtaskData.index
      ? subtaskData.index
      : countSubtasksOnTask(subtaskData.taskUID) + 1;
    let description = subtaskData.description
      ? subtaskData.description
      : "Subtask";
    let checked = subtaskData.checked ? subtaskData.checked : false;

    const subtask = {
      uid,
      taskUID,
      index,
      get description() {
        return description;
      },
      set description(newDesc) {
        if (newDesc) {
          description = newDesc.toString();
          Events.emit("setSubtask", subtask);
        }
      },
      get checked() {
        return checked;
      },
      set checked(bool) {
        if (typeof bool === "boolean") {
          checked = bool;
          Events.emit("setSubtask", subtask);
        }
      },
    };

    addSubtaskToData(subtask);

    Events.emit("setSubtask", subtask);

    return subtask;
  };

  Events.on("createSubtask", createSubtask);

  // #endregion

  // #region General Methods

  const moveToTrash = (uid) => {
    let taskToMove;

    Object.keys(data.tasks).forEach((key) => {
      if (uid === key) taskToMove = data.tasks[key];
    });

    // Move to trash or move back out of trash if already in trash
    if (taskToMove && taskToMove.projectUID !== defaultProjects.trashUID) {
      taskToMove.projectUIDPrevious = taskToMove.projectUID;
      taskToMove.projectUID = defaultProjects.trashUID;
    } else if (
      taskToMove &&
      taskToMove.projectUID === defaultProjects.trashUID
    ) {
      taskToMove.projectUID = taskToMove.projectUIDPrevious;
    } else return undefined;

    Events.emit("trashMoved");

    return taskToMove;
  };

  Events.on("moveToTrash", moveToTrash);

  const emptyTrash = () => {
    Object.keys(data.tasks).forEach((key) => {
      if (data.tasks[key].projectUID === defaultProjects.trashUID) {
        delete data.tasks[key];
      }
    });
  };

  const loadDataFromStorage = (payload) => {
    if (payload.allData) {
      const projectsToLoad = deepCopy(payload.allData.projects);
      const tasksToLoad = deepCopy(payload.allData.tasks);
      const subtasksToLoad = deepCopy(payload.allData.subtasks);

      Object.keys(projectsToLoad).forEach((project) => {
        createProject(projectsToLoad[project]);
      });

      Object.keys(tasksToLoad).forEach((task) => {
        createTask(tasksToLoad[task]);
      });

      Object.keys(subtasksToLoad).forEach((subtask) => {
        createSubtask(subtasksToLoad[subtask]);
      });
    }
    if (payload.needsDefaultProjects) {
      createProject({ userSetName: "Trash", type: "trash" });
      createProject({ userSetName: "General", type: "general" });
    }
    defaultProjects.generalUID = getGeneralProject();
    defaultProjects.trashUID = getTrashProject();

    Events.emit("dataLoaded", true);
  };

  Events.on("loadAllData", loadDataFromStorage);

  // #endregion

  // #region Get method for getting different kinds of data objects
  /**
   *
   * @param {Object} payload - Query is the data requested. Format is the requested format.
   * @param {String} payload.query - 'ALLTASKS', 'GENERAL', 'TRASH', 'ALL-IN{uid}', or a single UID.
   * @param {String} payload.format - Requested formatting if returning object array.
   * @param {String} payload.filter - Requested filtering if returning object array.
   * @returns {Object} - The requested data object based on the query. Also emits returnData with results and original query.
   */
  const get = (payload) => {
    if (!payload) return undefined;
    let returnData;
    let needsFormatting = true;
    let filterTrash = false;

    if (payload.query === "ALLTASKS") {
      returnData = data.tasks;
      filterTrash = true;
    } else if (payload.query === "GENERAL") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.projectUID === defaultProjects.generalUID
      );
    } else if (payload.query === "ALLPROJECTS") {
      returnData = data.projects;
      needsFormatting = false;
    } else if (payload.query === "TRASH") {
      returnData = Object.values(data.tasks).filter(
        (task) => task.projectUID === defaultProjects.trashUID
      );
    } else if (
      typeof payload.query === "string" &&
      payload.query.startsWith("PROJECT")
    ) {
      const projectUID = payload.query.substring(7); // UID starts in this position
      returnData = Object.values(data.tasks).filter(
        (task) => task.projectUID === projectUID
      );
    } else if (
      typeof payload.query === "string" &&
      payload.query.startsWith("DATAPROJECT")
    ) {
      const projectUID = payload.query.substring(11); // UID starts in this position
      returnData = data.projects[projectUID];
      needsFormatting = false;
    } else if (
      typeof payload.query === "string" &&
      payload.query.startsWith("SUBTASKS")
    ) {
      const taskUID = payload.query.substring(8); // UID starts in this position
      returnData = Object.values(data.subtasks).filter(
        (subtask) => subtask.taskUID === taskUID
      );

      needsFormatting = false;
    }
    // Return individual task, project, or subtask
    else {
      needsFormatting = false;
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

    // Filter trash from returnData if needed
    if (filterTrash) {
      const filteredOutTrashData = {};

      Object.keys(returnData).forEach((key) => {
        if (returnData[key].projectUID !== defaultProjects.trashUID) {
          filteredOutTrashData[key] = returnData[key];
        }
      });

      returnData = filteredOutTrashData;
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
        filter: payload.filter,
      });
    } else Events.emit("returnData", returnData);

    return returnData;
  };

  Events.on("requestData", get);

  // #endregion

  // Delete a single data object by uid
  const deleteByUid = (query) => {
    if (typeof query !== "string") return undefined;

    const dataToDelete = get({ query: query.toString() });

    if (data.subtasks[dataToDelete]) {
      delete data.subtasks[dataToDelete];

      Events.emit("subtaskDeleted");
    }

    return query;
  };

  Events.on("deleteUID", deleteByUid);

  // Get the default projects
  const getDefaultProjects = () => {
    Events.emit("setDefaultProjects", {
      general: defaultProjects.generalUID,
      trash: defaultProjects.trashUID,
    });
  };

  Events.on("getDefaultProjects", getDefaultProjects);

  const initTrash = () => {
    emptyTrash();
  };

  Events.on("dataLoaded", initTrash);

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
