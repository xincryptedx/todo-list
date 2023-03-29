import isThisWeek from "date-fns/isThisWeek";
import Events from "./events";

const dataSorter = (() => {
  const addDataToArray = (data) => {
    if (!data) return undefined;
    const dataToSort = [];
    if (Object.keys(data)) {
      Object.keys(data).forEach((key) => {
        dataToSort.push(data[key]);
      });
    }
    return dataToSort;
  };

  // Sort by due date ascending/descending
  const sortDateAscending = (data) => {
    // Put data in an array
    const dataToSort = addDataToArray(data);
    // Sort array
    dataToSort.sort((a, b) => {
      let aDate;
      let bDate;
      if (a.dueDate) aDate = new Date(a.dueDate);
      if (b.dueDate) bDate = new Date(b.dueDate);
      if (aDate.getTime() > bDate.getTime()) return 1;
      if (aDate.getTime() < bDate.getTime()) return -1;
      return 0;
    });
    return dataToSort;
  };

  const sortDateDescending = (data) => {
    // Put data in an array
    const dataToSort = addDataToArray(data);
    // Sort array
    dataToSort.sort((a, b) => {
      let aDate;
      let bDate;
      if (a.dueDate) aDate = new Date(a.dueDate);
      if (b.dueDate) bDate = new Date(b.dueDate);
      if (aDate.getTime() > bDate.getTime()) return -1;
      if (aDate.getTime() < bDate.getTime()) return 1;
      return 0;
    });
    return dataToSort;
  };

  // Sort by priority
  const sortPriorityAscending = (data) => {
    // Put data in an array
    const dataToSort = addDataToArray(data);
    // Sort array
    dataToSort.sort((a, b) => {
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
      return 0;
    });
    return dataToSort;
  };

  const sortPriorityDescending = (data) => {
    // Put data in an array
    const dataToSort = addDataToArray(data);
    // Sort array
    dataToSort.sort((a, b) => {
      if (a.priority > b.priority) return -1;
      if (a.priority < b.priority) return 1;
      return 0;
    });
    return dataToSort;
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
    sortPriorityAscending,
    sortPriorityDescending,
    filterWeek,
    filterMonth,
  };
})();

export default dataSorter;
