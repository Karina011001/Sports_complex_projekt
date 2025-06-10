const event = {
  listeners: {}, 

  /**
   * @param {string} event 
   * @param {function} callback 
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  /**
   * @param {string} event 
   * @param {function} callback 
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event].filter(
      listener => listener !== callback
    );
  },

  /**

   * @param {string} event 
   * @param {*} [data] 
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener(data));
  }
};

export default event;
