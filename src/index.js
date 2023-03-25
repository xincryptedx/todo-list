import "./style.css";
import Events from "./events";

function doOnEventOne() {
  console.log("Done because of event one!");
}

Events.on("eventOne", doOnEventOne);
Events.off("eventOne", doOnEventOne);
Events.on("eventOne", doOnEventOne);
Events.emit("eventOne");
