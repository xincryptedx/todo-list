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

  // Same but undeleted

  // same but subtask deleted
})();

export default log;
