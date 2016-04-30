/*globals define, describe*/
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

define(['numbers', 'events', 'lib/matchers'], function (numbers, events, matchers) {
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

				jasmine.addMatchers(matchers)
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

			it('shoud publish an added event showing the operands passed to the method, the result and a number fact', function (done) {
				var that = this

				events.subscribe('added', function (data) {
					expect(data.operands).toEqual([that.numberInput1, that.numberInput2])
					expect(data.result).toEqual(3)
					expect(data.triviaFact).toEqual(jasmine.any(String))

					console.log(data.triviaFact)

					done()
				})

				numbers.add(this.numberInput1, this.numberInput2)
			})

			it('should return numbers that are either odd or even', function () {
				output = numbers.add(this.numberInput1, this.numberInput2)

				expect(output).toBeOdd()

				// custom error message
				// output = numbers.add(this.numberInput1, this.numberInput1)

				// expect(output).toBeOdd()
			})
		})

		describe('The addAfterDelay method', function () {
			var noop = function () {}

			beforeEach(function () {
				spyOn(numbers, 'add')

				jasmine.clock().install()
			})

			afterEach(function () {
				jasmine.clock().uninstall()
			})

			it('should invoke the add method after a specified delay', function () {
				numbers.addAfterDelay(1000, noop, 1, 2)

				expect(numbers.add).not.toHaveBeenCalled()

				jasmine.clock().tick(1001)

				expect(numbers.add).toHaveBeenCalled()
			})
		})
	})
})
