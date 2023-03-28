import Events from "./events";

const dataSorter = (data) => {
  const sortedData = [];
  Object.keys(data).forEach((key) => {
    sortedData.push(data[key]);
  });

  return sortedData;
};

export default dataSorter;
