angular
.module('starter')
.controller(
		'customerQrController', 
		customerQrController
		);

customerQrController.$inject = [
                                'BROADCAST_MESSAGES', 
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                'LOADING_MESSAGES', 
                                'PROMPT_MESSAGES', 
                                '$ionicPopup', 
                                '$localStorage', 
                                '$scope', 
                                '$state', 
                                '$stateParams', 
                                'orderreferenceOrderService', 
                                'popupService', 
                                'qrService'
                                ];

function customerQrController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		PROMPT_MESSAGES, 
		$ionicPopup, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		orderreferenceOrderService, 
		popupService, 
		qrService
		){
	const STATE_RESTAURANT_CUSTOMER_ORDER_MENU = 'restaurant.customer-order_menu';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.doScan = doScan;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_CUSTOMER_ORDER_MENU == stateName){
			var stateParams = {
					companyName: vm.companyName, 
					branchName: vm.branchName, 
					tableNumber: vm.tableNumber
					}
			
			if(!(null == vm.orderreferenceCode)){	stateParams.orderreferenceCode = vm.orderreferenceCode;
			}
			
			$state.go(
					STATE_RESTAURANT_CUSTOMER_ORDER_MENU, 
					stateParams, 
					{	reload: true	}
					);
			}
		}
	
	function doScan(){
		qrService.doScan()
		.then(doScanSuccessCallback)
		.catch(doScanFailedCallback);
		
		function doScanSuccessCallback(data){
			const DELIMETER = ';';
			var reservationDetails = {};
			var dataSplit = data.text.split(DELIMETER);
			
			reservationDetails.companyName = vm.companyName = dataSplit[0];
			reservationDetails.branchName = vm.branchName = dataSplit[1];
			reservationDetails.tableNumber = vm.tableNumber = dataSplit[2];
			reservationDetails = JSON.stringify(reservationDetails);
			
			localStorage.setItem(
					KEYS.ReservationDetails, 
					reservationDetails
					);
			vm.user[KEYS.Tables] = vm._branch.tables[vm.tableNumber];
			localStorage.setItem(
					KEYS.User, 
					JSON.stringify(vm.user)
					);
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			orderreferenceOrderService.setCompanyName(vm.companyName);
			orderreferenceOrderService.setBranchName(vm.branchName);
			orderreferenceOrderService.setTableNumber(vm.tableNumber);
			orderreferenceOrderService.fetchOrderreferencesOrders(8)
			.then(fetchOrderreferencesOrdersSuccessCallback)
			.catch(fetchOrderreferencesOrdersFailedCallback);
			
			function fetchOrderreferencesOrdersSuccessCallback(response){
				popupService.hideIonicLoading();
				
				var orderreferenceCode = undefined;
				angular.forEach(
						response, 
						function(
								v, 
								k
								){	orderreferenceCode = k;
								}
						);
				
				if(null == orderreferenceCode){	gotoState(STATE_RESTAURANT_CUSTOMER_ORDER_MENU);
				} else {
					var msg = PROMPT_MESSAGES.yesNoExistingOrderreference;
					
					popupService.dispIonicConfirm(msg)
					.then(promptCallback);
					
					function promptCallback(response){
						if(response){
							vm.orderreferenceCode = orderreferenceCode;
							
							gotoState(STATE_RESTAURANT_CUSTOMER_ORDER_MENU);
						} else{
						}
						}
					}
				}
			
			function fetchOrderreferencesOrdersFailedCallback(responseError){
				popupService.hideIonicLoading();
				
				popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
			}
		
		function doScanFailedCallback(e){
		}
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.Companies);
			}, 
			function(){
				vm.company = localStorage.getItem(KEYS.Companies);
				vm.company = JSON.parse(vm.company);
				}
			);
	
	$scope.$watch(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){
					vm._company = vm.company[vm.companyName];
					if(null == vm._company){	return;
					}
					
					if(!(null == vm._company.branches)){
						vm._branch = vm._company.branches[vm.branchName];
						if(null == vm._branch){	return;
						}
						}
					}
				}, 
				true
				);
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.ReservationDetails);
			}, 
			function(){
				vm.reservationDetails = localStorage.getItem(KEYS.ReservationDetails);
				vm.reservationDetails = JSON.parse(vm.reservationDetails);
				}
			);
	
	$scope.$watch(
			function(){	return vm.reservationDetails;
			}, 
			function(){
				if(null == vm.reservationDetails){
					vm.reservationDetails = {};
					return;
					}
				
				vm.companyName = vm.reservationDetails.companyName;
				vm.branchName = vm.reservationDetails.branchName;
				vm.tableNumber = vm.reservationDetails.tableNumber;
				}, 
				true
				);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesSuccess, 
			function(){	popupService.hideIonicLoading();
			}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesFailed, 
			function(){
				var DOM_POPUP_CLASS = '.popup';
				
				popupService.hideIonicLoading();
				if(0 == $(DOM_POPUP_CLASS).length){	popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
				}
			);
	}