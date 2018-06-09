var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true }); // for $pushAll data
var express = require('express');
var testRouter = express.Router();
var ObjectId = mongoose.Types.ObjectId;
//Defining mdels
var userModel = require('./../models/users.js');
var testModel = require('./../models/test.js');
var questionModel = require('./../models/question.js');
var answerModel = require('./../models/answer.js');
var totalPerformance = require('./../models/performance.js');

//response generating error
var resGen= require('./../libs/resGen.js');

// all users get api start
testRouter.route('/users')
 .get((req, res) => {
   userModel.find(function(err, users) {
     //console.log(tests);
     if (err) {
       var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
       res.send(error);
     } else if (users === [] || users === undefined || users === null) {
       var error = resGen.generate(true, "No result found , empty array", 204, null);
       res.send(error);
     } else {
       var response = resGen.generate(false, "All tests fetched successfully", 200, users);
       res.send(response);
     }
   });
 });
 // all users get api end

// Api to create and get all tests 
testRouter.route('/tests')
  .post((req, res) => {
    var test = new testModel(req.body);
    test.save((err, test) => {
      if (err) {
        var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "Successfully Created A Test", 200, test);
        res.send(response);
      }
    });
  })

  .get((req, res) => {
    testModel.find(function(err, tests) {
      //console.log(tests);
      if (err) {
        var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (tests === [] || tests === undefined || tests === null) {
        var error = resGen.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "All tests fetched successfully", 200, tests);
        res.send(response);
      }
    });
  });
//get all test api end

//apis for single test
testRouter.route('/tests/:test_id')
  .get((req, res) => {
    testModel.findById(mongoose.Types.ObjectId( req.params.test_id ), (err, test) => {
      //console.log(req.params.test_id);
      console.log(req.user._id);
      if (err) {
        var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (test === null || test === undefined || test === []) {
        var error = resGen.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "Test fetched successfully", 200, test);
        res.send(response);
      }
    });
  })

  //api to update a test
  .put((req, res) => {
    testModel.findByIdAndUpdate(
      mongoose.Types.ObjectId( req.params.test_id )
      , req.body, {
      new: true
    }, function(err, test) {
      if (err) {
        var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "Successfully Updated The Test", 200, test);
        res.send(response);
      }
    });

  })

  //api to delete a test
  .delete((req, res) => {
    testModel.findByIdAndRemove(req.params.test_id, (err, test) => {
      if (err) {
        var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (test === null || test === undefined || test === []) {
        var error = resGen.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "Test deleted successfully", 200, test);
        res.send(response);
      }
    });
  });
//api to get single test end

//apis for questions
testRouter.route('/tests/:test_id/questions')
  //to create a new questions
  .post((req, res) => {
   var question = new questionModel(req.body);
    question.save((err, test) => {
      if (err) {
        var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      }
      })
    .then((question, err) => {
      testModel.findById({_id: req.params.test_id}, (err, test) => {
            test.questions.push(question);
            test.save((err, test) => {
              if (err) {
                var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
                console.log(err);
                res.send(error);
              } else if (question === null || question === undefined || question === []) {
                var error = resGen.generate(true, "No result found , empty array", 204, null);
                res.send(error);
              } else {
                var response = resGen.generate(false, "Question Created successfully", 200, question);
                res.send(response);
              }
            });
        });
      });
    })

  //to get all questions
  .get((req, res) => {
    //console.log("populate question");
      testModel.findById(req.params.test_id)
      .populate('questions')
      .then((test, err) =>{
        if (err) {
          var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
          res.send(error);
          return next(err)
        } else if (test === null || test === undefined || test === []) {
          var error = resGen.generate(true, "No Questions found , empty array", 204, null);
          res.send(error);
        } else {
          var response = resGen.generate(false, "All Questions fetched successfully", 200, test.questions);
          res.send(response);
        }
      });
  });////to get all questions

// for questions
testRouter.route('/questions/:question_id')
//api to single questions
.get((req, res) => {
  questionModel.findById(req.params.question_id, (err, question) => {
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (question === null || question === undefined || question === []) {
      var error = resGen.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "Question fetched successfully", 200, question);
      res.send(response);
    }
  });
})
  //api to update a questions
  .put((req, res) => {
    questionModel.findOneAndUpdate({
      _id: req.params.question_id
    }, req.body, {
      new: true
    }, function(err, question) {
      if (err) {
        var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGen.generate(false, "Successfully Updated The Test", 200, question);
        res.send(response);
      }
    });
  })

