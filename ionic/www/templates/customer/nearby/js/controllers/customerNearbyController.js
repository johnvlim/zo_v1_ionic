angular
.module('starter')
.controller(
		'customerNearbyController', 
		customerNearbyController
		);

customerNearbyController.$inject = [
                                    'BROADCAST_MESSAGES', 
                                    'ERROR_MESSAGES', 
                                    'KEYS', 
                                    'LOADING_MESSAGES', 
                                    '$ionicHistory', 
                                    '$ionicSlideBoxDelegate', 
                                    '$localStorage', 
                                    '$scope', 
                                    '$state', 
                                    '$timeout', 
                                    'branchService', 
                                    'dataService', 
                                    'googleplacesService', 
                                    'networkService', 
                                    'popupService'
                                    ];

function customerNearbyController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicHistory, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$state, 
		$timeout, 
		branchService, 
		dataService, 
		googleplacesService, 
		networkService, 
		popupService
		){
	const DOM_FEATURED_MENU_SLIDEBOX_HANDLE = 'featured_menu-slidebox';
	
	var vm = this;
	vm.mapConfig = {
			center: {
				latitude: undefined, 
				longitude: undefined
				}, 
				mapTypeControl: false, 
				scaleControl: false, 
				streetViewControl: false, 
				zoom: 15, 
				zoomControl: false
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
	vm.setCompanyCategory = setCompanyCategory;
	//controller_method
	vm.toStringBranchAddress = toStringBranchAddress;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if('customer.nearby.reservation_menu' == stateName){
			$state.go(
					stateName, 
					{
						companyName: stateParams.companyName, 
						branchName: stateParams.branchName
						}, 
						{	reload: true	}
						);
			}
		}
	
	function setCompanyCategory(_companyCategory){	vm._companyCategory = _companyCategory;
	}
	
	function toStringBranchAddress(branch){
		if(null == branch){	return;
		}
		
		branchService.setBranches(branch);
		
		return branchService.toStringAddress();
		}
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.company, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menus, 
							function(
									j, 
									i
									){
								angular.forEach(
										j.menuitems, 
										function(
												j, 
												i
												){
											if(null == companyMenuMenuitem[k]){	companyMenuMenuitem[k] = {};
											}
											if(1 == j.menuitem_featured){	companyMenuMenuitem[k][j.menuitem_code] = j;
											}
											}
										);
								}
							);
					}
				);
		
		$timeout(
				function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_FEATURED_MENU_SLIDEBOX_HANDLE).update();
				}
				);
		
		return companyMenuMenuitem;
		}
	
	function genCompanyCategory(){
		var companyCategory = [];
		
		angular.forEach(
				vm.company, 
				function(
						v, 
						k
						){
					var company = v;
					
					if(-1 == companyCategory.indexOf(v.company_category)){	companyCategory.push(v.company_category);
					}
					}
				);
		
		return companyCategory;
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
					vm.companyMenuMenuitem = genCompanyMenuMenuitem();
					vm.companyCategory = genCompanyCategory();
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
	
	$scope.$watch(
			function(){	return vm.search;
			}, 
			function(){
				if(
						null == vm.search ||
						0 == vm.search.trim().length
						){
					vm.placePrediction = undefined;
					return;
					}
				
				googleplacesService.getPlacePredictions(vm.search)
				.then(getPlacePredictionsSuccessCallback)
				.catch(getPlacePredictionsFailedCallback);
				
				function getPlacePredictionsSuccessCallback(predictions){		vm.placePrediction = predictions;
				}
				
				function getPlacePredictionsFailedCallback(status){	//do something on failure
				}
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
	
	$scope.$on(
			'$ionicView.afterEnter', 
			function(){
				if(!(null == vm.user)){
					vm.user.reservationOrder = {};
					
					localStorage.setItem(
							KEYS.User, 
							JSON.stringify(vm.user)
							);
					}
				}
			);
	}