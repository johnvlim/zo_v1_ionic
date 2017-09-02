angular
.module(
		'starter', 
		[
			'ionic', 
			'ngCordova', 
			'ngMap', 
			'ngStorage', 
			'ion-datetime-picker', 
			'ionic.cloud'
			]
		)
		.config(doRouteConfig)
		.config(doIonicConfig)
		.config(doIonicCloudConfig)
		.run(doRunConfig);

function doRouteConfig(
		$stateProvider, 
		$urlRouterProvider
		){
	$stateProvider
	.state(
			'login', 
			{
				url: '/', 
				views: {
					'main': {
						templateUrl: 'templates/login/login.html', 
						controller: 'loginController', 
						controllerAs: 'loginController'
							}
			}
			}
			)
	.state(
			'customer', 
			{
				url: '/customer', 
				abstract: true, 
				views: {
					'main': {
						templateUrl: 'templates/customer/customer.html'
							}
			}
			}
			)
			.state(
					'customer.home', 
					{
						url: '/home', 
						views: {
							'customer-home': {
								templateUrl: 'templates/customer/home/customer-home.html', 
								controller: 'customerHomeController', 
								controllerAs: 'customerHomeController'
									}
					}
					}
					)
			.state(
					'customer.nearby', 
					{
						url: '/nearby', 
						views: {
							'customer-nearby': {
								templateUrl: 'templates/customer/nearby/customer-nearby.html', 
								controller: 'customerNearbyController', 
								controllerAs: 'customerNearbyController'
									}
					}
					}
					)
					.state(
							'customer.nearby.reservation_menu', 
							{
								url: '/reservation_menu/companies/:companyName/branches/:branchName', 
								views: {
									'customer-nearby@customer': {
										templateUrl: 'templates/customer/nearby/reservation_menu/nearby-reservation_menu.html', 
										controller: 'nearbyReservationMenuController', 
										controllerAs: 'nearbyReservationMenuController'
											}
							}
							}
							)
					.state(
							'customer.nearby.reservation_order', 
							{
								url: '/reservation_order', 
								views: {
									'customer-nearby@customer': {
										templateUrl: 'templates/customer/nearby/reservation_order/nearby-reservation_order.html', 
										controller: 'nearbyReservationOrderController', 
										controllerAs: 'nearbyReservationOrderController'
											}
							}
							}
							)
			.state(
					'customer.mymenu', 
					{
						url: '/mymenu', 
						views: {
							'customer-mymenu': {
								templateUrl: 'templates/customer/mymenu/customer-mymenu.html', 
								controller: 'customerMymenuController', 
								controllerAs: 'customerMymenuController'
									}
					}
					}
					)
			.state(
					'customer.reservation', 
					{
						url: '/reservation', 
						views: {
							'customer-reservation': {
								templateUrl: 'templates/customer/reservation/customer-reservation.html', 
								controller: 'customerReservationController', 
								controllerAs: 'customerReservationController'
									}
					}
					}
					)
	.state(
			'restaurant', 
			{
				url: '/restaurant', 
				abstract: true, 
				views: {
					'main': {
						templateUrl: 'templates/restaurant/restaurant.html'
							}
			}
			}
			)
			.state(
					'restaurant.home', 
					{
						url: '/home/companies/:companyName/branches/:branchName', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/home/restaurant-home.html', 
								controller: 'restaurantHomeController', 
								controllerAs: 'restaurantHomeController'
									}
					}
					}
					)
			.state(
					'restaurant.customer-launch', 
					{
						url: '/customer-launch/companies/:companyName', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/customer/launch/customer-launch.html', 
								controller: 'customerLaunchController', 
								controllerAs: 'customerLaunchController'
									}
					}
					}
					)
			.state(
					'restaurant.customer-qr', 
					{
						url: '/customer-qr/companies/:companyName/branches/:branchName', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/customer/qr/customer-qr.html', 
								controller: 'customerQrController', 
								controllerAs: 'customerQrController'
									}
					}
					}
					)
			.state(
					'restaurant.customer-order_menu', 
					{
						url: '/customer-order_menu/companies/:companyName/branches/:branchName/tables/:tableNumber/orderreferences/:orderreferenceCode', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/customer/order_menu/customer-order_menu.html', 
								controller: 'customerOrderMenuController', 
								controllerAs: 'customerOrderMenuController'
									}
					}
					}
					)
			.state(
					'restaurant.customer-order_order', 
					{
						url: '/customer-order_order/companies/:companyName/branches/:branchName/tables/:tableNumber/orderreferences/:orderreferenceCode', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/customer/order_order/customer-order_order.html', 
								controller: 'customerOrderOrderController', 
								controllerAs: 'customerOrderOrderController'
									}
					}
					}
					)
			.state(
					'restaurant.table-orderreference', 
					{
						url: '/table-orderreference/companies/:companyName/branches/:branchName', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/table/orderreference/table-orderreference.html', 
								controller: 'tableOrderreferenceController', 
								controllerAs: 'tableOrderreferenceController'
									}
					}
					}
					)
			.state(
					'restaurant.table-order', 
					{
						url: '/table-order/companies/:companyName/branches/:branchName/orderreferences/:orderreference', 
						views: {
							'restaurant-content': {
								templateUrl: 'templates/restaurant/table/order/table-order.html', 
								controller: 'tableOrderController', 
								controllerAs: 'tableOrderController'
									}
					}
					}
					)
	.state(
			'kitchen', 
			{
				url: '/kitchen', 
				abstract: true, 
				views: {
					'main': {
						templateUrl: 'templates/kitchen/kitchen.html'
							}
			}
			}
			)
			.state(
					'kitchen.home', 
					{
						url: '/home/companies/:companyName/branches/:branchName', 
						views: {
							'kitchen-content': {
								templateUrl: 'templates/kitchen/home/kitchen-home.html', 
								controller: 'kitchenHomeController', 
								controllerAs: 'kitchenHomeController'
									}
					}
					}
					)
	.state(
			'waiter', 
			{
				url: '/waiter', 
				abstract: true, 
				views: {
					'main': {
						templateUrl: 'templates/waiter/waiter.html'
							}
			}
			}
			)
			.state(
					'waiter.home', 
					{
						url: '/home/companies/:companyName/branches/:branchName', 
						views: {
							'waiter-content': {
								templateUrl: 'templates/waiter/home/waiter-home.html', 
								controller: 'waiterHomeController', 
								controllerAs: 'waiterHomeController'
									}
					}
					}
					);
	
	$urlRouterProvider
	.otherwise("/");
	}

