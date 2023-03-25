const eventsManager = {
  events: [],
  emit(eventName, payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(payload);
      });
    }
  },
  on(eventName, callbackFn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callbackFn);

    console.log(`EVENT ON: ${this.events[eventName]}`);
  },
  off(eventName, callbackFn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i += 1) {
        if (this.events[eventName][i] === callbackFn) {
          console.log(`EVENT OFF:${this.events[eventName]}`);

          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
};

export default eventsManager;
