import * as Basic from './../src/basic';
import * as Main from './../src/main';

describe("(Basic)", function() {

	it("stuff", function() {
		const test = Basic.storeState({});
		const test2 = test(Basic.changeStateReplace("one")("yes?"));
		const test3 = test(Basic.changeStateNone());
		expect(test3.one).toEqual("yes?");
	});

	it("find from id", function() {
		const items = [
			{
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
			}
		];
		const test = Main.findItemFromId(items, "beta", 0);
		expect(test.name).toEqual("oh, this is it");
	});

	it("refresh stats correctly", function() {
		const items = [
			{
				"name": "Test / Steel Javelin",
				"id": "steel-mfs-w",
				"stats": [15,15,15,0]
			},
			{
				"name": "Test / Steel Platebody",
				"id": "steel-m-t",
				"stats": [20,0,0,20]
			},
			{
				"name": "Test / Steel Platelegs",
				"id": "steel-m-b",
				"stats": [10,0,0,10]
			},
			{
				"name": "Test / Duelist's Necklace",
				"id": "steel-a",
				"stats": [10,10,10,10]
			}
		];
		const player = Basic.storeState(Main.constructPlayer("testPlayer"));
		const playerPost = player(Basic.changeStateReplace("equip")(["steel-mfs-w","steel-m-t","steel-m-b","steel-a"]));
		const playerRefreshed = player(Main.refreshPlayer(items));
		expect(playerRefreshed.curAtkStats).toEqual(Main.constructStats([25,25,25,0]));
		expect(playerRefreshed.curDefStats).toEqual(Main.constructStats([40,10,10,40]));

	});

	it("swap equips", function() {
		const items = [
			{
				"name": "Steel Greatsword",
				"id": "steel-m-w",
				"stats": [30,0,0,0],
				"slot": 0
			},
			{
				"name": "Steel Bow and Arrows",
				"id": "steel-f-w",
				"stats": [0,30,0,0],
				"slot": 0
			}
		];
		const player = Basic.storeState(Main.constructPlayer("testPlayer"));
		const playerPost = player(Basic.changeStateReplace("equip")(["steel-m-w","no-t","no-b","no-a"]));
		const playerPost2 = player(Basic.changeStateReplace("inv")(["steel-f-w","no-w"]));
		const playerPost3 = player(Main.swapEquip(items, "steel-f-w", 0));
		expect(playerPost3.equip[0]).toEqual("steel-f-w");
		expect(playerPost3.inv).toEqual(["steel-m-w","no-w"]);
	});
});
