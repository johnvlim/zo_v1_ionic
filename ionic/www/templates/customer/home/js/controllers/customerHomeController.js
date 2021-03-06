angular
.module('starter')
.controller(
		'customerHomeController', 
		customerHomeController
		);

customerHomeController.$inject = [
                                  'BROADCAST_MESSAGES', 
                                  'ERROR_MESSAGES', 
                                  'KEYS', 
                                  'LOADING_MESSAGES', 
                                  '$ionicHistory', 
                                  '$ionicSlideBoxDelegate', 
                                  '$localStorage', 
                                  '$scope', 
                                  '$timeout', 
                                  'dataService', 
                                  'networkService', 
                                  'popupService'
                                  ];

function customerHomeController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$timeout, 
		dataService, 
		networkService, 
		popupService
		){
	const DOM_ADVERTISEMENT_SLIDEBOX_HANDLE = 'advertisement-slidebox';
	const DOM_BLOG_SLIDEBOX_HANDLE = 'blog-slidebox';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(KEYS.Marketing))){
		vm.marketing = localStorage.getItem(KEYS.Marketing);
		vm.marketing = JSON.parse(vm.marketing);
		
		vm.advertisement = vm.marketing.advertisements;
		vm.blog = vm.marketing.blogs;
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.Marketing);
			}, 
			function(){
				vm.marketing = localStorage.getItem(KEYS.Marketing);
				vm.marketing = JSON.parse(vm.marketing);
				}
			);
	
	$scope.$watch(
			function(){	return vm.marketing;
			}, 
			function(){
				if(!(null == vm.marketing)){
					vm.advertisement = vm.marketing.advertisements;
					vm.blog = vm.marketing.blogs;
					}
				
				$timeout(
						function(){
							$ionicSlideBoxDelegate.$getByHandle(DOM_ADVERTISEMENT_SLIDEBOX_HANDLE).update();
							$ionicSlideBoxDelegate.$getByHandle(DOM_BLOG_SLIDEBOX_HANDLE).update();
							}
						);
				}, 
				true
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
			BROADCAST_MESSAGES.getMarketingSuccess, 
			function(){	popupService.hideIonicLoading();
			}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getMarketingFailed, 
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