import $ from 'jquery';

export class Game {
	constructor() {
		this.player1 = new Player("Joe Blow");
		this.player2 = new Player("Jane Dough");
		this.itemDB = [];
		this.populateDB();
		this.activePage = "shop"; //"shop" or "battle"
		this.activePlayer = "p1"; //"p1" or "p2"
		console.log("game created");
	}

	populateDB() { // CLEAR //M means might, F means finesse, S means sorcery
		const newItems = [
			"No Weapon|		no-w|00,00,00,00|0|0",
			"No Top|		no-t|00,00,00,00|1|0",
			"No Bottom|		no-b|00,00,00,00|2|0",
			"No Accessory|	no-a|00,00,00,00|3|0",

			"Titanium Diboride Javelin|				ti2b-w|80,80,80,00|0|2500",
			"Titanium Diboride Chainmail Tunic|		ti2b-t|55,55,55,55|1|2500",
			"Titanium Diboride Plated Thighhighs|	ti2b-b|25,25,25,25|2|2500",
			"Titanium Diboride Reinforcements|		ti2b-a|19,19,19,19|3|2499",

			"Steel Greatsword|		steel-m-w|30,00,00,00|0|100",
			"Steel Bow and Arrows|	steel-f-w|00,30,00,00|0|100",
			"Steel Wand|			steel-s-w|00,00,30,00|0|100",
			"Steel Throwing Axe|	steel-mf-w|20,20,00,00|0|100",
			"Steel Chakram|			steel-fs-w|00,20,20,00|0|100",
			"Steel Battlestaff|		steel-ms-w|20,00,20,00|0|100",
			"Steel Javelin|			steel-mfs-w|15,15,15,00|0|100",

			"Steel Platebody|		steel-m-t|20,00,00,20|1|100",
			"Steel Platelegs|		steel-m-b|10,00,00,10|2|100",
			"Steel Studded Tunic|	steel-f-t|00,20,00,20|1|100",
			"Steel Studded Leggings|steel-f-b|00,10,00,10|2|100",
			"Steel Woven Robe|		steel-s-t|00,00,20,20|1|100",
			"Steel Woven Boots|		steel-s-b|00,00,10,10|2|100",

			"Duelist's Necklace|	steel-a|10,10,10,10|3|2499"
		];

		for (var i = 0; i < newItems.length; i++) {
			this.itemDB.push(new Equip(newItems[i].replace(/\t/g, "")));
		}

		console.log("itemDB populated with " + this.itemDB.length + " items");
	}

	findItemFromId(id) { // CLEAR
		for (var i = 0; i < this.itemDB.length; i++) {
			if (this.itemDB[i].id === id) {
				return i;
			}
		}
	}

	calcDamage(atkStat, defStat, defCon) { // CLEAR
		//let calced = Math.floor(atkStat * (0.75) * (1 - ((defStat/100)*(2/3)) + ((defCon/100)*(1/3))));
		let calced = Math.floor(atkStat * (1-(0.0075*(defStat*(2/3)+defCon*(1/3)))))
		console.log("Calculated damage: " + calced)
		return calced;
	}

	attack(taker, type) { // CLEAR 
		/*if (dealer === "p1") {
			this.player2.hp -= calcDamage(this.player1.curAtkStats.str,)
		}
		switch(dealer) {
			case "p1":
				switch(type)
		}*/
		let dealer = "";
		if (taker === "player1") {dealer = "player2";}
		if (taker === "player2") {dealer = "player1";}

		console.log(this[dealer].curAtkStats);
		console.log(this[taker].curDefStats[type]);
		let damage = this.calcDamage(this[dealer].curAtkStats[type], this[taker].curDefStats[type], this[taker].curDefStats.con);
		this[taker].hp -= damage;

		/*let type = "str";
		let damage = this.player2[type];*/

		console.log(dealer + " attacked " + taker + " for " + damage + " damage, using " + type);
	}

	checkVictoly() { // CLEAR
		let victoly = "";
		if (this.player1.hp <= 0) {
			victoly = this.player2.name;
		};
		if (this.player2.hp <= 0) {
			victoly = this.player1.name;
		};
		if (victoly != "") {
			alert(victoly + " wins! Return to shop to fight again.");
		};
	}
}

