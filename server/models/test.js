//Schema for Test Details

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var testSchema = new Schema({
      
      testName:           { type: String, required: true },
      testCategory:       { type: String, required: true },
      totalScore:         { type: Number,required: true },
      totalQuestions:     { type: Number, },
      testDetails:        { type: String },
      testAttemptedBy:    [{ type: Schema.Types.ObjectId,ref: 'userModel' }],
      testDuration:       { type: Number },//In minutes
      questions:          [{ type: Schema.Types.ObjectId,ref: 'questionModel' }],

});

var testModel = module.exports = mongoose.model('testModel', testSchema);
