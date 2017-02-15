'use strict'

/**
 * Emitter is a lightweight alternative to Node's events.EventEmitter object.
 */
var Type = require('lighter-type')
var Emitter = module.exports = Type.extend(function Emitter () {
  this._events = {}
  this._maxListeners = defaultMaxListeners
}, {

  /**
   * Set the maximum number of listeners that can listen to any type of event.
   *
   * @param  {Number} max  A new maximum number of listeners (or 0 == Infinity).
   */
  setMaxListeners: function setMaxListeners (max) {
    this._maxListeners = max || Infinity
    return this
  },

  /**
   * Get the maximum number of listeners that can listen to any type of event.
   */
  getMaxListeners: function getMaxListeners () {
    return this._maxListeners
  },

  /**
   * Bind a function as a listener for a type of event.
   *
   * @param  {String}   type  A type of event.
   * @param  {Function} fn    A listener function.
   */
  on: function on (type, fn) {
    var events = this._events
    var fns = events[type]
    var pre
    if (fns === undefined) {
      events[type] = fn
      return this
    }
    if (typeof fns !== 'object') {
      pre = 1
      fns = events[type] = [fns, fn]
    } else {
      pre = fns.length
      fns[pre] = fn
    }
    if (pre === this._maxListeners) {
      console.error('WARNING: Exceeded ' + pre + ' "' + type + '" listeners.')
      console.trace()
    }
    return this
  },

  /**
   * Set an event listener to be fired only once.
   *
   * @param  {String}   type  A type of event.
   * @param  {Function} fn    A listener function.
   */
  once: function once (type, fn) {
    function one () {
      this.removeListener(type, one)
      fn.apply(this, arguments)
    }
    this.on(type, one)
    return this
  },

  /**
   * Return an array of all listeners for a type of event.
   *
   * @param  {String} type  A type of event.
   */
  all: function all (type) {
    var fns = this._events[type]
    return fns === undefined ? [] : typeof fns === 'function' ? [fns] : fns
  },

  /**
   * Return the number of listeners for a type of event.
   *
   * @param  {String} type  A type of event.
   */
  count: function count (type) {
    var fns = this._events[type]
    return fns === undefined ? 0 : typeof fns === 'function' ? 1 : fns.length
  },

  /**
   * Remove an event listener.
   */
  off: function off (type, fn) {
    var events = this._events
    var fns = events[type]
    var i, l
    if (fns === fn) {
      events[type] = undefined
    } else if (typeof fns === 'object') {
      l = fns.length - 1
      for (i = l; i >= 0; i--) {
        if (fns[i] === fn) {
          while (i < l) {
            fns[i] = fns[++i]
          }
          fns.pop()
          if (l === 1) {
            fns = fns[0]
          }
          break
        }
      }
    }
    return this
  },

  /**
   * Remove all event listeners (optionally of a specified type).
   */
  clear: function clear (type) {
    if (type) {
      this._events[type] = undefined
    } else {
      this._events = {}
    }
    return this
  },

  /**
   * Set one listener for a type of event (replacing any others).
   */
  one: function one (type, fn) {
    this._events[type] = fn
    return this
  },

  emit: function emit (type) {
    var fn = this._events[type]
    var i, l, a, fns
    if (fn) {
      if (typeof fn === 'object') {
        i = l = fn.length
        fns = new Array(l)
        while (i--) fns[i] = fn[i]
      }
      switch (arguments.length) {
        case 1:
          if (fns) for (i = 0; i < l; i++) fns[i].call(this)
          else fn.call(this)
          return true
        case 2:
          if (fns) for (i = 0; i < l; i++) fns[i].call(this, arguments[1])
          else fn.call(this, arguments[1])
          return true
        case 3:
          if (fns) for (i = 0; i < l; i++) fns[i].call(this, arguments[1], arguments[2])
          else fn.call(this, arguments[1], arguments[2])
          return true
        case 4:
          if (fns) for (i = 0; i < l; i++) fns[i].call(this, arguments[1], arguments[2], arguments[3])
          else fn.call(this, arguments[1], arguments[2], arguments[3])
          return true
        default:
          l = arguments.length - 1
          a = new Array(l)
          a[0] = arguments[1]
          a[1] = arguments[2]
          a[2] = arguments[3]
          a[3] = arguments[4]
          i = 4
          while (i < l) {
            a[i] = arguments[++i]
          }
          if (fns) for (i = 0, l = fns.length; i < l; i++) fns[i].apply(this, a)
          else fn.apply(this, a)
          return true
      }
    } else {
      return false
    }
  }
})

var defaultMaxListeners = 10
Object.defineProperty(Emitter, 'defaultMaxListeners', {
  get: function () {
    return defaultMaxListeners
  },
  set: function (max) {
    defaultMaxListeners = max || Infinity
  },
  enumerable: true,
  configurable: true
})

var proto = Emitter.prototype
proto.addListener = proto.on
proto.removeListener = proto.off
proto.listeners = proto.all
proto.listenerCount = proto.count
proto.removeAllListeners = proto.clear
