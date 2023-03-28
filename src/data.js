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

  const defaultProjects = {
    generalUID: "",
    trashUID: "",
  };

  const Project = (projectName, type = "") => ({
    name: projectName.toString(),
    type,
    uid: "",
  });

  const Task = (projectUID) => ({
    uid: "",
    project: projectUID,
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: new Date().toISOString(),
    hasSubtasks: false,
    subtasks: {},
  });

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

  const createProject = (name = "project", type = "userMade") => {
    const projectName = name.toString();

    const uid = newUID();
    const project = Project(projectName, type);
    project.uid = uid;
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

  const createTask = (projectUID) => {
    const validatedProject = validateProject(projectUID);
    const uid = newUID();
    const task = Task(validatedProject);
    task.uid = uid;
    data.tasks[uid] = task;
    return task;
  };

  const validateTask = (uid) => {
    let foundKey;
    Object.keys(data.tasks).forEach((key) => {
      if (key === uid) {
        foundKey = data.tasks[key];
      }
    });
    return foundKey;
  };

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
    if (data.projects[defaultProjects.trashUID]) {
      data.projects[defaultProjects.trashUID] = {};
    }
  };

  // Set date
  const setDueDate = (uid, newDateISO) => {
    // convert tasks date ISO to date object
    // set the date
    // convert and return as new ISO string
  };
  // Get data (also emit event with the data)
  // Set data (also emit event with the data)
  // Sub to appropriate events for getting or setting data

  const init = () => {
    createProject("Trash", "trash");
    createProject("General", "general");
    defaultProjects.generalUID = getGeneralProject();
    defaultProjects.trashUID = getTrashProject();
  };

  Events.on("init", init);

  return {
    createTask,
    createProject,
    validateProject,
    getTask: validateTask,
    moveToTrash,
    emptyTrash,
    changeProject: changeTaskProject,
    init,
    data,
  };
})();

export default dataManager;
