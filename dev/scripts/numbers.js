/*globals define*/
define(['events'], function (events){
  'use strict'

  var self = {}

  self.add = function () {
  	var operands = Array.prototype.slice.call(arguments),
  		total = 0;

  	operands.forEach(function (value) {
  		if (typeof value === 'string') {
  			value = parseInt(value, 10) || 0
  		}

  		total += value
  	})

  	events.publish('added', {
  		operands: operands,
  		result: total
  	})

  	return total
  }

  self.addAfterDelay = function (delay, callback) {
  	var timeoutDelay = Array.prototype.shift.call(arguments),
  			callback = Array.prototype.shift.call(arguments),
  			operands = arguments

  	window.setTimeout(function () {
  		callback(self.add.apply(this, operands))
  	}, timeoutDelay)
  }

  return self
})
