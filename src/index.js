import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataFormatter from "./dataFormatter";
import DomManager from "./domManager";

window.dataManager = DataManager;
window.dataFormatter = DataFormatter;
window.domManager = DomManager;

window.thisBody = document.body;
window.newElement = newElement;

Events.emit("init");