class Stats { // CLEAR
	constructor(stats) {
		this.str = parseInt(stats[0]); // Strength, melee-based
		this.mrx = parseInt(stats[1]); // Marksman, ranged-based
		this.spr = parseInt(stats[2]); // Spirit, magic-based
		this.con = parseInt(stats[3]); // Constitution, defense-based
	}
}

class Player { // CLEAR
	constructor(name) { // CLEAR
		this.name = name;
		this.hp = 100;
		this.charStats = new Stats([0,0,0,0]);
		this.equip = ["no-w", "no-t", "no-b", "no-a"]; // by id: weapon, top, bottom, accessory
		this.curAtkStats = new Stats([0,0,0,0]);
		this.curDefStats = new Stats([0,0,0,0]);

		this.money = 9999;
		this.inv = ["steel-m-w","steel-f-w","steel-s-w"];
		console.log("player " + this.name + " made");
	}

	refresh(game) { // CLEAR
		this.curAtkStats.str = this.charStats.str +
			game.itemDB[game.findItemFromId(this.equip[0])].stats.str +
			game.itemDB[game.findItemFromId(this.equip[3])].stats.str;
		this.curAtkStats.mrx = this.charStats.mrx +
			game.itemDB[game.findItemFromId(this.equip[0])].stats.mrx +
			game.itemDB[game.findItemFromId(this.equip[3])].stats.str;
		this.curAtkStats.spr = this.charStats.spr +
			game.itemDB[game.findItemFromId(this.equip[0])].stats.spr +
			game.itemDB[game.findItemFromId(this.equip[3])].stats.str;
		this.curAtkStats.con = 0;

		let equipStats = [this.charStats.str,this.charStats.mrx,this.charStats.spr,this.charStats.con];
		for (let i = 1; i < 4; i++) {
			equipStats[0] += game.itemDB[game.findItemFromId(this.equip[i])].stats.str;
			equipStats[1] += game.itemDB[game.findItemFromId(this.equip[i])].stats.mrx;
			equipStats[2] += game.itemDB[game.findItemFromId(this.equip[i])].stats.spr;
			equipStats[3] += game.itemDB[game.findItemFromId(this.equip[i])].stats.con;
		}

		this.curDefStats.str = equipStats[0];
		this.curDefStats.mrx = equipStats[1];
		this.curDefStats.spr = equipStats[2];
		this.curDefStats.con = equipStats[3];
	}

	swapEquip(game, invId, invSlot) { // CLEAR
		//let retain = [this.equip[game.itemDB[game.findItemFromId(id)].slot], id, game.itemDB[game.findItemFromId(id)].slot, this.inv[game.itemDB[game.findItemFromId(id)].slot]]
		//this.equip.splice(retain[0],1,id);
		//this.inv.splice(id,1,retain[0]);

		// let b = list[y]
		// list[y] = list[x]
		// list[x] = back

		//let EqpItemInQuestion = game.itemDB[game.findItemFromId(id);
		//let retain = [this.equip[itemInQuestion.slot],id,]
		let eqId = this.equip[game.itemDB[game.findItemFromId(invId)].slot];
		this.equip[game.itemDB[game.findItemFromId(invId)].slot] = invId;
		this.inv[invSlot] = eqId;

		//console.log("swapped " + retain[0] + " for " + retain[1] + " in slot " + retain[2]);
		console.log("swapped " + eqId + " for " + invId);
		this.refresh(game);
	}

	buyEquip(game, id) { // CLEAR
		if (this.money >= game.itemDB[game.findItemFromId(id)].value) {
			this.money -= game.itemDB[game.findItemFromId(id)].value;
			this.inv.push(id);
			console.log("bought " + id + " for " + game.itemDB[game.findItemFromId(id)].value);
		} else {
			console.log("couldn't buy " + id + ", too expensive");
		}
		this.refresh(game);
	}

	sellEquip(game, id, invSlot) { // CLEAR
		this.money += game.itemDB[game.findItemFromId(id)].value;
		this.inv.splice(invSlot,1);
		console.log("sold " + id + " for " + game.itemDB[game.findItemFromId(id)].value);
		this.refresh(game);
	}
}

class Equip { // CLEAR
	constructor(newItem) { // "name|id|0,0,0,0|slot|price"
		let splittedItem = newItem.split("|");
		this.name = splittedItem[0];
		this.id = splittedItem[1];
		this.stats = new Stats(splittedItem[2].split(","));
		this.slot = parseInt(splittedItem[3]);
		this.value = parseInt(splittedItem[4]);
	}
}
