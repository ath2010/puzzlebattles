const mongoose = require("mongoose");

const PuzzleHistorySchema = new mongoose.Schema({
  "username": {
    "type": "String"
  },
  "url":{"type": "String"},
  "tourtime": {
   "type": "String"
  },
  "title":{"type": "String"},
  "tourtime": {
   "type": "Number"
  },
    "theme": {
   "type": "String"
  },
  "solvedpuzzles": {
    "type": "Array"
  },
  "failedpuzzles": {
    "type": "Array"
  }
});

const PuzzleHistory = mongoose.model("PuzzleHistory", PuzzleHistorySchema);
module.exports = PuzzleHistory;
