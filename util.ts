import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';

declare var positions: any;
declare var currPos: any;
declare var currMov: any;
declare var name: any;
declare var pzsolved: any;
export function toDests(chess: any): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach(s => {
    const ms = chess.moves({square: s, verbose: true});
    if (ms.length) dests.set(s, ms.map(m => m.to));
  });
  return dests;
}

export function toColor(chess: any): Color {
  return (chess.turn() === 'w') ? 'white' : 'black';

}

export function aiPlay(cg: Api, chess, delay: number) {
  return (orig, dest) => {
      if(currMov<positions[currPos].moves.length){
   var move= chess.move({from: orig, to: dest});
    var mv=positions[currPos].moves[currMov].trim();
    console.log(mv);
    var undomove=false;
      if (move!==null && move.from.concat(move.to)!== mv && !chess.in_checkmate()) { 	
        chess.undo();
      cg.set({
      fen:chess.fen(),
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      }
    });
    undomove=true;
   currMov=positions[currPos].moves.length
    $('#usermsg').html("Wrong, Click on Load Nex Puzzle");
 } 
if(undomove===false){
    setTimeout(() => {
       currMov+=1;
      if(currMov<positions[currPos].moves.length){
      var mv=positions[currPos].moves[currMov].trim();
        var move= chess.move(mv,{ sloppy: true });
	if(move!==null){
        currMov+=1;
	  console.log(move);
      cg.move(move.from, move.to);
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        }
      });
    } } else {  
    if(pzsolved !==null){
   pzsolved=pzsolved+1;
   } else {
  pzsolved=1
   }
   $('#usermsg').html("Solved, Click on Load Nex Puzzle");
   $('#score').html("Puzzles Solved: "+ pzsolved.length);
   }    
    } , delay);}
 } else {
  console.log("Next Puzzle");
 }

  };
}


