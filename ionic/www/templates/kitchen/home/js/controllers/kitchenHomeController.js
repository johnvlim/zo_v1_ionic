angular
.module('starter')
.controller(
		'kitchenHomeController', 
		kitchenHomeController
		);

kitchenHomeController.$inject = [
                             'BROADCAST_MESSAGES', 
                             'ERROR_MESSAGES', 
                             'KEYS', 
                             'LOADING_MESSAGES', 
                             'ORDER_STATUS', 
                             '$ionicHistory', 
                             '$ionicSlideBoxDelegate', 
                             '$rootScope', 
                             '$scope', 
                             '$stateParams', 
                             '$timeout', 
                             'orderreferenceService', 
                             'orderreferenceOrderService', 
                             'orderService', 
                             'popupService', 
                             'reservationOrderreferenceOrderService'
                             ];

function kitchenHomeController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$rootScope, 
		$scope, 
		$stateParams, 
		$timeout, 
		orderreferenceService, 
		orderreferenceOrderService, 
		orderService, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	const DOM_ORDER_SLIDEBOX_HANDLE = 'order-slidebox';
	const SWIPE_DIRECTION_LEFT = 'left';
	const SWIPE_DIRECTION_RIGHT = 'right';
	
	var vm = this;
	vm.orderStatus = ORDER_STATUS.queue;
	
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
	vm.doSwipe = doSwipe;
	//controller_method
	vm.changeOrderStatus = changeOrderStatus;
	//controller_method
	vm.doFetchReservationsOrderreferencesOrders = doFetchReservationsOrderreferencesOrders;
	
	function doSwipe(
			orderreference, 
			order, 
			direction
			){
		if(
				ORDER_STATUS.queue == order.order_status &&
				SWIPE_DIRECTION_LEFT == direction
				){	return;
				}
		if(
				ORDER_STATUS.to_serve == order.order_status &&
				SWIPE_DIRECTION_RIGHT == direction
				){	return;
				}
		
		var orderStatus = null;
		var _orderreference = orderreference.orderreference[Object.keys(orderreference.orderreference)[0]];
		
		orderService.setCompanyName(vm.companyName);
		orderService.setBranchName(vm.branchName);
		orderService.setTableNumber(getTableNumberFromId(_orderreference.table_id));
		orderService.setOrderreferenceCode(_orderreference.orderreference_code);
		orderService.setOrderId(order.order_id);
		
		if(direction == SWIPE_DIRECTION_LEFT){
			switch(order.order_status){
			case ORDER_STATUS.cooking:
				orderStatus = ORDER_STATUS.queue;
				break;
			case ORDER_STATUS.to_serve:
				orderStatus = ORDER_STATUS.cooking;
				break;
			default:
				break;
			}
			} else if(direction == SWIPE_DIRECTION_RIGHT){
				switch(order.order_status){
				case ORDER_STATUS.cooking:
					orderStatus = ORDER_STATUS.to_serve;
					break;
				case ORDER_STATUS.queue:
					orderStatus = ORDER_STATUS.cooking;
					break;
					default:
						break;
					}
				}
		
		var _order = {
				order_status: orderStatus, 
				order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				order_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				}
		
		orderService.updateOrder([_order])
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.updatingOrder);
		
		function updateOrderSuccessCallback(response){
			popupService.hideIonicLoading();
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			doFetchReservationsOrderreferencesOrders();
			}
		
		function updateOrderFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
			}
		}
	
	function changeOrderStatus(direction){
		switch(vm.orderStatus){
		case ORDER_STATUS.queue:
			if(SWIPE_DIRECTION_LEFT == direction){	vm.orderStatus = ORDER_STATUS.queue;
			} else if(SWIPE_DIRECTION_RIGHT == direction){	vm.orderStatus = ORDER_STATUS.cooking;
			}
			break;
		case ORDER_STATUS.cooking:
			if(SWIPE_DIRECTION_LEFT == direction){	vm.orderStatus = ORDER_STATUS.queue;
			} else if(SWIPE_DIRECTION_RIGHT == direction){	vm.orderStatus = ORDER_STATUS.to_serve;
			}
			break;
		case ORDER_STATUS.to_serve:
			if(SWIPE_DIRECTION_LEFT == direction){	vm.orderStatus = ORDER_STATUS.cooking;
			} else if(SWIPE_DIRECTION_RIGHT == direction){	vm.orderStatus = ORDER_STATUS.to_serve;
			}
			break;
			default:
				break;
			}
		
		$timeout(
				function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_ORDER_SLIDEBOX_HANDLE).update();
				}
				);
		}
	
	function doFetchReservationsOrderreferencesOrders(){
		reservationOrderreferenceOrderService.setCompanyName(vm.companyName);
		reservationOrderreferenceOrderService.setBranchName(vm.branchName);
		reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(4)
		.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
		.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
		}
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		vm.companyBranchReservation = {};
		
		angular.forEach(
				response, 
				function(
						v, 
						k
						){
					vm.companyBranchReservation[k] = {};
					vm.companyBranchReservation[k].reservation = {};
					vm.companyBranchReservation[k].reservation[v.reservations.reservation_code] = v.reservations;
					vm.companyBranchReservation[k].orderreference = {};
					vm.companyBranchReservation[k].orderreference[v.orderreferences.orderreference_code] = v.orderreferences;
					vm.companyBranchReservation[k].order = {};
					vm.companyBranchReservation[k].order= v.orders;
					vm.companyBranchReservation[k].table = {};
					vm.companyBranchReservation[k].table[v.tables.table_number] = v.tables;
					}
				);
		
		orderreferenceOrderService.setCompanyName(vm.companyName);
		orderreferenceOrderService.setBranchName(vm.branchName);
		orderreferenceOrderService.fetchOrderreferencesOrders(4)
		.then(fetchOrderreferencesOrdersSuccessCallback)
		.catch(fetchOrderreferencesOrdersFailedCallback);
		
		function fetchOrderreferencesOrdersSuccessCallback(response){
			vm.companyBranchOrderreference = {};
			
			angular.forEach(
					response, 
					function(
							v, 
							k
							){
						vm.companyBranchOrderreference[k] = {};
						vm.companyBranchOrderreference[k].orderreference = {};
						vm.companyBranchOrderreference[k].orderreference[v.orderreferences.orderreference_code] = v.orderreferences;
						vm.companyBranchOrderreference[k].order = {};
						vm.companyBranchOrderreference[k].order = v.orders;
						vm.companyBranchOrderreference[k].table = {};
						vm.companyBranchOrderreference[k].table[v.tables.table_number] = v.tables;
						}
					);
			
			angular.forEach(
					vm.companyBranchOrderreference, 
					function(
							v, 
							k
							){
						angular.forEach(
								vm.companyBranchReservation, 
								function(
										j, 
										i
										){
									if(!(null == j.orderreference[k])){	delete vm.companyBranchOrderreference[k];
									}
									}
								);
						}
					);
			
			popupService.hideIonicLoading();
			$rootScope.$broadcast(BROADCAST_MESSAGES.closeIonRefresher);
			}
		
		function fetchOrderreferencesOrdersFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
			$rootScope.$broadcast(BROADCAST_MESSAGES.closeIonRefresher);
			}
		}
	
	function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
		popupService.hideIonicLoading();
		
		popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
		$rootScope.$broadcast(BROADCAST_MESSAGES.closeIonRefresher);
		}
	
	function getTableNumberFromId(tableId){
		var tableNumber = undefined;
		
		angular.forEach(
				vm._branch.tables, 
				function(
						v, 
						k
						){
					if(v.table_id == tableId){	tableNumber = k;
					}
					}
				);
		
		return tableNumber;
		}
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.companyMenu, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitem[v.menuitem_id] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitem;
		}
	
	function sortByTimestamp(
			orderreferenceReservation, 
			isOrderreference
			){
		if(isOrderreference){
			vm._companyBranchOrderreference = [];
			
			angular.forEach(
					vm.companyBranchOrderreference, 
					function(
							v, 
							k
							){
						var orderreference = v.orderreference[Object.keys(v.orderreference)[0]];
						
						if(0 == vm._companyBranchOrderreference.length){	vm._companyBranchOrderreference.push(v);
						} else {
							for(var i=0; i<vm._companyBranchOrderreference.length; i++){
								var idxOrderreference = vm._companyBranchOrderreference[i].orderreference[Object.keys(vm._companyBranchOrderreference[i].orderreference)[0]];
								var idxOrderreferenceStatusChangeTimestamp = new Date(idxOrderreference.orderreference_status_change_timestamp);
								var orderreferenceStatusChangeTimestamp = new Date(orderreference.orderreference_status_change_timestamp);
								
								if(idxOrderreferenceStatusChangeTimestamp > orderreferenceStatusChangeTimestamp){
									var temp = vm._companyBranchOrderreference[i];
									
									vm._companyBranchOrderreference[i] = v;
									vm._companyBranchOrderreference.push(temp);
									
									break;
									} else if(vm._companyBranchOrderreference.length == (i+1)){
										vm._companyBranchOrderreference.push(v);
										
										break;
									}
								}
							}
						}
					);
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
						
					if(!(null == vm._company.menus)){	vm.companyMenu = vm._company.menus;
					}
					}
				
				vm.companyMenuMenuitem = genCompanyMenuMenuitem();
				}, 
				true
				);
	
	$scope.$watch(
			function(){	return vm.companyBranchOrderreference;
			}, 
			function(){	sortByTimestamp(
					vm.companyBranchOrderreference, 
					true);
			}, 
			true
			);
	
	$scope.$on(
			'$ionicView.beforeEnter', 
			function(){	$ionicHistory.clearHistory();
			}
			);
	
	$scope.$on(
			'$ionicView.afterEnter', 
			function(){
				popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
				
				doFetchReservationsOrderreferencesOrders();
				}
			);
	}