function doIonicConfig(
		$httpProvider, 
		$ionicConfigProvider
		){
	$httpProvider.interceptors.push(httpInterceptor);
	
	$ionicConfigProvider.tabs.position('bottom');
	}

function doIonicCloudConfig($ionicCloudProvider){
	var ionicCloudConfig = {
			'core': {
				'app_id': 'bdc472d0'
			}, 
			'push': {
				'sender_id': '965409630264', 
				'pluginConfig': {
					'ios': {
						'badge': true, 
						'sound': true
					}, 
					'android': {
						'iconColor': '#303030'
							}
					}
			}
			}
	
	$ionicCloudProvider.init(ionicCloudConfig);
	}

function doRunConfig(
		KEYS, 
		USER_ROLES, 
		$injector, 
		$ionicPlatform, 
		$ionicPush, 
		$localStorage, 
		$rootScope, 
		$state, 
		dataService, 
		loginService
		){
	$ionicPlatform.ready(
			function(){
				if(window.cordova && window.cordova.plugins.Keyboard){
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					cordova.plugins.Keyboard.disableScroll(true);
					}
				
				if(window.StatusBar) {	StatusBar.styleDefault();
				}
				
				const STATE_RESTAURANT_HOME = 'restaurant.home';
				const STATE_KITCHEN_HOME = 'kitchen.home';
				const STATE_WAITER_HOME = 'waiter.home';
				
				var user = localStorage.getItem(KEYS.User);
				
				if(!(null == user)){
					user = JSON.parse(user);
					
					if(
							USER_ROLES.administrator == user.role ||
							USER_ROLES.manager == user.role
							){
						$state.go(
								STATE_RESTAURANT_HOME, 
								{
									companyName: user.company_name, 
									branchName: user.branch_name
									}, 
									{	reload: true	}
									);
						} else if(USER_ROLES.cook == user.role){
							$state.go(
									STATE_KITCHEN_HOME, 
									{
										companyName: user.company_name, 
										branchName: user.branch_name
										}, 
										{	reload: true	}
										);
							} else if(USER_ROLES.waiter == user.role){
								$state.go(
										STATE_WAITER_HOME, 
										{
											companyName: user.company_name, 
											branchName: user.branch_name
											}, 
											{	reload: true	}
											);
								}
					}
				}
			);
	
	$rootScope.keys = Object.keys;
	$rootScope.$on(
			'$stateChangeStart', 
			function(
					e, 
					toState, 
					toStateParams, 
					fromState, 
					fromStateParams
					){
				}
			);
	
	$rootScope.home = function(){
		const STATE_RESTAURANT_HOME = 'restaurant.home';
		
		var user = localStorage.getItem(KEYS.User);
		
		if(!(null == user)){
			user = JSON.parse(user);
			
			$state.go(
					STATE_RESTAURANT_HOME, 
					{
						companyName: user.company_name, 
						branchName: user.branch_name
						}, 
						{	reload: true	}
						);
			}
		}
	
	$rootScope.logout = function(){	loginService.doLogout();
	}
	
	$rootScope.doRefreshCompanies = function(){	dataService.fetchCompanies();
	}
	}