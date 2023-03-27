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

  const validateProject = (projectUID) => {
    let validatedName = projectUID;
    const defaultProject = "__project_1"; // General is the default, and has the key name __project_1   // Change
    if (!data.projects[projectUID]) {
      validatedName = defaultProject;
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
  // Change task project
  const changeProject = (uid, destProjectInternalName) => {
    const validatedProject = validateProject(destProjectInternalName);
    const task = getTask(uid);
    task.project = validatedProject;
  };
  // Remove task
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
    getTask,
    changeProject,
    validateProject,
    init,
    data,
  };
})();

export default dataManager;
