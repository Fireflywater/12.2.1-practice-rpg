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
				"name": "Test / Steel Greatsword",
				"id": "steel-m-w",
				"stats": [30,0,0,0],
				"slot": 0
			},
			{
				"name": "Test / Steel Bow and Arrows",
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

	it("buy equips success", function() {
		const items = [
			{
				"name": "Test / Steel Wand",
				"id": "steel-s-w",
				"stats": [0,0,30,0],
				"slot": 0,
				"value": 100
			}
		];
		const player = Basic.storeState(Main.constructPlayer("testPlayer"));
		const playerPost = player(Basic.changeStateReplace("money")(200));
		const playerPost2 = player(Basic.changeStateReplace("inv")(["no-w"]));
		const playerPost3 = player(Main.buyEquip(items, "steel-s-w"));
		expect(playerPost3.inv.includes("steel-s-w")).toEqual(true);
		expect(playerPost3.money).toEqual(100);
	});

	it("buy equips fail", function() {
		const items = [
			{
				"name": "Test / Steel Wand",
				"id": "steel-s-w",
				"stats": [0,0,30,0],
				"slot": 0,
				"value": 100
			}
		];
		const player = Basic.storeState(Main.constructPlayer("testPlayer"));
		const playerPost = player(Basic.changeStateReplace("money")(0));
		const playerPost2 = player(Basic.changeStateReplace("inv")(["no-w"]));
		const playerPost3 = player(Main.buyEquip(items, "steel-s-w"));
		expect(playerPost3.inv.includes("steel-s-w")).toEqual(false);
		expect(playerPost3.money).toEqual(0);
	});

	it("sell equips", function() {
		const items = [
			{
				"name": "Test / Steel Wand",
				"id": "steel-s-w",
				"stats": [0,0,30,0],
				"slot": 0,
				"value": 100
			}
		];
		const player = Basic.storeState(Main.constructPlayer("testPlayer"));
		const playerPost = player(Basic.changeStateReplace("money")(0));
		const playerPost2 = player(Basic.changeStateReplace("inv")(["steel-s-w", "no-w"]));
		const playerPost3 = player(Main.sellEquip(items, "steel-s-w"));
		expect(playerPost3.inv.includes("steel-s-w")).toEqual(false);
		expect(playerPost3.money).toEqual(100);
	});

	it("attacks correctly", function() {
		const items = [
			{
				"name": "No Weapon",
				"id": "no-w",
				"stats": [0,0,0,0],
				"slot": 0,
				"value": 0
			},
			{
				"name": "No Top",
				"id": "no-t",
				"stats": [0,0,0,0],
				"slot": 1,
				"value": 0
			},
			{
				"name": "No Bottom",
				"id": "no-b",
				"stats": [0,0,0,0],
				"slot": 2,
				"value": 0
			},
			{
				"name": "No Accessory",
				"id": "no-a",
				"stats": [0,0,0,0],
				"slot": 3,
				"value": 0
			}
		];
		const player1 = Basic.storeState(Main.constructPlayer("testPlayer1"));
		const player1Post = player1(Basic.changeStateReplace("curAtkStats")(Main.constructStats([99,99,99,0])));
		const player2 = Basic.storeState(Main.constructPlayer("testPlayer2"));
		const player2Post = player2(Basic.changeStateReplace("curDefStats")(Main.constructStats([0,0,0,0])));
		const player2Ouch = player2(Main.attack(player1Post, "str"));
		expect(player2Ouch.hp).toEqual(1);
	});
});
