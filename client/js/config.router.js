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
  $urlRouterProvider.otherwise("/app");
  //
  // Now set up the states
  $stateProvider
    .state('app', {
      url: "/app",
      templateUrl: "tpl/home.html",
      controller: "mainCtrl",
      controllerAs: "main"
    })
      .state('app.startShift', {
        url: "/startShift",
        templateUrl: "tpl/startShift.html",
        controller: "shiftCtrl",
        controllerAs: "shift",
        data: {
          task: 'start'
        }
      })
      .state('app.endShift', {
        url: "/endShift",
        templateUrl: "tpl/endShift.html",
        controller: "shiftCtrl",
        controllerAs: "shift",
        data: {
          task: 'end'
        }
      })
      .state('app.printTickets', {
        url: "/printTickets",
        templateUrl: "tpl/printTickets.html",
        controller: "ticketCtrl",
        controllerAs: "ticket"
      })
    .state('admin', {
      url: "/admin",
      templateUrl: "tpl/printTickets.html",
      controller: "ticketCtrl",
      controllerAs: "ticket"
    });
}]);
