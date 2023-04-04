import storageAvailable from "./storageAvailable";

const storageManager = (() => {
  if (storageAvailable("localStorage")) {
    // Take json and turn it into data object
    // Take data object and turn it into json
    // Save json to local storage
    // Load json from local storage
    const init = () => {
      // loadJson()
      // convert to object
      // emit object
    };

    return { init };
  }
  return "Storage not available";
})();

export default storageManager;
