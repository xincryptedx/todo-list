import Events from "./events";

const log = (() => {
  let logText = "";
  const messageTimeout = 2000;

  // Set log message when task deleted
  const taskTrashed = () => {
    logText = "Moved task to trash.";

    Events.emit("log", { log: logText, timeout: messageTimeout });
  };

  Events.on("taskTrashed", taskTrashed);

  const taskRestored = () => {
    logText = "Task restored.";

    Events.emit("log", { log: logText, timeout: messageTimeout });
  };

  Events.on("taskRestored", taskRestored);

  const subtaskDeleted = () => {
    logText = "Subtask deleted.";

    Events.emit("log", { log: logText, timeout: messageTimeout });
  };

  Events.on("subtaskDeleted", subtaskDeleted);

  const projectDeleted = () => {
    logText = "Project and tasks deleted.";

    Events.emit("log", { log: logText, timeout: messageTimeout });
  };

  Events.on("projectDeleted", projectDeleted);
})();

export default log;
