import * as Basic from './../src/basic';

describe("(Basic)", function() {

	it("stuff", function() {
		const test = Basic.storeState();
		const test2 = test(Basic.changeStateReplace("one")("yes?"));
		const test3 = test(Basic.changeStateNone());
		expect(test3.one).toEqual("yes?");
	});
});
