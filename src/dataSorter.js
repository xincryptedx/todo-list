import Events from "./events";

const dataSorter = (() => {
  const addDataToArray = (data) => {
    const dataToSort = [];
    Object.keys(data).forEach((key) => {
      dataToSort.push(data[key]);
    });

    return dataToSort;
  };

  // Sort by due date ascending/descending
  const sortDateAscending = (data) => {
    // Put data in an array
    const dataToSort = addDataToArray(data);
    // Sort array
    dataToSort.sort((a, b) => {
      if (a.dueDate > b.dueDate) return 1;
      if (a.dueDate < b.dueDate) return -1;
      return 0;
    });
    return dataToSort;
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

  return {
    addDataToArray,
    sortDateAscending,
    sortDateDescending,
    sortPriority,
    filterWeek,
    filterMonth,
  };
})();

export default dataSorter;
