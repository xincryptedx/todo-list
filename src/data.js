const dataManager = (() => {
  const data = {
    projects: {},
  };

  const TaskPriority = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const Project = (projectName) => ({
    name: projectName.toString(),
    tasks: {},
  });

  const Task = () => ({
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
  });

  // Create task
  const createTask = (project = "__project_0") => {
    const projectName = project.toString();

    const internalName = `__task_${
      Object.keys(data.projects[projectName]).length
    }`;

    data.projects[projectName][internalName] = Task();
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

  return { createTask, createProject, init, data };
})();

export default dataManager;
