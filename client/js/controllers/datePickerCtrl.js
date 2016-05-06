'use strict';

/* Controllers */

  // main controller
app.controller('datePickerCtrl', ['$scope', function ($scope) {

    var vm = this;

    vm.today = function() {
      vm.dt = new Date();
    };
    vm.today();

    vm.clear = function() {
      vm.dt = null;
    };

    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    vm.toggleMin = function() {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    vm.toggleMin();

    vm.open = function() {
      vm.popup.opened = true;
    };

    vm.setDate = function(year, month, day) {
      vm.dt = new Date(year, month, day);
    };

    vm.formats = ['MMMM d, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    vm.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i = 0; i < vm.events.length; i++) {
          var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return vm.events[i].status;
          }
        }
      }

      return '';
    }

}]);
