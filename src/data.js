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
  const createProject = (projectName, projectType) => {
    let userSetName;
    if (projectName) userSetName = projectName.toString();
    else userSetName = "project";

    let type;
    if (projectType) type = projectType.toString();
    else type = "userMade";

    const uid = newUID();

    const project = {
      get uid() {
        return uid;
      },
      get userSetName() {
        return userSetName;
      },
      get type() {
        return type;
      },
    };

    data.projects[uid] = project;

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
  const createTask = (projectUID) => {
    let project = validateProject(projectUID, true);
    const uid = newUID();
    let userSetName = "";
    let description = "";
    const priority = TaskPriority.low;
    const dueDate = new Date().toISOString();
    const hasSubtasks = false;
    const checked = false;

    const task = {
      get project() {
        return project;
      },
      set project(newProjectUID) {
        const validatedUID = validateProject(newProjectUID, false);
        if (validatedUID) project = validatedUID;
      },
      uid,
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
        // Stuff
      },
      get dueDate() {
        return dueDate;
      },
      set dueDate(newDate) {
        // Stuff
      },
      get hasSubtasks() {
        return hasSubtasks;
      },
      set hasSubtasks(bool) {
        // Stuff
      },
      get checked() {
        return checked;
      },
      set checked(bool) {
        // Stuff
      },
    };

    data.tasks[uid] = task;

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
  const createSubtask = (taskUID) => {
    const validatedTask = validateTask(taskUID);
    if (!validatedTask) return undefined;

    const uid = newUID();
    const task = taskUID;
    const description = "";
    const index = Object.keys(data.subtasks).length;
    const checked = false;

    return {
      getUID: () => uid,
      getTask: () => task,
      getDescription: () => description,
      getIndex: () => index,
      getChecked: () => checked,
    };
  };

  // #endregion

  // #region Composed Functionality
  const changeTaskProject = (uid, destProjectUID) => {
    const validatedProject = validateProject(destProjectUID, false);
    const task = validateTask(uid);
    if (validatedProject && task) task.project = validatedProject;
    return task;
  };

  const moveToTrash = (uid) => {
    let objectToMove;
    // Change this later to just do this for each key in data
    // This assumes, though, that the dirct children of data will always have UIDs to check
    // Changing the data structure might introduce unneeded checks here
    // This is similar to the checkDuplicates sub function
    Object.keys(data.projects).forEach((key) => {
      if (uid === key) objectToMove = key;
    });
    Object.keys(data.tasks).forEach((key) => {
      if (uid === key) objectToMove = key;
    });

    changeTaskProject(objectToMove, defaultProjects.trashUID);
    return objectToMove;
  };

  const emptyTrash = () => {
    Object.keys(data.tasks).forEach((key) => {
      if (data.tasks[key].project === defaultProjects.trashUID) {
        delete data.tasks[key];
      }
    });
  };

  /*   const setTaskName = (uid, name) => {
    const task = validateTask(uid);
    if (!task) return undefined;

    let newName;
    if (name) newName = name.toString();
    else return undefined;

    task.userSetName = newName;

    return task;
  }; */

  /*   const setTaskDescription = (uid, desc) => {
    const task = validateTask(uid);
    if (!task) return undefined;

    let newDesc;
    if (desc) newDesc = desc.toString();
    else return undefined;

    task.description = newDesc;

    return task;
  }; */

  const setDueDate = (uid, newDate) => {
    const task = validateTask(uid);

    let dateToSet;
    if (isValidDate(newDate) && isFuture(newDate)) {
      dateToSet = newDate;
    }

    if (task && dateToSet) {
      task.dueDate = dateToSet.toISOString();
    }

    return task;
  };

  const setPriority = (uid, priority) => {
    const task = validateTask(uid);
    if (!task) return undefined;
    if (Object.values(TaskPriority).includes(priority)) {
      task.priority = priority;
    } else return undefined;

    return task;
  };

  const toggleTaskChecked = (uid) => {
    const task = validateTask(uid);
    if (!task) return undefined;

    task.checked = !task.checked;

    return task;
  };

  const toggleHasSubtasks = (uid) => {
    const task = validateTask(uid);
    if (!task) return undefined;

    task.hasSubtasks = !task.hasSubtasks;

    return task;
  };

  const init = () => {
    createProject("Trash", "trash");
    createProject("General", "general");
    defaultProjects.generalUID = getGeneralProject();
    defaultProjects.trashUID = getTrashProject();
  };

  // #endregion

  // #region Events
  Events.on("init", init);
  // #endregion

  return {
    createTask,
    createSubtask,
    createProject,
    validateProject,
    validateTask,
    moveToTrash,
    emptyTrash,
    changeTaskProject,
    setDueDate,
    setPriority,
    toggleTaskChecked,
    toggleHasSubtasks,
    init,
    data,
  };
})();

export default dataManager;
