import Events from "./events";

const dataManager = (() => {
  const data = {
    projects: {},
    UIDs: [],
  };

  const TaskPriority = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const newUID = () => {
    let uid = Math.random().toString(36).substring(2, 32);
    let isDuplicate = true;
    while (isDuplicate) {
      isDuplicate = false;
      if (data.UIDs.includes(uid)) {
        uid = Math.random().toString(36).substring(2, 32);
        isDuplicate = true;
      }
    }
    data.UIDs.push(uid);
    return uid;
  };

  const Project = (projectName) => ({
    name: projectName.toString(),
    tasks: {},
    uid: newUID(),
  });

  const Task = () => ({
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
    uid: newUID(),
  });

  // Create task
  const createTask = (project = "__project_0") => {
    let projectName = project.toString();
    if (!data.projects[projectName]) projectName = "__project_1";

    const internalName = `__task_${
      Object.keys(data.projects[projectName].tasks).length
    }`;

    data.projects[projectName].tasks[internalName] = Task();
  };
  // Move task
  // Remove task
  // Create project
  const createProject = (name = "project") => {
    const projectName = name.toString();

    const internalName = `__project_${Object.keys(data.projects).length}`;

    data.projects[internalName] = Project(projectName);
  };
  // Move project
  // Remove project
  // Get data (also emit event with the data)
  // Set data (also emit event with the data)
  // Sub to appropriate events for getting or setting data

  const init = () => {
    createProject("trash");
    createProject("general");
  };

  Events.on("init", init);

  return { createTask, createProject, init, data };
})();

export default dataManager;
