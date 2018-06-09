//Schema for questions

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
			question: { type: String},
            optionA: { type: String },
            optionB: { type: String},
            optionC: { type: String },
            optionD: { type: String},
            answer  :{type:String}
});

var questionModel = module.exports = mongoose.model('questionModel', questionSchema);
