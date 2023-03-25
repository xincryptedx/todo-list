import "./style.css";
import Events from "./events";

function doOnEventOne() {
  console.log("Done because of event one!");
}

function doOnEventTwo() {
  console.log("Done because of event two!");
}

Events.on("eventOne", doOnEventOne);
Events.off("eventOne", doOnEventOne);
Events.on("eventOne", doOnEventOne);
Events.emit("eventOne");
Events.emit("eventOne");

Events.once("eventTwo", doOnEventTwo);
Events.emit("eventTwo");
Events.emit("eventTwo");
