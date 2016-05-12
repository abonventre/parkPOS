'use strict';

app.run(
  ['$rootScope', '$state', '$stateParams', '$location', 'AuthRobot', 'toastr', function ($rootScope,   $state,   $stateParams, $location, AuthRobot, toastr) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
        var stateName = toState.name;

        // now, redirect only not authenticated
        var activeShift = AuthRobot.isActiveShift();

        if(stateName != "app.startShift" && !activeShift) {
          toastr.warning('A shift must be started before attempting that action!', 'Warning');
          e.preventDefault(); // stop current execution
          $state.go('app.startShift');
        }else if(stateName == "app.startShift" && activeShift){
          toastr.warning('A shift is currently active, cannot start a new shift until the current one is closed out!', 'Warning');
          e.preventDefault(); // stop current execution
          $state.go('app.printTickets');
        }else{
          console.log(activeShift);
          return;
        }
    });
  }]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
