import isThisWeek from "date-fns/isThisWeek";
import isThisMonth from "date-fns/isThisMonth";
import Events from "./events";

const Formats = {
  dateAscending: "DATE-A",
  dateDescending: "DATE-D",
  priorityAscending: "PRIORITY-A",
  priorityDescending: "PRIORITY-D",
  filterWeek: "FILTER-W",
  filterMonth: "FILTER-M",
};

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
  const filterWeek = (data) => {
    // Put data in an array
    const dataToFilter = addDataToArray(data);

    const filteredData = dataToFilter.filter((task) => {
      const date = new Date(task.dueDate);
      if (isThisWeek(date)) return true;
      return false;
    });

    return filteredData;
  };

  // Filter only within this month
  const filterMonth = (data) => {
    // Put data in an array
    const dataToFilter = addDataToArray(data);

    const filteredData = dataToFilter.filter((task) => {
      const date = new Date(task.dueDate);
      if (isThisMonth(date)) return true;
      return false;
    });

    return filteredData;
  };

  // Expects a data object and query.format string
  const formatData = (payload) => {
    // Format the returned data based on query.format
    let format = Formats.dateAscending;
    if (Object.values(Formats).includes(payload.format)) {
      format = payload.format;
    }

    let formattedData;
    switch (format) {
      case Formats.dateAscending:
        formattedData = sortDateAscending(payload.returnData);
        break;
      case Formats.dateDescending:
        formattedData = sortDateDescending(payload.returnData);
        break;
      case Formats.priorityAscending:
        formattedData = sortPriorityAscending(payload.returnData);
        break;
      case Formats.priorityDescending:
        formattedData = sortPriorityDescending(payload.returnData);
        break;
      case Formats.filterWeek:
        formattedData = filterWeek(payload.returnData);
        break;
      case Formats.filterMonth:
        formattedData = filterMonth(payload.returnData);
        break;
      default:
      // code block
    }
    // Emit results
    Events.emit("returnData", formattedData);
    return formattedData;
  };

  Events.on("returnDataForFormat", formatData);

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
