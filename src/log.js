import Events from "./events";

const log = (() => {
  const logText = "";
  const messageTimeout = 3000;

  // Set log message when task deleted
  const taskTrashed = (payload) => {};

  Events.on("taskTrashed", taskTrashed);

  // Same but undeleted

  // same but subtask deleted
})();

export default log;
