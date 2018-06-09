myApp.config(['$routeProvider','$locationProvider', '$authProvider', function($routeProvider, $locationProvider, $authProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      // for home page
      .when('/', {
        templateUrl: './views/index-view.html'
      }) 
      // for Contactus Form
      .when('/contact', {
        templateUrl: './views/contact.html',
        controller: 'ContactCtrl'
      })
      //for Login page
      .when('/login', {
        templateUrl: './views/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })

      //for Signup page
      .when('/signup', {
        templateUrl: './views/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })

      //for user account page
      .when('/account', {
        templateUrl: './views/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      // for forgot password page
      .when('/forgot', {
        templateUrl: './views/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })

      // for reset password page
      .when('/reset/:token', {
        templateUrl: './views/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })

      // for create test page
      .when('/createtest', {
        templateUrl: './views/createTest.html',
        controller: 'createTestCtrl',
        resolve: { loginRequired: loginRequired }
      })

      //for single test view
      .when('/viewtest/:testid', {
        templateUrl: './views/viewTest.html',
        controller: 'viewSingleTestCtrl',
        resolve: { loginRequired: loginRequired }
      })

      // for edit single question
      .when('/editquestion/:questionid', {
        templateUrl: './views/editquestion.html',
        controller: 'editSingleTestCtrl',
        resolve: { loginRequired: loginRequired }
      })
      // for user side test view 
      .when('/live-test/:testid', {
        templateUrl: './views/livetest.html',
        controller: 'liveTestCtrl',
        resolve: { loginRequired: loginRequired }
      })

      // for result of single test
      .when('/live-test/scorecard/:testid', {
        templateUrl: './views/scorecard.html',
        controller: 'testResultCtrl',
        resolve: { loginRequired: loginRequired }
      })

      //for user dashboard
      .when('/dashboard', {
        templateUrl: './views/dashboard.html',
        controller: 'dashboardCtrl',
        resolve: { loginRequired: loginRequired }
      })

      //for admin dashboard
      .when('/admin-view', {
        templateUrl: './views/admin-view.html',
        controller: 'adminCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .otherwise({
        templateUrl: './views/404.html'
      });

    //for facebook and google login
    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: '/auth/facebook',
      clientID: '1938757949479449',
      callbackURL:'http://localhost:3000/auth/facebook/callback',
    });
    $authProvider.google({
      url: '/auth/google',
      clientID:'414901316698-60ki8h1fi6992u2itttm650v92ip4kcm.apps.googleusercontent.com',
      callbackURL: 'http://localhost:3000/auth/google/callback'
    });


    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
