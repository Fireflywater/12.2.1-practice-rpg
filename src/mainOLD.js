import $ from 'jquery';
import { Game } from './gameOLD';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

let game = new Game();

function refreshUI() {
	const blankOut = [".p1Stats", ".p1Items", ".p2Stats", ".p2Items", ".shop", ".shopHead", ".battleHead", ".p1Actions", ".p2Actions"];
	for (let i = 0; i < blankOut.length; i++) {
		$(blankOut[i]).empty();
	}
	// shopHead
	$(".shopHead").append(`
	<div class="row">
		<div class="col-md-6">
			<div class="card fullWidth">
				<div class="card-body">
					<h3>It's the shop!</h3>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<button id="shop|switchScene" class="fullWidth btn btn-primary" type="button"><h3>To Battle!</h3></button>
		</div>
	</div>
	`);
	// p1Stats
	//$(".p1Stats").append(JSON.stringify(game.player1).replace(/,/g,"<br/>"));
	$(".p1Stats").append(assemblePlayerUI("p1"));
	// p1Items
	for (let i = 0; i < game.player1.inv.length; i++) {
		$(".p1Items").append(assembleItemUI("p1inv","equip","sell",game.player1.inv[i],game.itemDB[game.findItemFromId(game.player1.inv[i])].name,i));
	}
	// p2Stats
	//$(".p2Stats").append(JSON.stringify(game.player2).replace(/,/g,"<br/>"));
	$(".p2Stats").append(assemblePlayerUI("p2"));
	// p2Items
	for (let i = 0; i < game.player2.inv.length; i++) {
		$(".p2Items").append(assembleItemUI("p2inv","sell","equip",game.player2.inv[i],game.itemDB[game.findItemFromId(game.player2.inv[i])].name,i));
	}
	// shop
	for (let i = 0; i < game.itemDB.length; i++) {
		$(".shop").append(assembleItemUI("shop","p1","p2",game.itemDB[i].id,game.itemDB[i].name," "));
	}


	// battleHead
	$(".battleHead").append(`
	<div class="row">
		<div class="col-md-6">
			<div class="card fullWidth">
				<div class="card-body">
					<h3>It's a fight!</h3>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<button id="battle|switchScene" class="fullWidth btn btn-primary" type="button"><h3>To Shop!</h3></button>
		</div>
	</div>
	`);

	// p1Actions
	$(".p1Actions").append(assembleItemUI("battle","atk","atk","player2","MELEE","str"));
	$(".p1Actions").append(assembleItemUI("battle","atk","atk","player2","MISSILE","mrx"));
	$(".p1Actions").append(assembleItemUI("battle","atk","atk","player2","MAGIC","spr"));
	$(".p1Actions").append(assembleItemUI("battle","pass","pass"," ","PASS"," "));

	// p2Actions
	$(".p2Actions").append(assembleItemUI("battle","atk","atk","player1","MELEE","str"));
	$(".p2Actions").append(assembleItemUI("battle","atk","atk","player1","MISSILE","mrx"));
	$(".p2Actions").append(assembleItemUI("battle","atk","atk","player1","MAGIC","spr"));
	$(".p2Actions").append(assembleItemUI("battle","pass","pass"," ","PASS"," "));

	// register buttons
	$("button").on("click", function() {
		console.log("clicked: " + $(this).attr("id"));
		let splitted = $(this).attr("id").split("|");
		switch(splitted[0]) {
			case "shop": // SHOP TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "p1": // SHOP BUY -> P1
						game.player1.buyEquip(game, splitted[2]);
						break;
					case "p2": // SHOP BUY -> P1
						game.player2.buyEquip(game, splitted[2]);
						break;
					case "switchScene":
						$("#shopPage").toggle();
						$("#battlePage").toggle();
						console.log("Swiching scenes, huh?");
						break;
					default: break;
				}
				break;
			case "p1inv": // P1 INV TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "equip": // P1INV -> EQUIP
						game.player1.swapEquip(game, splitted[2], splitted[3]);
						break;
					case "sell": // P1INV -> SELL
						game.player1.sellEquip(game, splitted[2], splitted[3]);
						break;
					default: break;
				}
				break;
			case "p2inv": // P2 INV TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "equip": // P2 INV -> EQUIP
						game.player2.swapEquip(game, splitted[2], splitted[3]);
						break;
					case "sell": // P2 INV -> SELL
						game.player2.sellEquip(game, splitted[2], splitted[3]);
						break;
					default: break;
				}
				break;
			case "battle": // BATTLE TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "atk": // ATTAAAAACK
						game.attack(splitted[2], splitted[3]);
						pass();
						break;
					case "pass": // Pass turn in favor for other player
						pass();
						break;
					case "switchScene":
						$("#shopPage").toggle();
						$("#battlePage").toggle();
						game.player1.hp = 100;
						game.player2.hp = 100;
						break;
					default: break;
				}
				break;
			default: break;
		}
		refreshUI();
	});
	game.checkVictoly();
}

function assembleItemUI(section, leftA, rightA, id, name, xtra) {
	let newElem = `
	<div id="${section}|${id}" class="row">
		<button id="${section}|${leftA}|${id}|${xtra}" class="leftBtn btn btn-primary" type="button"><<</button>
		<div class="card">
			<div class="card-body">
				${name}
			</div>
		</div>
		<button id="${section}|${rightA}|${id}|${xtra}" class="rightBtn btn btn-primary" type="button">>></button>
	</div>
	`;
	return newElem;
}

function assemblePlayerUI(p) {
	let playerObj = game.player1;
	switch(p) {
		case "p1":
			playerObj = game.player1;
			break;
		case "p2":
			playerObj = game.player2;
			break;
		default: break;
	}
	let newElem = `
	<div class="card fullWidth">
		<div class="card-body">
			${playerObj.name} <br/>
			$$$: ${playerObj.money} <br/>
		</div>
	</div>
	<div class="card fullWidth">
		<div class="card-body">
			HP: ${playerObj.hp} <br/>
			###: ATK | DEF <br/>
			STR: ${playerObj.curAtkStats.str} | ${playerObj.curDefStats.str} <br/>
			MRX: ${playerObj.curAtkStats.mrx} | ${playerObj.curDefStats.mrx} <br/>
			SPR: ${playerObj.curAtkStats.spr} | ${playerObj.curDefStats.spr} <br/>
			CON: ${playerObj.curAtkStats.con} | ${playerObj.curDefStats.con} <br/>
		</div>
	</div>
	<div class="card fullWidth">
		<div class="card-body">
			###: EQP <br/>
			WEP: ${game.itemDB[game.findItemFromId(playerObj.equip[0])].name} <br/>
			TOP: ${game.itemDB[game.findItemFromId(playerObj.equip[1])].name} <br/>
			BTM: ${game.itemDB[game.findItemFromId(playerObj.equip[2])].name} <br/>
			ACC: ${game.itemDB[game.findItemFromId(playerObj.equip[3])].name} <br/>
		</div>
	</div>
	`;
	return newElem;
}

function pass() {
	$(".p2Actions").toggle();
	$(".p1Actions").toggle();
}

$(document).ready(function() {
	$("#battlePage").hide();
	$(".p2Actions").hide();
	refreshUI();
	//$("button").on("click", function() {
	//	console.log("clicked: " + $(this).attr("id"));
	//})
});
