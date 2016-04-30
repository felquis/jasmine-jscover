/*globals define, describe*/
define(['numbers', 'events'], function (numbers, events) {
	'use strict'

	describe('The numbers module', function () {
		// xdescribe will set the describe as pending and ignore the `it` in it's scope
		describe('The add method', function () {
			var output

			beforeEach(function () {
				this.numberInput1 = 1
				this.numberInput2 = 2
				this.stringInput1 = '1'
				this.stringInput2 = 'oops'
			})

			// // xit() will be pending
			// it('should accept one or more numerical arguments and return the sum of them', function () {
			// 	output = numbers.add(this.numberInput1, this.numberInput2)

			// 	// assert
			// 	expect(output).toEqual(3)
			// 	expect(output).not.toEqual(4)

			// 	// Triple A
			// })

			// it('shoud try to parse an integer when a string is passed to the method', function () {
			// 	output = numbers.add(this.numberInput1, this.stringInput1)

			// 	expect(output).toEqual(2)
			// })

			// it('shoud ignore the argument if it is not a parseable string', function () {
			// 	output = numbers.add(this.numberInput1, this.stringInput2)

			// 	expect(output).toEqual(1)
			// })

			it('shoud publish an added event showing the operands passed to the method and the result', function () {
				var x, length, calls;

				spyOn(events, 'publish')
				// spyOn(events, 'publish').and.callThrough() // it will call the alert inside events

				// spyOn(events, 'publish').and.returnValue(false)

				// spyOn(events, 'publish').and.callFake(function (name, args) {
				// 	expect(name).toEqual('adde')
				// })

				// spyOn(events, 'publish').and.throwError('oops')
				// expect(function () {
				// 	numbers.add(1,1)
				// }).toThrowError('oops')

				numbers.add(this.numberInput1, this.numberInput2)
				// events.publish.calls.reset()

				expect(events.publish).toHaveBeenCalled()
				expect(events.publish).toHaveBeenCalledWith('added', {
					operands: [this.numberInput1, this.numberInput2],
					result: 3
				})

				expect(events.publish.calls.any()).toBe(true)
				expect(events.publish.calls.count()).toEqual(1)

				//
				numbers.add(this.numberInput1, this.stringInput1)
				expect(events.publish.calls.count()).toEqual(2)
				expect(events.publish.calls.argsFor(1)).toEqual(['added', {
					operands: [this.numberInput1, this.stringInput1],
					result: 2
				}])

				// expect to call any String, and any Object.. more generic test
				expect(events.publish.calls.mostRecent().args).toEqual([jasmine.any(String), jasmine.any(Object)])

				expect(events.publish.calls.allArgs()).toEqual([
						[jasmine.any(String), jasmine.any(Object)],
						[jasmine.any(String), jasmine.any(Object)]
					])

				calls = events.publish.calls.all()

				for(x = 0, length = calls.length; x < length; x+=1) {
					expect(calls[x].object.id).toEqual('events')
				}
			})
		})
	})
})
