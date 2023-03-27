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
        if (task.uid === uid) {
          uid = Math.random().toString(36).substring(2, 32);
          isDuplicate = true;
        }
      });
      Object.values(data.projects).forEach((project) => {
        if (project.uid === uid) {
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

  const Project = (projectName) => ({
    name: projectName.toString(),
    uid: newUID(),
  });

  const Task = (internalProjectName) => ({
    project: internalProjectName,
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
    uid: newUID(),
  });

  const validateProject = (internalName) => {
    let validatedName = internalName;

    const defaultProject = "__project_1"; // General is the default, and has the key name __project_1

    if (!data.projects[internalName]) {
      validatedName = defaultProject;
    }

    return validatedName;
  };

  const createTask = (internalProjectName) => {
    const project = validateProject(internalProjectName);
    const internalName = `__task_${Object.keys(data.tasks).length}`;
    const task = Task(project);
    data.tasks[internalName] = task;
    return task;
  };

  const getTask = (uid) => {
    let foundKey;
    Object.keys(data.tasks).forEach((key) => {
      if (data.tasks[key].uid === uid) {
        foundKey = data.tasks[key];
      }
    });
    return foundKey;
  };
  // Change task project
  const changeProject = (uid, destProjectInternalName) => {
    const task = getTask(uid);
    task.project = destProjectInternalName;
  };
  // Remove task
  // Create project
  const createProject = (name = "project") => {
    const projectName = name.toString();

    const internalName = `__project_${Object.keys(data.projects).length}`;
    const project = Project(projectName);

    data.projects[internalName] = project;

    return project;
  };
  // Move project
  // Remove project
  // Get data (also emit event with the data)
  // Set data (also emit event with the data)
  // Sub to appropriate events for getting or setting data

  const init = () => {
    createProject("Trash");
    createProject("General");
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
