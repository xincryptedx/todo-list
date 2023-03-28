import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataSorter from "./dataSorter";

window.dataManager = DataManager;
Events.emit("init");
