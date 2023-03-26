const dataManager = (() => {
  const data = {
    projects: {
      general: {},
      trash: {},
    },
  };

  const TaskPriority = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const Task = () => ({
    userSetName: "",
    description: "",
    priority: TaskPriority.low,
    dueDate: null,
    hasSubtasks: false,
    subtasks: {},
  });

  // Create task
  const createTask = (project = "general") => {
    const projectName = project.toString();

    const internalName = `__task_${
      Object.keys(data.projects[projectName]).length
    }`;

    data.projects[projectName][internalName] = Task();
  };
  // Move task
  // Remove task
  // Create project
  // Move project
  // Remove project
  // Get data (also emit event with the data)
  // Set data (also emit event with the data)
  // Sub to appropriate events for getting or setting data

  return { createTask, data };
})();

export default dataManager;
