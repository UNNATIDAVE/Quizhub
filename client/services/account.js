//for user 
myApp.factory('Account', function($http) {
    return {
      //for profile update
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      //for hange password
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      //for delete account
      deleteAccount: function() {
        return $http.delete('/account');
      },
      //for forgot password
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      // for reset password
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  });