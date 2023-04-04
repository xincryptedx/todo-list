import storageAvailable from "./storageAvailable";

const storageManager = (() => {
  if (storageAvailable("localStorage")) {
    // Take json and turn it into data object
    // Take data object and turn it into json
    // Save json to local storage
    // Load json from local storage
    const init = () => {
      if (localStorage.length > 0) {
        // loadJson() with localStorage.get()
        // convert to object
        // emit object
      } else {
        // Initialize local storage with storage.set()
        /* -projects
           -tasks
           -subtasks
        */
      }
    };

    const nuke = () => {
      Storage.clear();
    };

    return { init, nuke };
  }
  return "Storage not available";
})();

export default storageManager;
