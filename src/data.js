import Events from "./events";

let defaultProject;

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

  const Task = (projectName) => ({
    project: projectName,
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
    uid: newUID(),
  });

  const createTask = (projectName) => {
    let project = projectName;
    if (!data.projects[project]) {
      project = defaultProject;
    }
    const internalName = `__task_${Object.keys(data.tasks).length}`;
    const task = Task(project);
    data.tasks[internalName] = task;
    return task;
  };
  // Move task
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
    defaultProject = "__Project_1";
  };

  Events.on("init", init);

  return { createTask, createProject, init, data, defaultProject };
})();

export default dataManager;
