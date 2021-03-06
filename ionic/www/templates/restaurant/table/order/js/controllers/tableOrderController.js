angular
.module('starter')
.controller(
		'tableOrderController', 
		tableOrderController
		);

tableOrderController.$inject = [
                                'BROADCAST_MESSAGES', 
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                'LOADING_MESSAGES', 
                                'ORDER_STATUS', 
                                'ORDERREFERENCE_STATUS', 
                                'TABLE_STATUS', 
                                '$scope', 
                                '$state', 
                                '$stateParams', 
                                'orderService', 
                                'orderreferenceService', 
                                'popupService', 
                                'tableService'
                                ];

function tableOrderController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		TABLE_STATUS, 
		$scope, 
		$state, 
		$stateParams, 
		orderService, 
		orderreferenceService, 
		popupService, 
		tableService
		){
	const STATE_RESTAURANT_TABLE_ORDERREFERENCE = 'restaurant.table-orderreference';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	if(!(null == $stateParams.orderreference)){
		vm.orderreference = $stateParams.orderreference;
		vm.order = JSON.parse(vm.orderreference).order;
		vm.orderreference = JSON.parse(vm.orderreference).orderreference;
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
	vm.updateOrderStatus = updateOrderStatus;
	//controller_method
	vm.getMenuitemFromId = getMenuitemFromId;
	//controller_method
	vm.doDone = doDone;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_TABLE_ORDERREFERENCE == stateName){
			$state.go(
					stateName, 
					{
						companyName: vm.companyName, 
						branchName: vm.branchName
						}, 
						{	reload: true	}
						);
			}
		}
	
	function updateOrderStatus(
			orderId, 
			orderStatus
			){
		var order = {
				order_status: orderStatus, 
				order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				order_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
					}
		
		orderService.setCompanyName(vm.companyName);
		orderService.setBranchName(vm.branchName);
		orderService.setTableNumber(getTableNumberFromId(vm.orderreference[Object.keys(vm.orderreference)[0]].table_id));
		orderService.setOrderreferenceCode(Object.keys(vm.orderreference)[0]);
		orderService.setOrderId(orderId);
		orderService.updateOrder([order])
		.then(updateOrderSuccessCallback)
		.catch(updateOrderFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.updatingOrder);
		
		function updateOrderSuccessCallback(response){
			popupService.hideIonicLoading();
			
			var orderStatus = response.config.data[0].order_status;
			var orderId = response.config.url.split('/');
			orderId = orderId[orderId.length-1];
			vm.order[orderId].order_status = orderStatus;
			}
		
		function updateOrderFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
			}
		}
	
	function getMenuitemFromId(menuitemId){
		var menuitem = undefined;
		
		angular.forEach(
				vm.companyMenuMenuitem, 
				function(
						v, 
						k
						){
					if(k == menuitemId){	menuitem = v;
					}
					}
				);
		
		return menuitem;
		}
	
	function doDone(){
		var orderreference = {
				orderreference_status: ORDERREFERENCE_STATUS.done, 
				orderreference_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				orderreference_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				}
		
		orderreferenceService.setCompanyName(vm.companyName);
		orderreferenceService.setBranchName(vm.branchName);
		orderreferenceService.setTableNumber(getTableNumberFromId(vm.orderreference[Object.keys(vm.orderreference)[0]].table_id));
		orderreferenceService.setOrderreferenceCode(Object.keys(vm.orderreference)[0]);
		orderreferenceService.updateOrderreference([orderreference])
		.then(updateOrderreferenceSuccessCallback)
		.catch(updateOrderreferenceFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.updatingOrderreference);
		
		function updateOrderreferenceSuccessCallback(response){
			var table = {
					table_status: TABLE_STATUS.vacant, 
					table_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
					table_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
					};
			
			tableService.setCompanyName(vm.companyName);
			tableService.setBranchName(vm.branchName);
			tableService.setTableNumber(getTableNumberFromId(vm.orderreference[Object.keys(vm.orderreference)[0]].table_id));
			tableService.updateTable([table])
			.then(updateTableSuccessCallback)
			.catch(updateTableFailedCallback);
			
			function updateTableSuccessCallback(response){
				popupService.hideIonicLoading();
				
				gotoState(STATE_RESTAURANT_TABLE_ORDERREFERENCE);
				}
			
			function updateTableFailedCallback(responseError){
				popupService.hideIonicLoading();
				
				popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
				}
			}
		
		function updateOrderreferenceFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
			}
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
					if(null == vm.menuName){	vm.menuName = k;
					}
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
	
	function isOrderDone(){
		var _isOrderDone = true;
		
		angular.forEach(
				vm.order, 
				function(
						v, 
						k
						){
					if(!(ORDER_STATUS.to_serve == v.order_status)){	_isOrderDone = false;
					}
					}
				);
		
		return _isOrderDone;
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
			function(){	return vm.order;
			}, 
			function(){	vm.isOrderDone = isOrderDone();
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