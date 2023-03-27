import Events from "./events";

const dataManager = (() => {
  const data = {
    projects: {},
    tasks: {},
  };

  const TaskPriority = {
    high: 3,
    medium: 2,
    low: 1,
  };

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

  const Project = (projectName, type = "") => ({
    name: projectName.toString(),
    type,
  });

  const Task = (projectUID) => ({
    project: projectUID,
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
  });

  const getDefaultProject = () => {
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
    let validatedName = projectUID;
    const defaultProject = getDefaultProject();
    if (!data.projects[projectUID] && setDefault) {
      validatedName = defaultProject;
    }
    if (!data.projects[projectUID] && !setDefault) {
      validatedName = undefined;
    }
    return validatedName;
  };

  const createTask = (projectUID) => {
    const validatedProject = validateProject(projectUID);
    const internalName = newUID();
    const task = Task(validatedProject);
    data.tasks[internalName] = task;
    return task;
  };

  const getTask = (uid) => {
    let foundKey;
    Object.keys(data.tasks).forEach((key) => {
      if (key === uid) {
        foundKey = data.tasks[key];
      }
    });
    return foundKey;
  };

  const changeProject = (uid, destProjectInternalName) => {
    const validatedProject = validateProject(destProjectInternalName, false);
    const task = getTask(uid);
    if (validatedProject) task.project = validatedProject;
    return task;
  };

  const moveToTrash = (uid) => {
    let objectToMove;

    Object.keys(data.projects).forEach((key) => {
      if (uid === key) objectToMove = key;
    });
    Object.keys(data.tasks).forEach((key) => {
      if (uid === key) objectToMove = key;
    });

    changeProject(objectToMove, "trash"); // Not done yet
    return objectToMove;
  };

  // Create project
  const createProject = (name = "project", type = "userMade") => {
    const projectName = name.toString();

    const internalName = newUID();
    const project = Project(projectName, type);

    data.projects[internalName] = project;

    return project;
  };
  // Move project
  // Remove project
  // Get data (also emit event with the data)
  // Set data (also emit event with the data)
  // Sub to appropriate events for getting or setting data

  const init = () => {
    createProject("Trash", "trash");
    createProject("General", "general");
  };

  Events.on("init", init);

  return {
    createTask,
    createProject,
    validateProject,
    getTask,
    moveToTrash,
    changeProject,
    init,
    data,
  };
})();

export default dataManager;
