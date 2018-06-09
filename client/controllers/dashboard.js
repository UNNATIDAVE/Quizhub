// user Dashboard
myApp.controller('dashboardCtrl', [ '$scope', '$rootScope', '$location', '$route',  '$routeParams', '$window', '$auth','Account', 'TestsApi',
  function($scope, $rootScope, $location, $route,  $routeParams, $window, $auth,Account, TestsApi) {
    $scope.profile = $rootScope.currentUser;
    $scope.ifAttempted;
    $scope.notAttempted;

    //get all test data
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
    }; // all test data end
    $scope.getAllTests();

    //check for test attempted by user 
    $scope.checkUser = function(testid){
          $scope.ifAttempted = null;
          $scope.notAttempted = true;
      TestsApi.viewSingleTest(testid)
        .then(function(response) {
          $scope.testX = response.data.data;
          $scope.notAttempted = true;
          //console.log($scope.testX);
          $scope.testAttemptedByAll = $scope.testX.testAttemptedBy;
          //console.log($scope.testAttemptedByAll);
          $scope.testAttemptedByAll.forEach(function(id) {
            if (id  == $scope.profile._id ) {
                console.log("user found");
                $scope.ifAttempted = true;
                console.log($scope.ifAttempted);
                $scope.notAttempted = false;
                //console.log($scope.ifAttempted);
                alert('You Already Attempted This Test, You Can View Your Results');
                //window.location = "/live-test/scorecard/"+$scope.testid
            }
          });

        })
        .catch(function(response) {
          alert("error, check console!")
          console.log("error");
          console.log(response);
        });
    }; //test attempted by user end
}]);
