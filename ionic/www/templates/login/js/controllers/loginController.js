angular
.module('starter')
.controller(
		'loginController', 
		loginController
		);

loginController.$inject = [
                           'BROADCAST_MESSAGES', 
                           'ERROR_MESSAGES', 
                           'KEYS', 
                           'LOADING_MESSAGES', 
                           'USER_ROLES', 
                           '$rootScope', 
                           '$scope', 
                           '$state', 
                           'dataService', 
                           'loginService', 
                           'popupService'
                           ];

function loginController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		USER_ROLES, 
		$rootScope, 
		$scope, 
		$state, 
		dataService, 
		loginService, 
		popupService
		){
	const STATE_CUSTOMER_HOME = 'customer.home';
	const STATE_RESTAURANT_HOME = 'restaurant.home';
	const STATE_KITCHEN_HOME = 'kitchen.home';
	const STATE_WAITER_HOME = 'waiter.home';
	
	var vm = this;
	
	//controller_method
	vm.doLogin = doLogin;
	//controller_method
	vm.doSignup = doSignup;
	
	function doLogin(){
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.authenticatingUser);
		
		function doLoginSuccessCallback(response){
			popupService.hideIonicLoading();
			
			vm.user = localStorage.getItem(KEYS.User);
			vm.user = JSON.parse(vm.user);
			
			dataService.fetchCompanies()
			.then(fetchCompaniesSuccessCallback);
			
			function fetchCompaniesSuccessCallback(){	dataService.fetchMarketing();
			}
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			}
		
		function doLoginFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.authenticationFailed);
			}
		}
	
	function doSignup(){
	}
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesSuccess, 
			function(){
				popupService.hideIonicLoading();
				
				if(USER_ROLES.customer == vm.user.role){
					$state.go(
							STATE_CUSTOMER_HOME, 
							{}, 
							{	reload: true	}
							);
					} else if(
							USER_ROLES.administrator == vm.user.role ||
							USER_ROLES.manager == vm.user.role
							){
						$state.go(
								STATE_RESTAURANT_HOME, 
								{
									companyName: vm.user.company_name, 
									branchName: vm.user.branch_name
									}, 
									{	reload: true	}
									);
						} else if(USER_ROLES.cook == vm.user.role){
							$state.go(
									STATE_KITCHEN_HOME, 
									{
										companyName: vm.user.company_name, 
										branchName: vm.user.branch_name
										}, 
										{	reload: true	}
										);
							} else if(USER_ROLES.waiter == vm.user.role){
								$state.go(
										STATE_WAITER_HOME, 
										{
											companyName: vm.user.company_name, 
											branchName: vm.user.branch_name
											}, 
											{	reload: true	}
											);
								}
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
	
	$rootScope.$on(
			'cloud:push:notification', 
			function(
					event, 
					data
					){
				var command = data.message.raw.additionalData.payload.command;
				console.log(command);
				
				if("updateCompany" == command){
					dataService.fetchCompanies();
					
					popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
					}
				}
			);
	}