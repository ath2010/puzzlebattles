const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
  "id": {
    "type": "String"
  },
    "title": {
    "type": "String"
  },
      "createduser": {
    "type": "String"
  },
    "description": {
    "type": "String"
  },
  "msgs": {
    "type": "Array"
  },
  "players": {
    "type": "Array"
  },  
  "tourtime": {
    "type": "Date"
  }
  ,
   "report": {
    "type": "String"
  },
    "format": {
    "type": "String"
  },
     "duration": {
    "type": "Number"
  },                                  
  "theme": {
    "type": "String"
  },   
   "themes": {
    "type": "Object"
  }, 
   "starthour": {
    "type": "Number"
  }, 
   "endhour": {
    "type": "Number"
  }
});

const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;
