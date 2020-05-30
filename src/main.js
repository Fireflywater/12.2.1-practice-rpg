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
  console.log("player " + name + " made");
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

$(document).ready(function() {

  let allCards = []; // Note: Figure out some why to eliminate this let
  Basic.apiGet("items").then(function(response) {
    allCards = response;
  });

  const player1 = Basic.storeState()(Basic.changeStateReplaceWholeObj(constructPlayer("player1")));

  console.log(player1.name, player1.hp);
  setTimeout(() => {
    console.log("allCards", allCards)
  }, 1000)
});
