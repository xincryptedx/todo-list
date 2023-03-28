import Events from "./events";

const dataSorter = (() => {
  const sortedData = [];

  const addDataToArray = (data) => {
    Object.keys(data).forEach((key) => {
      sortedData.push(data[key]);
    });

    return sortedData;
  };

  // Sort by due date
  // Sort by priority
  // Filter only within this week
  // Filter only within this month

  return { addDataToArray };
})();

export default dataSorter;
