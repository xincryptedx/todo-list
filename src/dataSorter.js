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

  // Sort by due date ascending/descending
  const sortDateAscending = () => {
    // Sort logic
  };
  const sortDateDescending = () => {
    // Sort logic
  };
  // Sort by priority
  const sortPriority = () => {
    // Sort logic
  };

  // Filter only within this week
  const filterWeek = () => {
    // Filter logic
  };
  // Filter only within this month
  const filterMonth = () => {
    // Filter logic
  };

  return { addDataToArray };
})();

export default dataSorter;
