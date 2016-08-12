
/**
 * Handles the internals of the progress reporting mechanism for the Progress Promise
 *  This is mainly done to get around not being able to supply an instance method of the 
 *  ProgressPromise class to super()
 *
 * @public
 * @param {Function} Action to be promised
 */ 
class PromiseBroker {
  constructor(action) {
    this.action = action;
    this._handlers = [];
    this._buffer = [];
  }

  /**
   * Reports progress to the subscribed handlers.
   *
   * @public
   * @param {Number} the current percentage of promised action
   * @param {String} a message to explain the current milestone
   * @returns {Object} self (fluent interface)
   */  
  report(percentage, message) {
    this._buffer.push({ percentage, message });

    if (typeof this._handlers === "object" && this._handlers != null && Array.isArray(this._handlers)) {
      this._handlers.forEach(fn => {
        if (typeof fn === "function") {
          fn(percentage, message);
        }
      });
    }

    return this;
  }

  /**
   * Proxy to the promised action to handle the change in the action 
   *  schema from superclass to subclass.
   *
   * @public
   * @param {Function} Function to be called when progress report occurs
   */  
  dispatch(resolve, reject) {
    this.action(resolve, reject, this.report.bind(this));
  }

  /**
   * Assign handler to be called when promised action reports progress.
   *  This will also do a "catch-up" action to avoid race conditions and 
   *  broadcast everything in the buffer to this new handler.
   *
   * @public
   * @param {Function} Function to be called when progress report occurs
   * @returns {Object} self (fluent interface)
   */  
  subscribe(handler) {
    this._handlers.push(handler);

    if (this._buffer.length > 0) {
      this._buffer.forEach(b => handler(b.percentage, b.message));
    }

    return this;
  }
}

/**
 * Promise which reports progress towards completion of the promised action.
 *
 * @public
 * @param {Function} Action to be promised
 */ 
module.exports = class ProgressPromise extends Promise {
  constructor(action) {
    let broker = new PromiseBroker(action);
    super(broker.dispatch.bind(broker));
    this._broker = broker;
  }

  /**
   * Assign handler to be called when promised action reports progress.
   *
   * @public
   * @param {Function} Function to be called when progress report occurs
   * @returns {Object} self (fluent interface)
   */  
  progress(callback) {
    if (typeof callback !== "function") {
      throw new Error("ProgressPromise#progress: argument 'callback' must be a function.");
    }

    this._broker.subscribe(callback);
    return this;
  } 
};