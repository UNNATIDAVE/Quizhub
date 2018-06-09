myApp.controller('adminCtrl',['$scope', '$rootScope','$location','$route','$routeParams','$window','$auth', 'Account', 'TestsApi', 
  function($scope, $rootScope, $location, $route,  $routeParams, $window, $auth,Account, TestsApi) {
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

    $scope.allUserTests=[];
    $scope.totalCorrect = 0;
    $scope.totalWrong = 0;
    $scope.timeTakenTotal = 0;
    $scope.timeTakenTotalX = 0;

    //get all tests start
    $scope.getAllTests = function() {
      TestsApi.getAllTests()
        .then(function(response) {
          //console.log(response.data);
          $scope.tests = response.data.data;
          console.log($scope.tests)

        })
        .catch(function(response) {
          console.log("error");
          alert("Error!!!!, For More Info, Check Your Browser's Console")
          console.log(response);
        });
    }; // all tests end
    $scope.getAllTests();

    //get All users start
    $scope.getAllUsers = function() {
      TestsApi.getAllUsers()
        .then(function(response) {
          console.log(response.data);
          $scope.users = response.data.data;
          console.log($scope.users)

        })
        .catch(function(response) {
          console.log("error");
          alert("Error!!!!, For More Info, Check Your Browser's Console")
          console.log(response);
        });
    };  //All users end
    $scope.getAllUsers();

    // check test attempted by user or not
    $scope.checkUser = function(userid){
      $scope.allUserTests = [];
      $scope.NoUserTests = "No Tests Attempted By User";
      $scope.tests.forEach(function(usertestid) {
      var testidX = usertestid._id;
      TestsApi.viewSingleTest(testidX)
        .then(function(response) {
          $scope.testX = response.data.data;
          $scope.testAttemptedByAll = $scope.testX.testAttemptedBy;
          //console.log($scope.testAttemptedByAll);
          $scope.testAttemptedByAll.forEach(function(id) {
            //console.log(userid);
            if (id  == userid ) {
              console.log("user test loaded");
               console.log(usertestid);
               $scope.NoUserTests = null;
                $scope.allUserTests.push(usertestid);
                console.log($scope.allUserTests);
            }
          });
        })
        .catch(function(response) {alert("error, check console!"); console.log(response); });
      })  
    }; // test attempted by user or not end

//get  single test answers start
$scope.getSingleTestResult = function(testIdForResult) {
  $scope.totalCorrect = 0;
  $scope.totalWrong = 0;
  $scope.timeTakenTotal = 0;
  $scope.timeTakenTotalX = 0;
  console.log(testIdForResult);
  TestsApi.getSingleTestAnswers(testIdForResult)
    .then(function(response) {
      console.log(response.data);
      $scope.answers = response.data;
      // to find result of all questions
      $scope.answers.forEach(trueOrFalse)
      function trueOrFalse(answer, index) {
      if (answer.correctAnswer == answer.userAnswer) {
        $scope.totalCorrect++;
        console.log("total correct---- "+$scope.totalCorrect);
      }else {
        $scope.totalWrong++;
        console.log("total wrong---- "+$scope.totalWrong);
      }
    };
    $scope.answers.forEach(timeTakenCalculate);
    function timeTakenCalculate(answer, index) {
      $scope.timeTakenTotalX =  $scope.timeTakenTotalX+answer.timeTakenEach;
      $scope.timeTakenTotal = Math.floor(  $scope.timeTakenTotalX / 60) + ":" + (  $scope.timeTakenTotalX % 60 ?   $scope.timeTakenTotalX % 60 : '00');
  };
    })
    .catch(function(response) {
      console.log("error");
      alert("Error!!!!, For More Info, Check Your Browser's Console")
      console.log(response);
    });
};  //view single test answers end
}]);
