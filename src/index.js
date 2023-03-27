import "./style.css";
import Events from "./events";
import DataManager from "./data";

window.dataManager = DataManager;
Events.emit("init");
