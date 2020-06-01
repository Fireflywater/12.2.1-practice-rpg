import * as Basic from './../src/basic';
import * as Main from './../src/main';

describe("(Basic)", function() {

	it("stuff", function() {
		const test = Basic.storeState();
		const test2 = test(Basic.changeStateReplace("one")("yes?"));
		const test3 = test(Basic.changeStateNone());
		expect(test3.one).toEqual("yes?");
	});

	it("find from id", function() {
		const items = [{
			"name": "this isn't right",
			"id": "alpha"
		},
		{
			"name": "oh, this is it",
			"id": "beta"
		},
		{
			"name": "this isn't right either",
			"id": "omega"
		}];
		const test = Main.findItemFromId(items, "beta", 0);
		expect(test.name).toEqual("oh, this is it");
	});

});
