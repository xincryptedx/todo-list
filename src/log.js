import Events from "./events";

const log = (() => {
  let logText = "";
  const messageTimeout = 3000;

  // Set log message when task deleted
  const taskTrashed = () => {
    logText = `Moved task to trash.`;

    Events.emit("log", { log: logText, timeout: messageTimeout });
  };

  Events.on("taskTrashed", taskTrashed);

  // Same but undeleted

  // same but subtask deleted
})();

export default log;
