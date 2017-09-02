angular
.module('starter')
.controller(
		'restaurantHomeController', 
		restaurantHomeController
		);

restaurantHomeController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'MQTT_TOPICS', 
	'PROMPT_MESSAGES', 
	'$ionicHistory', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'mqttService', 
	'popupService', 
	'qrService'
	];

function restaurantHomeController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		MQTT_TOPICS, 
		PROMPT_MESSAGES, 
		$ionicHistory, 
		$scope, 
		$state, 
		$stateParams, 
		mqttService, 
		popupService, 
		qrService
		){
	const STATE_RESTAURANT_CUSTOMER_LAUNCH = 'restaurant.customer-launch';
	const STATE_RESTAURANT_TABLE_ORDERREFERENCE = 'restaurant.table-orderreference';
	
	var waiterRequestOption = null;
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
	vm.callWaiter = callWaiter;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_CUSTOMER_LAUNCH == stateName){
			$state.go(
					stateName, 
					{	companyName: vm.user.company_name	}, 
					{	reload: true	}
					);
			} else if(STATE_RESTAURANT_TABLE_ORDERREFERENCE == stateName){
				$state.go(
						stateName, 
						{
							companyName: vm.user.company_name, 
							branchName: vm.user.branch_name
							}, 
							{	reload: true	}
							);
				}
		}
	
	function callWaiter(){
		var mqttMessage = {};
		
		var onConnectionLostCallback = function(){
		}
		var onMessageArrivedCallback = function(){
		}
		var onSuccessCallback = function(){
			popupService.hideIonicLoading();
			
			mqttMessage.customer_username = vm.user.username;
			mqttMessage.request_option = waiterRequestOption;
			mqttMessage.table_number = vm.user.tables.table_number;
			mqttMessage.timestamp = new Date();
			mqttMessage = JSON.stringify(mqttMessage);
			
			mqttService.setMqttTopic(MQTT_TOPICS.waiterRequest);
			try{
				popupService.dispIonicLoading(LOADING_MESSAGES.subscribingToTopic);
				
				mqttService.doSubscribe();
				mqttService.doSendMessage(mqttMessage);
				mqttService.doUnsubscribe();
				} catch(e){
					popupService.hideIonicLoading();
					
					popupService.dispIonicPopup(ERROR_MESSAGES.sendMqttFailed);
					} finally{
						popupService.hideIonicLoading();
						}
					}
		var onFailureCallback = function(e){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.connectionFailed);
			}
		
		if(!vm.user[KEYS.Tables]){
			qrService.doScan()
			.then(doScanSuccessCallback)
			.catch(doScanFailedCallback);
		} else {
			var msg = PROMPT_MESSAGES.yesNoExistingTable;
			
			popupService.dispIonicConfirm(msg)
			.then(promptCallback);
			
			function promptCallback(response){
				if(!response){
					var data = '';
					
					data += vm.companyName + ';';
					data += vm.branchName + ';';
					data += vm.user[KEYS.Tables].table_number;
					
					data = {	text: data	};
					doScanSuccessCallback(data);
					} else {
						qrService.doScan()
						.then(doScanSuccessCallback)
						.catch(doScanFailedCallback);
						}
				}
			}
		
		function doScanSuccessCallback(data){
			const DELIMETER = ';';
			var dataSplit = data.text.split(DELIMETER);
			var table = vm._branch.tables[dataSplit[2]];
			
			vm.user[KEYS.Tables] = table;
			localStorage.setItem(
					KEYS.Tables, 
					table
					);
			
			var msg = 'Call Waiter Request Options';
			popupService.dispWaiterRequestOptions(msg)
			.then(promptCallback);
			
			function promptCallback(response){
				waiterRequestOption = response;
				
				mqttService.useDefaultConfig();
				try{
					popupService.dispIonicLoading(LOADING_MESSAGES.connectingToBroker);
					
					mqttService.doConnect(
							onConnectionLostCallback, 
							onMessageArrivedCallback, 
							onSuccessCallback, 
							onFailureCallback
							);
					} catch(e){
						popupService.hideIonicLoading();
						
						popupService.dispIonicPopup(ERROR_MESSAGES.connectionFailed);
						}
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
					vm._company = vm._company = vm.company[vm.companyName];
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
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				}
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
	
	$scope.$on(
			'$ionicView.beforeEnter', 
			function(){	$ionicHistory.clearHistory();
			}
			);
	}