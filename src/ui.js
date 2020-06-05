import $ from 'jquery';
import * as Basic from './basic';
import * as Main from './main';

export const refreshUI = (db, p1, p2) => {
  const p1Ref = p1(Main.refreshPlayer(db));
  const p2Ref = p2(Main.refreshPlayer(db));

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
	$(".p1Stats").append(assemblePlayerUI(db, p1Ref));
	// p1Items
	for (let i = 0; i < p1Ref.inv.length; i++) {
		$(".p1Items").append(assembleItemUI("p1inv","equip","sell",p1Ref.inv[i],Main.findItemFromId(db, p1Ref.inv[i], 0).name,i));
	}
	// p2Stats
	$(".p2Stats").append(assemblePlayerUI(db, p2Ref));
	// p2Items
	for (let i = 0; i < p2Ref.inv.length; i++) {
		$(".p2Items").append(assembleItemUI("p2inv","sell","equip",p2Ref.inv[i],Main.findItemFromId(db, p2Ref.inv[i], 0).name,i));
	}
	// shop
	for (let i = 0; i < db.length; i++) {
		$(".shop").append(assembleItemUI("shop","p1","p2",db[i].id,db[i].name," "));
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
		let splitted = $(this).attr("id").split("|");
		switch(splitted[0]) {
			case "shop": // SHOP TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "p1": // SHOP BUY -> P1
            const p1Buy = p1(Main.buyEquip(db, splitted[2]));
						break;
					case "p2": // SHOP BUY -> P1
            const p2Buy = p2(Main.buyEquip(db, splitted[2]));
						break;
					case "switchScene":
						$("#shopPage").toggle();
						$("#battlePage").toggle();
						break;
					default: break;
				}
				break;
			case "p1inv": // P1 INV TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "equip": // P1INV -> EQUIP
            const p1Swap = p1(Main.swapEquip(db, splitted[2], splitted[3]));
						break;
					case "sell": // P1INV -> SELL
            const p1Sell = p1(Main.sellEquip(db, splitted[2]));
						break;
					default: break;
				}
				break;
			case "p2inv": // P2 INV TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "equip": // P2 INV -> EQUIP
            const p2Swap = p2(Main.swapEquip(db, splitted[2], splitted[3]));
						break;
					case "sell": // P2 INV -> SELL
            const p2Sell = p2(Main.sellEquip(db, splitted[2]));
						break;
					default: break;
				}
				break;
			case "battle": // BATTLE TYPE BUTTON CLICKED
				switch(splitted[1]) {
					case "atk": // ATTAAAAACK
            switch(splitted[2]) {
              case "player1":
                const p1Ouch = p1(Main.attack(p2Ref, splitted[3]));
                break;
              case "player2":
                const p2Ouch = p2(Main.attack(p1Ref, splitted[3]));
                break;
              default: break;
            }
						pass();
						break;
					case "pass": // Pass turn in favor for other player
						pass();
						break;
					case "switchScene":
						$("#shopPage").toggle();
						$("#battlePage").toggle();
            const p1Heal = p1(Basic.changeStateReplace("hp")(100));
            const p2Heal = p2(Basic.changeStateReplace("hp")(100));
						break;
					default: break;
				}
				break;
			default: break;
		}
		refreshUI(db, p1, p2);
	});
	Main.checkVictoly(p1Ref, p2Ref);
}

const assembleItemUI = (section, leftA, rightA, id, name, xtra) => {
	return `
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
}

const assemblePlayerUI = (db, player) => {
	/*let playerObj = game.player1;
	switch(p) {
		case "p1":
			playerObj = game.player1;
			break;
		case "p2":
			playerObj = game.player2;
			break;
		default: break;
	}*/
	return `
	<div class="card fullWidth">
		<div class="card-body">
			${player.name} <br/>
			$$$: ${player.money} <br/>
		</div>
	</div>
	<div class="card fullWidth">
		<div class="card-body">
			HP: ${player.hp} <br/>
			###: ATK | DEF <br/>
			STR: ${player.curAtkStats.str} | ${player.curDefStats.str} <br/>
			MRX: ${player.curAtkStats.mrx} | ${player.curDefStats.mrx} <br/>
			SPR: ${player.curAtkStats.spr} | ${player.curDefStats.spr} <br/>
			CON: ${player.curAtkStats.con} | ${player.curDefStats.con} <br/>
		</div>
	</div>
	<div class="card fullWidth">
		<div class="card-body">
			###: EQP <br/>
			WEP: ${Main.findItemFromId(db, player.equip[0], 0).name} <br/>
			TOP: ${Main.findItemFromId(db, player.equip[1], 0).name} <br/>
			BTM: ${Main.findItemFromId(db, player.equip[2], 0).name} <br/>
			ACC: ${Main.findItemFromId(db, player.equip[3], 0).name} <br/>
		</div>
	</div>
	`;
}

const pass = () => {
	$(".p2Actions").toggle();
	$(".p1Actions").toggle();
}
