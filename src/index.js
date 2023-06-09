import "./style.css";
import "./normalize.css";
import Events from "./events";
import DataManager from "./data";
import DataFormatter from "./dataFormatter";
import DomManager from "./domManager";
import newElement from "./domElementBuilder";
import StorageManager from "./storageManager";
import Log from "./log";

window.events = Events;
window.dataManager = DataManager;
window.dataFormatter = DataFormatter;
window.domManager = DomManager;
window.storageManager = StorageManager;

window.thisBody = document.body;
window.newElement = newElement;

Events.emit("init");
