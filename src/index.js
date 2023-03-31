import "./style.css";
import Events from "./events";
import DataManager from "./data";
import DataFormatter from "./dataFormatter";
import DomManager from "./domManager";

import newElement, { areValidClasses } from "./domElementBuilder";

window.dataManager = DataManager;
window.dataFormatter = DataFormatter;
window.domManager = DomManager;

window.thisBody = document.body;
window.newElement = newElement;
window.areValidClasses = areValidClasses;

Events.emit("init");
