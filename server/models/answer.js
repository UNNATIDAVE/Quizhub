//Schema for users taken test details

var mongoose = require('mongoose')
var Schema  =  mongoose.Schema;

var answerSchema = new Schema({

        user:           { type: Schema.Types.ObjectId, ref: 'userModel' },
        test:           { type: Schema.Types.ObjectId,ref: 'testModel' },
        questions:      [{ type: Schema.Types.ObjectId,ref: 'questionModel' }],
        userAnswer:     { type: String },
        correctAnswer:  { type: String },
        timeTakenEach:  { type: Number,default: 1 }
});

var answerModel = module.exports = mongoose.model('answerModel', answerSchema);
