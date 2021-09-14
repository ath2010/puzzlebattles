positions = [];
var currPos=0;
var currMov=0;
dpzsolved=null;
var dendTime=null;
var tour;
var tourid;
autoload=false;
$(function() {
     var start = document.getElementById('start');
    if(start!==null){
    start.parentNode.removeChild(start);
    }

    socket = io("");    
    console.log( "ready!" );
    //get tour id
     var url = document.URL;
     tourid = url.substring(url.indexOf("=")+1);
     loginuser=localStorage.getItem("lichesslogin");
     dpzsolved = localStorage.getItem(tourid+"dpzsolved");
    
    if(tourid && loginuser && (!dpzsolved || dpzsolved.length<1)){
        player=JSON.stringify({"username":loginuser,"tourid":tourid})
        console.log(tourid);
       connected = true;
       $('#usermsg').html("Welcome,"+loginuser +"Puzzle rush will start now in few seconds") ;
       socket.emit('get game',player);
    } else{
        tour=localStorage.getItem(tourid);
        console.log("existing"+tour);
        if(tour){
        tour=localStorage.getItem(tourid);
        tour=JSON.parse(tour)
        tourid=tour.tourid;
    }
    }
    
 //get tour
 socket.on('init-game', async data => {
     console.log(data);
     tour=JSON.parse(data); 
    localStorage.setItem(tour.tourid,data);
    if(tour.autoload)
    autoload=tour.autoload;
    if(tour.isJoined&&!tour.attempted){
          setTimeout(function(){ 
          startPuzzle();
        },2000);
        } 
  });

  socket.on('info message', function (data) {
    $('#usermsg').html('<div class="error message"><h3>data</h3></div>');
    setTimeout( ()=>{  $('#usermsg').html(" ") }	,10000);
     });
  
     dendTime=localStorage.getItem(tourid+"dendTime");
	if (dendTime!==null && dendTime!==tourid+"DEXPIRED" && tour)
	{	
    loadControlButtons();
	 puzzleclock();
	 loadPuzzles();
	 console.log(dpzsolved);
	 if(dpzsolved !==null){
	  $('#score').html("Puzzles Solved: "+ dpzsolved.length);
	 }
    } else if(tour){
        console.log(tour);
        if(!tour.attempted){
            startPuzzle();   
        }
    }

});

function loadControlButtons(){
  var next = document.getElementById('next');
   var end = document.getElementById('end');
 
   if(next===null){
   var new_btn = $('<button class="btn btn-success title="Next Puzzle Rush" id="next"  onclick="nextPuzzle()">Load Next Puzzle</button> ');         
     new_btn.insertAfter('#usermsg');      
   }
    if(end===null){
   var new_btn = $('<button class="btn btn-danger" title="End Puzzle Rush" id="end" onclick="endPuzzle()">End Puzzle Rush</button>');         
     new_btn.insertAfter('#score');      
   }
     console.log(next);
}



function startPuzzle(){
 if(tour){
   var minsToAdd=tour.duration;
    dpzsolved="";
    dendTime=getCurrentTime()+minsToAdd * 60000;
    localStorage.setItem(tourid+"dendTime",dendTime);
    localStorage.setItem(tourid+"dpzsolved",dpzsolved);
   $('#usermsg').html(" ");
   loadControlButtons();
   puzzleclock();
   loadPuzzles();
}
}

function endPuzzle(){
	  $('#usermsg').html("Puzzle Rush ended");
	  if(dpzsolved!==null){
	  $('#score').html("Puzzles Solved: "+ dpzsolved.length);
       if(dpzsolved.length>0)
       postReport(dpzsolved.length);
	  }
	    dendTime=tourid+"DEXPIRED";
	    localStorage.removeItem(tourid+"dendTime");
		localStorage.removeItem(tourid+"dpzsolved");
		localStorage.removeItem(tourid);
	   document.getElementById("time").innerHTML ="" ; 
	    $('#usermsg').html("<a class='text fbt strong glowing' href='https://www.learnmyskills.com/tournament/" +tourid+"'>Back to tournament page</a>");
	   var end = document.getElementById('end');
        end.parentNode.removeChild(end);
		 var next = document.getElementById('next');
        next.parentNode.removeChild(next);
}

function nextPuzzle(){
  if(autoload){
    currPos+=1;
    ChessgroundExamples.run(document.getElementById('chessground-examples'));
  } else{
   localStorage.setItem(tourid+"dpzsolved",dpzsolved);
   window.location.href ="https://www.learnmyskills.com/rush.html?tourid="+tourid;
  }
}

function loadPuzzles(){
	{
            $.post("loadpz.php",{key: tour.theme},
                function (data)
                {
var jdata=JSON.parse(data);	
    for (var i = 0; i < jdata.length; i++) {
		if(jdata[i].moves!==null){	
       var moves =jdata[i].Moves.split(" ");
	   positions.push({fen:jdata[i].FEN,moves:moves});
		 console.log(jdata[i].Rating);
		}
    }
     ChessgroundExamples.run(document.getElementById('chessground-examples'));	 
	});
   }
}


function getCurrentTime(){
 return new Date().getTime();
}

function puzzleclock(){
var x = setInterval(function() {
if(dendTime!==tourid+"DEXPIRED"){
 var now = new Date().getTime();
var t = dendTime - now;
var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((t % (1000 * 60)) / 1000);
document.getElementById("time").innerHTML = minutes+":"+seconds;  


if (t < 0 ) {
        clearInterval(x);
		localStorage.setItem(tourid+"dendTime","DEXPIRED");
		endPuzzle();
        document.getElementById("time").innerHTML ="TIME UP" ; 
        } }
		}, 1000);
}


function postReport(score1) {
	{
      var user1=localStorage.getItem("lichesslogin");
      console.log(tour.tourid);
      var player={"username":user1,"tourid":tour.tourid,"score":score1};
       socket.emit('update player',JSON.stringify(player));
      $.post(tour.report,{key: user1,score: score1,tourid:tour.tourid},
                function (data)
                {
				console.log(data);		 
}	
  	);
	 
   }
}

   function currentRushTimer(){
  // The data/time we want to countdown to
	if(tour){
    var countDownDate =tour.endHour ;
    // Run currrush every second
    var currrush = setInterval(function() {

    var now = new Date().getTime();
    var timeleft = countDownDate - now;
        
    // Calculating the days, hours, minutes and seconds left
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        
    // Result is output to the specific element
   // document.getElementById("days").innerHTML = days + "d "
    document.getElementById("currentRush").innerHTML ="Prize Money Puzzle Rush will end in " + hours + "h " + minutes + "m "  + seconds + "s " 
     // Display the message when countdown is over
    if (timeleft < 0) {
        clearInterval(currrush);
        document.getElementById("currentRush").innerHTML  = "TIME UP!!";
    }
    }, 1000);
	
   }
   }