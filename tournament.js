const tourModel = require("./model");
class Player{
  constructor(user) {
    var userobj= JSON.parse(user);
    var prefs=userobj.perfs
    this.username=userobj.id
    if(userobj.id){
	  this.username=userobj.id   
    } else{
	  this.username=userobj.username;
    }
    if(prefs){
     if(prefs.puzzle)
    this.rating=prefs.puzzle.rating
    } else{
      this.rating=1800;
    }
	   console.log(userobj.score);
    if(userobj.score){
    this.score=userobj.score;
     console.log(this.score);
    } else{
	 this.score=[];    
    }
    this.attempted=false;
    this.joined=false;
    this.total=0;
    if(this.score && this.score.length>=1 && this.attempted){
	  for (let i = 0; i < this.score.length ; i++) {    
	  this.total +=this.score[i];
	  
	  }	  
     } else{
	    for (let i = 0; i < this.score.length ; i++) {    
            if(this.total<this.score[i])
	   this.total =this.score[i];
	  
	  }   
     }
    this.toJson=function(){return {"username":this.username,"rating":this.rating,"score":this.score,"attempted":this.attempted,"joined":this.joined,"total":this.total};}
   }
   setScore(score){
 	   
   this.score.push(score);
	  this.total=0;   
     if(this.score && this.score.length>=1 && this.attempted){
	  for (let i = 0; i < this.score.length ; i++) {    
	  this.total +=this.score[i];
	  
	  }	  
     }  else{
	    for (let i = 0; i < this.score.length ; i++) {    
            if(this.total<this.score[i])
	   this.total =this.score[i];
	    }
	  } 	   
  }

  setAttempted(attempted){
    this.attempted=attempted;
  }

  setJoined(joined){
    this.joined=joined;
  }
}
class Tournament{
players=[];
msgs=[];
 constructor(tour) {
        this.tourid=tour.id;
	this.title=tour.title;
        this.gameid=tour._id;
        this.duration=tour.duration;
        this.sortBy="rating";
        this.theme=tour.theme;
        this.report=tour.report;
        this.players=tour.players===undefined?[]:tour.players.flat();
        this.msgs=tour.msgs===undefined?[]:tour.msgs.flat();
	this.themes=tour.themes;
	this.format=tour.format;
	this.description=tour.description;
	this.starthour=tour.starthour;
	this.endhour=tour.endhour;
	this.createduser=tour.user;
        this.addPlayer= async function addPlayer(player){
          this.players.push(player);
          try {
           const result = await tourModel.updateOne({ id: this.tourid }, { $push: { players:player } });
           console.log(result);
         } finally {
           console.log("updated");
           console.log(this.players);
         }
          };

          this.updPlayer= async function updPlayer(player){
              try {const result = await tourModel.updateOne({ id: this.tourid },
                 { $set: { "players.$[element]" : player } },
                { multi: false,
                  arrayFilters: [ { "element.username": player.username } ]
                });
             
               console.log(result);
             } finally {
               console.log(this.tourid);
             }
           };

        this.remPlayer= async function remPlayer(player){
            try {
              console.log(player)
             const result = await tourModel.update({ id: this.tourid },   { $pull: {players: { username:  player.username } }});
             console.log(result);
           } finally {
             console.log(this.tourid);
           }
       };
       
        this.addMsg= async function  addMsg(msg){
        this.msgs.push(msg)
        try {
         const result = await tourModel.updateMany({ id: this.tourid }, { $push: { msgs:msg } });
         console.log(result);
       } finally {
         console.log(this.tourid);
       } 
       };

       this.toJson= function toJson(){
         return {"tourid":this.tourid,"tourtime":this.tourtime,"players":this.players,"msgs":this.msgs,"isJoined":this.joined,"sortBy":this.sortBy,"starthour":this.starthour,"endhour":this.endhour,"duration":this.duration,"theme":this.theme,
                "report":this.report,"themes":this.themes,"format":this.format, "description":this.description,"title":this.title,"createduser":this.createduser};
       };

       this.start=function getTourStartTime() {
        return this.starthour;
       };

       this.end= function getTourEndTime() {
        return this.endhour;
       };

       this.isStarted= function isTourStarted(){
        var now = new Date();
      return (this.start()-now.getTime())<0;	
      };
      this.isEnded=function isTourEnded(){
      var now = new Date();
     return (this.end()-now.getTime())<0;	
     };

    } 

   isJoined(joined){
     this.joined=joined;
   }

   setsortBy(sortBy){
    this.sortBy=sortBy;
  }


} 

module.exports = {
    Tournament,Player
};
