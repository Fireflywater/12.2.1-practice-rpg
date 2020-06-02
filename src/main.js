import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import * as Basic from './basic';

export const constructStats = (stats) => {
  return {
    "str": stats[0],
    "mrx": stats[1],
    "spr": stats[2],
    "con": stats[3]
  };
}

export const constructPlayer = (name) => {
  return {
    "name": name,
		"hp": 100,
		"charStats": constructStats([0,0,0,0]),
		"equip": ["no-w", "no-t", "no-b", "no-a"], // by id: weapon, top, bottom, accessory
		"curAtkStats": constructStats([0,0,0,0]),
		"curDefStats": constructStats([0,0,0,0]),

		"money": 9999,
		"inv": ["steel-m-w","steel-f-w","steel-s-w"]
  };
}

export const findItemFromId = (db, id, i) => {
  //console.log("FIND ITEM", id, i, db[i]);
  if ((i > db.length) || (db[i] === undefined)) {
    console.log("Could not find item", id);
    return "ERROR";
  } else if (db[i].id === id) {
    return db[i];
  } else {
    return findItemFromId(db, id, i+1);
  }
}

const calcDamage = (atkStat, defStat, defCon) => {
  return Math.floor(atkStat * (1-(0.0075*(defStat*(2/3)+defCon*(1/3)))));
}

const checkVictoly = (p1, p2) => {
  const vicMessage = " wins! Return to shop to fight again.";
  if (p1.hp <= 0) {
    alert(p1.name + vicMessage);
  } else if (p2.hp <= 0) {
    alert(p2.name + vicMessage);
  }
}

/*export const refreshPlayer = (player, db) => {
  const atkStats = constructStats([
    player.charStats.str + findItemFromId(db, player.equip[0], 0).stats[0] + findItemFromId(db, player.equip[3], 0).stats[0],
    player.charStats.mrx + findItemFromId(db, player.equip[0], 0).stats[1] + findItemFromId(db, player.equip[3], 0).stats[1],
    player.charStats.spr + findItemFromId(db, player.equip[0], 0).stats[2] + findItemFromId(db, player.equip[3], 0).stats[2],
    player.charStats.con + 0
  ]);
  const playerAfterAtk = player(Basic.changeStateReplace("curAtkStats")(atkStats));

  const defStats = constructStats([
    player.charStats.str + player.equip.reduce(function(e, v) {
      return findItemFromId(db, e, 0).stats[0] + v;
    }, 0),
    player.charStats.mrx + player.equip.reduce(function(e, v) {
      return findItemFromId(db, e, 0).stats[1] + v;
    }, 0),
    player.charStats.spr + player.equip.reduce(function(e, v) {
      return findItemFromId(db, e, 0).stats[2] + v;
    }, 0),
    player.charStats.con + player.equip.reduce(function(e, v) {
      return findItemFromId(db, e, 0).stats[3] + v;
    }, 0)
  ]);
  const defStats = constructStats([0,0,0,0]);
  const playerAfterDef = playerAfterAtk(Basic.changeStateReplace("curDefStats")(defStats));

  return playerAfterDef;
}*/

export const refreshPlayer = (db) => {
  return (state) => {
    const atkStats = constructStats([
      state.charStats.str + findItemFromId(db, state.equip[0], 0).stats[0] + findItemFromId(db, state.equip[3], 0).stats[0],
      state.charStats.mrx + findItemFromId(db, state.equip[0], 0).stats[1] + findItemFromId(db, state.equip[3], 0).stats[1],
      state.charStats.spr + findItemFromId(db, state.equip[0], 0).stats[2] + findItemFromId(db, state.equip[3], 0).stats[2],
      state.charStats.con + 0
    ]);

    const defStats = constructStats([
      state.equip.reduce(function(v, e) {
        if (state.equip.indexOf(e) === 0) {
          return v;
        } else {
          return findItemFromId(db, e, 0).stats[0] + v;
        }
      }, 0),
      state.equip.reduce(function(v, e) {
        if (state.equip.indexOf(e) === 0) {
          return v;
        } else {
          return findItemFromId(db, e, 0).stats[1] + v;
        }
      }, 0),
      state.equip.reduce(function(v, e) {
        if (state.equip.indexOf(e) === 0) {
          return v;
        } else {
          return findItemFromId(db, e, 0).stats[2] + v;
        }
      }, 0),
      state.equip.reduce(function(v, e) {
        if (state.equip.indexOf(e) === 0) {
          return v;
        } else {
          return findItemFromId(db, e, 0).stats[3] + v;
        }
      }, 0)
    ]);

    return {...state,
      "curAtkStats": atkStats,
      "curDefStats": defStats
    }
  }
}

export const swapEquip = (db, invId, slot) => {
  return (state) => {
    const eqId = state.equip[findItemFromId(db, invId, 0).slot];
    const process = (array, input, index) => {
      let internalthing = array;
      internalthing[index] = input;
      return internalthing;
    }

    return {...state,
      "inv": process(state.inv, eqId, slot),
      "equip": process(state.equip, invId, findItemFromId(db, invId, 0).slot)
    }
  }
}

export const buyEquip = (db, id) => {
  return (state) => {
    if (state.money >= findItemFromId(db, id, 0).value) {
      return {...state,
        "inv": state.inv.concat([id]),
        "money": state.money - findItemFromId(db, id, 0).value
      }
    } else {
      return {...state}
    }
  }
}

/*buyEquip(game, id) {
  if (this.money >= game.itemDB[game.findItemFromId(id)].value) {
    this.money -= game.itemDB[game.findItemFromId(id)].value;
    this.inv.push(id);
    console.log("bought " + id + " for " + game.itemDB[game.findItemFromId(id)].value);
  } else {
    console.log("couldn't buy " + id + ", too expensive");
  }
  this.refresh(game);
}*/

$(document).ready(function() {

  let allCards = []; // Note: Figure out some why to eliminate this let
  Basic.apiGet("items").then(function(response) {
    allCards = response;
  });

  const player1 = Basic.storeState(constructPlayer("testPlayer"));
  //(Basic.changeStateReplaceWholeObj(constructPlayer("player1")));
});
