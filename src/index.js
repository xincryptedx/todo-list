import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataSorter from "./dataSorter";

window.dataManager = DataManager;
window.dataSorter = DataSorter;
Events.emit("init");
