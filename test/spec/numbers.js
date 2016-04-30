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

			// xit() will be pending
			it('should accept one or more numerical arguments and return the sum of them', function () {
				output = numbers.add(this.numberInput1, this.numberInput2)

				// assert
				expect(output).toEqual(3)
				expect(output).not.toEqual(4)

				// Triple A
			})

			it('shoud try to parse an integer when a string is passed to the method', function () {
				output = numbers.add(this.numberInput1, this.stringInput1)

				expect(output).toEqual(2)
			})

			it('shoud ignore the argument if it is not a parseable string', function () {
				output = numbers.add(this.numberInput1, this.stringInput2)

				expect(output).toEqual(1)
			})

			it('shoud publish an added event showing the operands passed to the method and the result', function () {
				spyOn(events, 'publish')

				numbers.add(this.numberInput1, this.numberInput2)

				expect(events.publish).toHaveBeenCalled()
				expect(events.publish).toHaveBeenCalledWith('added', {
					operands: [this.numberInput1, this.numberInput2],
					result: 3
				})
			})
		})
	})
})
