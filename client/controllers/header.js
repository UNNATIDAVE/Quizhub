// for navigation bar
myApp.controller('HeaderCtrl', [ '$scope', '$rootScope', '$location', '$window', '$auth', function($scope,$rootScope, $location, $window, $auth) {

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.isAdmin = function() {
      if ($rootScope.currentUser) {
      if ($rootScope.currentUser.email == "admin@quizhub.com") {
        return true;
      } else{
        return false;
      }
    } else{
      return false;
    }
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };
  }]);
