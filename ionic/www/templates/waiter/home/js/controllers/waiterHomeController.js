angular
.module('starter')
.controller(
		'waiterHomeController', 
		waiterHomeController
		);

waiterHomeController.$inject = [
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                'LOADING_MESSAGES', 
                                'MQTT_TOPICS', 
                                '$ionicHistory', 
                                '$ionicSlideBoxDelegate', 
                                '$scope', 
                                '$timeout', 
                                'mqttService', 
                                'popupService'
                                ];

function waiterHomeController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		MQTT_TOPICS, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$scope, 
		$timeout, 
		mqttService, 
		popupService
		){
	const DOM_WAITER_REQUEST_SLIDEBOX_HANDLE = 'waiter_request-slidebox';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.initializeMqtt = initializeMqtt;
	//controller_method
	vm.doSwipeRight = doSwipeRight;
	
	function initializeMqtt(){
		var onConnectionLostCallback = function(responseError){
		}
		var onMessageArriveCallback = function(response){
			var payloadString = response.payloadString;
			payloadString = JSON.parse(payloadString);
			
			if(MQTT_TOPICS.waiterRequest == response.destinationName){
				if(null == vm.waiterRequests){	vm.waiterRequests = {};
				}
				vm.waiterRequests[payloadString.table_number] = payloadString;
				$timeout(
						function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_WAITER_REQUEST_SLIDEBOX_HANDLE).update();
						}
						);
				} else if(MQTT_TOPICS.waiterResponse == response.destinationName){
					delete vm.waiterRequests[payloadString.table_number];
					
					$timeout(
							function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_WAITER_REQUEST_SLIDEBOX_HANDLE).update();
							}
							);
					}
			}
		var onSuccessCallback = function(){
			popupService.hideIonicLoading();
			
			mqttService.setMqttTopic(MQTT_TOPICS.waiterRequest);
			try{
				popupService.dispIonicLoading(LOADING_MESSAGES.subscribingToTopic);
				
				mqttService.doSubscribe();
				} catch(e){
					popupService.hideIonicLoading();
					
					popupService.dispIonicPopup(ERROR_MESSAGES.subscriptionFailed);
					} finally{
						popupService.hideIonicLoading();
						}
				
			mqttService.setMqttTopic(MQTT_TOPICS.waiterResponse);
			try{
				popupService.dispIonicLoading(LOADING_MESSAGES.subscribingToTopic);
				
				mqttService.doSubscribe();
				} catch(e){
					popupService.hideIonicLoading();
					
					popupService.dispIonicPopup(ERROR_MESSAGES.subscriptionFailed);
					} finally{
						popupService.hideIonicLoading();
						}
					}
		var onFailureCallback = function(e){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.connectionFailed);
			}
		
		mqttService.useDefaultConfig();
		try{
			popupService.dispIonicLoading(LOADING_MESSAGES.connectingToBroker);
			
			mqttService.doConnect(
					onConnectionLostCallback, 
					onMessageArriveCallback, 
					onSuccessCallback, 
					onFailureCallback
					);
			} catch(e){
				popupService.hideIonicLoading();
				
				popupService.dispIonicPopup(ERROR_MESSAGES.connectionFailed);
				}
			}
	
	function doSwipeRight(waiterRequest){
		var mqttMessage = {};
		
		mqttMessage = waiterRequest;
		mqttMessage.responding_waiter = vm.user.username;
		mqttMessage.timestamp = new Date();
		mqttMessage = JSON.stringify(mqttMessage);
		
		mqttService.setMqttTopic(MQTT_TOPICS.waiterResponse);
		try{	mqttService.doSendMessage(mqttMessage);
		} catch(e){	popupService.dispIonicPopup(ERROR_MESSAGES.mqttSendFailed);
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
	
	$scope.$on(
			'$ionicView.beforeEnter', 
			function(){	$ionicHistory.clearHistory();
			}
			);
	}