//api to delete a question
.delete((req, res) => {
  questionModel.findByIdAndRemove(req.params.question_id, (err, question) => {
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (question === null || question === undefined || question === []) {
      var error = resGen.generate(true, "Question Doesn't Exist or Deleted", 204, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "Question deleted successfully", 200, question);
      res.send(response);
    }
  });
});
//question api end

//api to add scores to mongodb
testRouter.route('/tests/:test_id/questions/:question_id/answer')
//api to add test result in db with all details
.post((req, res) => {
  var answerResult;
  var timeTakenEach;
  questionModel.findById(req.params.question_id,function(err, question) {
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    }  else {
      //console.log(question);
      console.log(req.body);
      var answer = new answerModel(req.body);
      answer.user = req.user._id;
      answer.question =  req.params.question_id;
      answer.test = req.params.test_id;
      console.log("user--"+answer.userAnswer);
      console.log("admin--"+answer.correctAnswer);
    }
    answer.save((err, answer) => {
            if (err) {
              var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
              res.send(error);
            } else {
              var response = resGen.generate(false, "Successfully Created A Test", 200, answer);
              res.send(response);
            }
          });
  });
});
//api to store result end

//Api for test answer
testRouter.route('/tests/:test_id/answers')
//api to get  answers test specific
.get((req, res) => {
  answerModel.find(
    { "$and" : [ { "user" : req.user._id }, { "test" : req.params.test_id } ] })
    .populate('question')
    .then((answers, err) => {
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      console.log(err);
      res.send(error);
    }  else {
      var response = resGen.generate(false, "All Answers fetched successfully", 200, answers);
      res.send(answers);
    }
  });
});// end api


testRouter.route('/tests/:user_id/answers')
//api to get  answers user specific
.get((req, res) => {
  answerModel.find(req.params.user_id,function(err, answers) {
    //console.log(tests);
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      cosnole.log(err);
      res.send(error);
    } else if (answers === [] || answers === undefined || answers === null) {
      var error = resGen.generate(true, "No result found , empty array", 204, null);
      console.log(error);
      res.send(error);
    } else {
      var response = resGen.generate(false, "All Answers fetched successfully", 200, answers);
      res.send(response);
    }
  });
});
//api of  answers end

//api for performance
testRouter.route('/performance')
//api to add test result in db with all details
.post((req, res) => {
  var scorePerformance = new performModel(req.body);
  scorePerformance.user = req.user_id;
  scorePerformance.test = req.test_id;
  scorePerformance.save((err, scorePerformance) => {
    if (err) {
      var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "Successfully Stored totalPerformance", 200, scorePerformance);
      res.send(response);
    }
  });
});// End API

//api to get  performance test specific
testRouter.route('/performance/:test_id')

.get((req, res) => {
  performModel.find(req.params.test_id, function(err, performModel) {
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (performModel === [] || performModel === undefined || performModel === null) {
      var error = resGen.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "All totalPerformance fetched successfully per test", 200, performModel);
      res.send(response);
    }
  });
}); //End API

//api to get  performance user specific
testRouter.route('/performance/:user_id/')
.get((req, res) => {
  performModel.find(req.params.user_id,function(err, performModel) {
    //console.log(tests);
    if (err) {
      var error = resGen.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (performModel === [] || performModel === undefined || performModel === null) {
      var error = resGen.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "All totalPerformance fetched successfully per user", 200, performModel);
      res.send(response);
    }
  });
});//End api

// api to store test attemptedby users start
testRouter.route('/tests/:testid/attemptedby')
.put((req, res) => {
  console.log(req.body.testAttemptedBy);
  testModel.findByIdAndUpdate(
    mongoose.Types.ObjectId( req.params.testid )
    , { $push: { testAttemptedBy : ObjectId(req.body.testAttemptedBy) } }
    , function(err, test) {
    if (err) {
      var error = resGen.generate(true, "Some Error Ocurred, error : " + err, 500, null);
      res.send(error);
    } else {
      var response = resGen.generate(false, "Successfully Updated The Test", 200, test);
      res.send(response);
    }
  });
  // api to store test attemptedby users end
});

//export testRouter
module.exports = testRouter;
