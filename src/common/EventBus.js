const EventBus = {
  events: {},

  on(event, callback) {
    if (!this.events[event]) this.events[event] = new Set();

    const wrapped = (e) => callback(e.detail);
    this.events[event].add({ original: callback, wrapped });
    document.addEventListener(event, wrapped);
  },

  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  remove(event, callback) {
    if (!this.events[event]) return;

    for (let listener of this.events[event]) {
      if (listener.original === callback) {
        document.removeEventListener(event, listener.wrapped);
        this.events[event].delete(listener);
        break;
      }
    }
  },
};

export default EventBus;
