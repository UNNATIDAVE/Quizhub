//Schema for user Performance

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var performanceSchema = new Schema({
        
        user:                 { type: Schema.Types.ObjectId, ref: 'userModel'  },
        testsAttempted:       [{ type: Schema.Types.ObjectId, ref: 'testModel' }],
        score:                { type: Number, default: 0 },
        timeTaken:            { type: Number, default: 0 },
        totalCorrectAnswers:  { type: Number, default: 0 },
        totalWrongAnswers:    { type: Number, default: 0 }
});

var performModel = module.exports = mongoose.model('performModel', performanceSchema);
