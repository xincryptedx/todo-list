import Events from "./events";

const dataSorter = (() => {
  const sortedData = [];

  const addDataToArray = (data) => {
    Object.keys(data).forEach((key) => {
      sortedData.push(data[key]);
    });

    return sortedData;
  };

  return { addDataToArray };
})();

export default dataSorter;
