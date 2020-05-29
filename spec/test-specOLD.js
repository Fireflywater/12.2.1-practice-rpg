import { Game } from './../src/gameOLD';

let game = new Game();

describe("(Game)", function() {

	it("should calculate damage properly", function() {
		let num = game.calcDamage(100,100,100);
		expect(num).toEqual(25);
	});

	it("player 1 should start with no-w, no-t, no-b, no-a equipped", function() {
		expect(game.player1.equip).toEqual(["no-w", "no-t", "no-b", "no-a"]);
	});

	it("player 1 should start with steel-m-w, steel-f-w, steel-s-w in inventory", function() {
		expect(game.player1.inv).toEqual(["steel-m-w","steel-f-w","steel-s-w"]);
	});

	it("player 1 should start with 9999 money", function() {
		expect(game.player1.money).toEqual(9999);
	});

	it("player 1 should then buy ti-2b", function() {
		game.player1.buyEquip(game, "ti2b-w");
		expect(game.player1.inv[3]).toEqual("ti2b-w");
		expect(game.player1.money).toEqual(7499);
	});

	it("player 1 should then swap no-w with ti2b-w", function() {
		game.player1.swapEquip(game, "ti2b-w", 0);
		expect(game.player1.equip[0]).toEqual("ti2b-w");
	});

	it("player 1 should then have atkStats equal 80, 80, 80, 0", function() {
		expect(game.player1.curAtkStats.str).toEqual(80);
		expect(game.player1.curAtkStats.mrx).toEqual(80);
		expect(game.player1.curAtkStats.spr).toEqual(80);
		expect(game.player1.curAtkStats.con).toEqual(0);
	});
});
