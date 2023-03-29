import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataFormatter from "./dataFormatter";

window.dataManager = DataManager;
window.dataFormatter = DataFormatter;
Events.emit("init");
