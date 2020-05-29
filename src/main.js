import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import * as State from './basic';

//const setStats = State.ChangeStateReplaceArray(["str","mrx","spr","con"])([0,0,0,0]);

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

  const player1 = State.storeState()(State.changeStateReplaceWholeObj(constructPlayer("player1")));

  console.log(player1.name, player1.hp);
});
