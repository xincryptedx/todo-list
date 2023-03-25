const eventsManager = {
  events: {},
  emit(eventName, payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => fn(payload));
    }
    return this;
  },
  on(eventName, callbackFn) {
    if (typeof callbackFn !== "function") {
      throw new TypeError("Expected a function");
    }
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callbackFn);
    return this;
  },
  off(eventName, callbackFn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i += 1) {
        if (this.events[eventName][i] === callbackFn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
    return this;
  },
  offAll() {
    this.events = {};
  },
};

export default eventsManager;
