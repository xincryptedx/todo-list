import Events from "./events";

const dataSorter = (() => {
  let dataToSort = [];

  const addDataToArray = (data) => {
    dataToSort = [];
    Object.keys(data).forEach((key) => {
      dataToSort.push(data[key]);
    });

    return dataToSort;
  };

  const sort = (sortedData) => {
    // Sort by due date
    // Sort by priority
  };

  // Filter only within this week
  // Filter only within this month

  return { addDataToArray };
})();

export default dataSorter;
