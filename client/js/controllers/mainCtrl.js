'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'DataRobot', 'moment', function ($scope, DataRobot, moment) {

    var vm = this;
    vm.selected = 1;
    vm.tickets = 1;
    vm.custom = false;
    vm.days = 1;

    DataRobot.getPrices().then(function (response) {
                //  console.log(response.data.prices);
                 vm.prices = response.data.prices;
                 vm.dayTable = response.data.dayTable;
                 vm.select(1,false);
             }, function (error) {
                 vm.status = 'Unable to load posts: ' + error.message;
             });

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    vm.customDate = tomorrow;

    vm.changeDate = function(){
      console.log(moment(vm.customDate).endOf('day').format());
      DataRobot.getDatePrice(moment(vm.customDate).endOf('day').format()).then(function (response) {
                  console.log(response.data.price);
                   vm.price = response.data.price;
               }, function (error) {
                   vm.status = 'Unable to load posts: ' + error.message;
               });
    }

    vm.dayName = function(days){
      if(days == 30){
        return "Monthly";
      }else if (days == 7){
        return "Weekly";
      }else if(days == 1){
        return "Today";
      }else if(days == 2){
        return "Tomorrow";
      }else{
        var today = moment().format();
        var duration = moment.duration({'days' : days-1});
        return moment(today).add(duration).format('dddd');
      }

    }

    vm.select = function(days, custom) {
      if(custom){
        vm.customDate = tomorrow;
        vm.changeDate();
        vm.selected = 0;
        vm.custom = true;
      }else{
        vm.selected = days;
        vm.days = days;
        vm.custom = false;
        vm.price = vm.dayTable[days];
      }
    }

    vm.increment = function(){
      vm.tickets++;
    }

    vm.decrement = function(){
      if(vm.tickets > 1){
        vm.tickets--;
      }

    }
}]);
