//for all test queries
myApp.factory('TestsApi', function($http) {
    //to create test
    return {
      createTest: function(data) {
        return $http.post('/api/tests', data);
      },
      //to view single test
      viewSingleTest: function(testid) {
        return $http.get('/api/tests/'+testid, null);
      },
      //to delete test
      deleteSingleTest: function(testid) {
        return $http.delete('/api/tests/'+testid, null);
      },
      // for edit single test
      editSingleTest: function(testid, data) {
        return $http.put('/api/tests/'+testid, data);
      },
      // for get single question data
      getSingleQuestion: function(questionid) {
        return $http.put('/api/questions/'+questionid, null);
      },
      //for get answers of questions
      sendSolution: function(questionid, testid, data) {
        return $http.post('/api/tests/'+testid+'/questions/'+questionid+'/answer', data);
      },
      // for delete single question
      deleteSingleQuestion: function(questionid) {
        return $http.delete('/api/questions/'+questionid, null);
      },
      //for edit single que
      editSingleQuestion: function(questionid, data) {
        return $http.put('/api/questions/'+questionid, data);
      },
      //get que by test
      getSingleTestQuestions: function(testid) {
        return $http.get('/api/tests/'+testid+'/questions', null);
      },
      //for add new question
      addQuestion: function(data, testid) {
        return $http.post('/api/tests/'+testid+'/questions', data);
      },
      //for all test view
      viewAllTests: function(data) {
        return $http.get('/api/tests', data);
      },
      // for delete test
      deleteTest: function() {
        return $http.delete('api/testid/deletetest'); //not done yet
      },
      //get test result
      getSingleTestAnswers: function(testid) {
        return $http.get('api/tests/'+testid+'/answers', null);
      },
      //get all test data
      getAllTests: function() {
        return $http.get('api/tests/', null);
      },
      //get all user data
      getAllUsers: function() {
        return $http.get('api/users/', null);
      },
      //for test attempted by testid
      testAttemptedBySend: function(testid, data) {
        return $http.put('api/tests/'+testid+'/attemptedby', data);
      },
      //for forgot password
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      //for reset pasword
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  });
