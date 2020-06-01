import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import * as Basic from './basic';

const constructStats = (stats) => {
  return {
    "str": stats[0],
    "mrx": stats[1],
    "spr": stats[2],
    "con": stats[3]
  };
}

const constructPlayer = (name) => {
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
  if (db[i].id == id) {
    return db[i];
  } else {
    return findItemFromId(db, id, i+1);
  }
}

$(document).ready(function() {

  let allCards = []; // Note: Figure out some why to eliminate this let
  Basic.apiGet("items").then(function(response) {
    allCards = response;
  });

  const player1 = Basic.storeState()(Basic.changeStateReplaceWholeObj(constructPlayer("player1")));
});
