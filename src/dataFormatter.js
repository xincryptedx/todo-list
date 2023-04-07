import isThisWeek from "date-fns/isThisWeek";
import isThisMonth from "date-fns/isThisMonth";
import Events from "./events";

const Formats = {
  dateAscending: "DATE-A",
  dateDescending: "DATE-D",
  priorityAscending: "PRIORITY-A",
  priorityDescending: "PRIORITY-D",
};

const Filters = {
  filterWeek: "WEEK",
  filterMonth: "MONTH",
  filterAll: "ALL",
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
    let filter = Filters.filterAll;
    if (Object.values(Formats).includes(payload.format)) {
      format = payload.format;
    }
    if (Object.values(Filters).includes(payload.filter)) {
      filter = payload.filter;
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
      default:
    }

    switch (filter) {
      case Filters.filterWeek:
        formattedData = filterWeek(formattedData);
        break;
      case Filters.filterMonth:
        formattedData = filterMonth(formattedData);
        break;
      case Filters.filterAll:
        break;
      default:
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
