(function(){
	'use strict';
	angular
		.module('scheduleSys')
		.controller('PrivateCareSchedulingController', PrivateCareSchedulingController);
	
	PrivateCareSchedulingController.$Inject = ['$state','$scope', '$stateParams', '$mdDialog', '$mdToast',
	                                        'PrivateCareScheduleService','PrivateCareSchedulingService', 'PrivateCareService',
	                                        'CareGiverScheduleService', 'EmployeesService', 'Commons'];
	
	function PrivateCareSchedulingController($state, $scope, $stateParams, $mdDialog, $mdToast,
			PrivateCareScheduleService, PrivateCareSchedulingService, PrivateCareService,
			CareGiverScheduleService, EmployeesService, Commons){
		var vm = this;
		
		vm.editOrDelete = true;
		vm.selected = [];
		vm.allSchedules = [];
		vm.schedulesOnCurrentPage = [];
		vm.getCurrentPrivateCare = getCurrentPrivateCare;
		vm.getCurrentEmployee = getCurrentEmployee;
		vm.getAllSchedulesForCurrentPrivateCare = getAllSchedulesForCurrentPrivateCare;
		vm.getAllSchedulesForCurrentCareGiver = getAllSchedulesForCurrentCareGiver;
		vm.showConfirm = showConfirm;
		vm.showToast = showToast;
		vm.onPaginate = onPaginate;
		vm.sliceArray = sliceArray;
		vm.onLeftArrowClick = onLeftArrowClick;
		vm.onRightArrowClick = onRightArrowClick;
		vm.initScheduleWeek = initScheduleWeek;
		vm.formatDate = formatDate;
		vm.schedulingType = $state.$current.data.schedulingType;
		
		vm.query = {
				limit: 10,
				page: 1
		};
		
		vm.scheduleWeek = {
				startDate: null,
				endDate: null
		}
		
		initScheduleWeek();
		
		if(vm.schedulingType === 'privateCare'){
			getCurrentPrivateCare();
			getAllSchedulesForCurrentPrivateCare();
		}else{
			console.log('Showing care givers scheduling');
			getCurrentEmployee();
			getAllSchedulesForCurrentCareGiver();
		}
		
		$scope.$watchCollection('vm.selected', function(oldValue, newValue) {
			vm.editOrDelete = (vm.selected.length === 0) ? true : false;
		});
		
		function getAllSchedulesForCurrentPrivateCare(){
			PrivateCareSchedulingService.query({id:$stateParams.id, startDate:vm.scheduleWeek.startDate,
					endDate:vm.scheduleWeek.endDate
				}, function(result) {
					vm.allSchedules = result;
					vm.schedulesOnCurrentPage = vm.sliceArray();
			}, function() {
				vm.allSchedules = [];
				vm.schedulesOnCurrentPage = [];
			});
		}
		
		function getCurrentPrivateCare(){
			PrivateCareService.get({id:$stateParams.id}, function(result) {
				vm.privateCare = result;
			});
		}
		
		function getAllSchedulesForCurrentCareGiver(){
			CareGiverScheduleService.query({id:$stateParams.id,startDate:vm.scheduleWeek.startDate,
					endDate:vm.scheduleWeek.endDate 
					}, function(result) {
						vm.allSchedules = result;
						vm.schedulesOnCurrentPage = vm.sliceArray();
			}, function() {
				vm.allSchedules = [];
				vm.schedulesOnCurrentPage = [];
			})
		}
		
		function getCurrentEmployee(){
			EmployeesService.get({id:$stateParams.id}, function(result) {
				vm.employee = result;
			});
		}
		
		function showConfirm(ev) {
			var confirm = $mdDialog.confirm()
					.title('Delete a schedule')
					.textContent('Are you sure you want to delete this schedule ?')
					.ariaLabel('Schedule deletion')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				PrivateCareScheduleService.remove({id:vm.selected[0].id},onDeleteSuccess,onDeleteFailure);
			}, function() {
				console.log('Keep this one ...');
			});
		};
		
		function onDeleteSuccess (){
			vm.schedulesOnCurrentPage.splice(vm.schedulesOnCurrentPage.indexOf(vm.selected[0]), 1);
			vm.allSchedules.splice(vm.allSchedules.indexOf(vm.selected[0]), 1);
			vm.editOrDelete = true;
			vm.showToast('Schedule successfully deleted', 5000);
		}	
		
		function onDeleteFailure (){
			vm.showToast('Something unexpected happened while deleting the schedule', 5000);
		}
		
		function showToast(textContent, delay){
			$mdToast.show($mdToast.simple()
					.textContent(textContent)
					.position('top right')
					.hideDelay(delay));
		}
		
		function onPaginate(){
			vm.schedulesOnCurrentPage = vm.sliceArray();
		}
		
		function sliceArray(){
			var slicedArray = vm.allSchedules.slice(
					10 * (vm.query.page - 1),
					(vm.query.limit * vm.query.page));
			return slicedArray;
		}
		
		function onLeftArrowClick(){
			vm.scheduleWeek.startDate =  vm.formatDate(
					moment(vm.scheduleWeek.startDate, 'YYYY/MM/DD').subtract(7, 'day'));
			vm.scheduleWeek.endDate = vm.formatDate(
					moment(vm.scheduleWeek.endDate, 'YYYY/MM/DD').subtract(7, 'day'));
			vm.schedulingType === 'privateCare' ? vm.getAllSchedulesForCurrentPrivateCare() : vm.getAllSchedulesForCurrentCareGiver();
		}
		
		function onRightArrowClick(){
			vm.scheduleWeek.startDate =  vm.formatDate(
					moment(vm.scheduleWeek.startDate, 'YYYY/MM/DD').add(7, 'day'));
			vm.scheduleWeek.endDate = vm.formatDate(
					moment(vm.scheduleWeek.endDate, 'YYYY/MM/DD').add(7, 'day'));
			vm.schedulingType === 'privateCare' ? vm.getAllSchedulesForCurrentPrivateCare() : vm.getAllSchedulesForCurrentCareGiver();
		}
		
		function initScheduleWeek(){
			vm.scheduleWeek.startDate = vm.formatDate(
					moment(Commons.getCurrentWeekStartDate()));
			vm.scheduleWeek.endDate =  vm.formatDate(
					moment(Commons.getCurrentWeekEndDate())); 
		}
		
		function formatDate(date){
			return moment(date).format('YYYY/MM/DD');
		}
	}
	
})();