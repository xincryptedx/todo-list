import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataFormatter from "./dataFormatter";
import DomManager from "./domManager";
import newElement from "./domElementBuilder";

window.dataManager = DataManager;
window.dataFormatter = DataFormatter;
window.domManager = DomManager;
window.newElement = newElement;
Events.emit("init");
