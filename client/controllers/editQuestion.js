// for Edit /update question
myApp.controller('editSingleTestCtrl', ['$scope', '$rootScope', '$location', '$route', '$routeParams', '$window', '$auth', 'Account', 'TestsApi',
  function($scope, $rootScope, $location, $route, $routeParams, $window, $auth, Account, TestsApi) {
    $scope.profile = $rootScope.currentUser;
    // checking if user is admin
    (() => {
  if ($scope.profile.email == "admin@quizhub.com" ) {
    console.log("admin logged in");
  }else {
    alert("You're Not Authorized To View This Page")
    $location.path( "/dashboard" );
  }
})();
    
    // for single question data
    $scope.getSingleQuestion = function() {
      $scope.questionid = $routeParams.questionid;
      console.log($scope.questionid);
      TestsApi.getSingleQuestion($scope.questionid)
        .then(function(response) {
          //console.log(response.data);
          $scope.question = response.data.data;
        })
        .catch(function(response) {
          console.log("error");
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
      } // end single question data
      $scope.getSingleQuestion();

//update question 
$scope.updateQuestion = function() {
  if ($scope.profile.email == "admin@quizhub.com") {
  console.log($scope.questionid +", to update test");
  TestsApi.editSingleQuestion($scope.questionid, $scope.question)
    .then(function(response) {
      console.log(response.data);
      // console.log("reached create test"+ response.data.message);
      $scope.messages = {
        success: [response.data]
      };
      if (response.data.error === false) {
        alert("Question Updated Successfully");
        $window.history.go(-1);
      }
    })
    .catch(function(response) {
      $scope.messages = {
        error: Array.isArray(response.data) ? response.data : [response.data]
      };
    });
  } else {
    alert("You're Not Authorized To View This Page")
    $location.path( "/dashboard" );
  }
}; //update question end

//question delete
$scope.deleteSingleQuestion = function() {
  if ($scope.profile.email == "admin@quizhub.com") {
  $scope.questionid = $routeParams.questionid;
  console.log($scope.questionid);
  TestsApi.deleteSingleQuestion($scope.questionid)
    .then(function(response) {
      console.log(response.data);
      $window.history.go(-1);
      alert("Question Deleted Successfully")
    })
    .catch(function(response) {
      console.log("error");
      $scope.messages = {
        error: Array.isArray(response.data) ? response.data : [response.data]
      };
    });
  } else {
    alert("You're Not Authorized To View This Page")
    $location.path( "/dashboard" );
  }
}; //delete single question end
}]);
