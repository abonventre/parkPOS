'use strict';

app.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "tpl/home.html"
    })
    .state('startShift', {
      url: "/startShift",
      templateUrl: "tpl/startShift.html"
    })
    .state('endShift', {
      url: "/endShift",
      templateUrl: "tpl/endShift.html"
    })
    .state('printTickets', {
      url: "/printTickets",
      templateUrl: "tpl/printTickets.html"
    });
}]);
