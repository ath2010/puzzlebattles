var randtoken = require('rand-token').generator({
  chars: 'a-z'
});

class TournamentModel{
players=[];
msgs=[];
 constructor(tour) {
        this.id=randtoken.generate(16);
        this.title=tour.title;
        this.tourtime=new Date(tour.starthour);
        this.format=tour.format;
        this.description=tour.description;
        this.starthour=tour.starthour;
        this.endhour = tour.endhour;
        this.duration=tour.duration;
        this.theme=tour.theme;
        this.createduser=tour.user
        this.report="practicereport.php";
        this.type=tour.type;
        this.themes=tour.themes;
        this.toJson= function toJson(){
         return {"id":this.tourid,"starthour":this.starthour,"endhour":this.endhour,"players":this.players,"msgs":this.msgs,"duration":this.duration,"theme":this.theme,
                "report":this.report,"format":this.format,"description":this.description,"createduser":this.createduser,"themes":tour.themes};
       };

    } 
} 

module.exports = {
    TournamentModel
};

