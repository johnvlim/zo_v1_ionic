angular
.module('starter')
.factory(
		'dataService', 
		dataService
		);

dataService.$inject = [
                       'BROADCAST_MESSAGES', 
                       'KEYS', 
                       '$localStorage', 
                       '$q', 
                       '$rootScope', 
                       'companyService', 
                       'branchService', 
                       'menuService', 
                       'tableService', 
                       'menuitemService', 
                       'orderreferenceService', 
                       'orderService', 
                       'reservationService', 
                       'marketingService'
                       ];

function dataService(
		BROADCAST_MESSAGES, 
		KEYS, 
		$localStorage, 
		$q, 
		$rootScope, 
		companyService, 
		branchService, 
		menuService, 
		tableService, 
		menuitemService, 
		orderreferenceService, 
		orderService, 
		reservationService, 
		marketingService
		){
	var dataServiceObj = {
			companies: {}, 
			marketing: {}, 
			companyBranchOrderreferences: {}, 
			fetchCompanies: fetchCompanies, 
			fetchMarketing: fetchMarketing
			};
	
	function getCompanies(){	return dataServiceObj.companies;
	}
	function getMarketing(){	return dataServiceObj.marketing;
	}
	function setCompanies(companies){	dataServiceObj.companies = companies;
	}
	function setMarketing(marketing){	dataServiceObj.marketing = marketing;
	}
	
	function fetchCompanies(){
		var deferred = $q.defer();
		var companies = undefined;
		
		reset();
		
		companyService.fetchCompanies(	//getCompanies
				2, 
				{}
				)
				.then(fetchCompaniesSuccessCallback)
				.then(_fetchCompaniesSuccessCallback)
				.catch(fetchCompaniesFailedCallback);
		
		function fetchCompaniesSuccessCallback(response){
			var qPromises = [];
			companies = localStorage.getItem(KEYS.Companies);
			companies = JSON.parse(companies);
			
			angular.forEach(
					companies, 
					function(
							v, 
							k
							){
						qPromises.push(fetchBranches(v.company_name));
						qPromises.push(fetchMenus(v.company_name));
						}
					);
			
			function fetchBranches(companyName){
				var deferred = $q.defer();
				var branches = undefined;
				
				branchService.setCompanyName(companyName);
				branchService.fetchBranches(	//getCompanyBranches
						1, 
						{}
						)
						.then(fetchBranchesSuccessCallback)
						.then(_fetchBranchesSuccessCallback)
						.catch(fetchBranchesFailedCallback);
				
				function fetchBranchesSuccessCallback(response){
					var qPromises = [];
					
					branches = localStorage.getItem(KEYS.Branches);
					branches = JSON.parse(branches);
					angular.forEach(
							branches, 
							function(
									v, 
									k
									){	qPromises.push(fetchTables(v.branch_name));
									}
							);
					
					companies[companyName][KEYS.Branches] = branches;
					
					function fetchTables(branchName){
						var deferred = $q.defer();
						var tables = undefined;
						
						tableService.setCompanyName(companyName);
						tableService.setBranchName(branchName);
						tableService.fetchTables(	//getCompanyBranchTables
								1, 
								{}
								)
								.then(fetchTablesSuccessCallback)
								.then(_fetchTablesSuccessCallback)
								.catch(fetchTablesFailedCallback);
						
						function fetchTablesSuccessCallback(response){
							tables = localStorage.getItem(KEYS.Tables);
							tables = JSON.parse(tables);
							
							companies[companyName][KEYS.Branches][branchName][KEYS.Tables] = tables;
							
							localStorage.removeItem(KEYS.Branches);
							localStorage.removeItem(KEYS.Tables);
							
							localStorage.setItem(
									KEYS.Companies, 
									JSON.stringify(companies)
									);
							
							deferred.resolve();
							}
						
						function _fetchTablesSuccessCallback(){
							deferred.resolve();
							}
						
						function fetchTablesFailedCallback(responseError){
							deferred.reject(responseError);
							}
						
						return deferred.promise;
						}
					
					return $q.all(qPromises);
					}
				
				function _fetchBranchesSuccessCallback(){
					deferred.resolve();
					}
				
				function fetchBranchesFailedCallback(responseError){
					deferred.reject(responseError);
					}
				
				return deferred.promise;
				}
			
			function fetchMenus(companyName){
				var deferred = $q.defer();
				var menus = undefined;
				
				menuService.setCompanyName(companyName);
				menuService.fetchMenus(	//getCompanyMenus
						1, 
						{}
						)
						.then(fetchMenusSuccessCallback)
						.then(_fetchMenusSuccessCallback)
						.catch(fetchMenusFailedCallback);
				
				function fetchMenusSuccessCallback(response){
					var qPromises = [];
					
					menus = localStorage.getItem(KEYS.Menus);
					menus = JSON.parse(menus);
					
					angular.forEach(
							menus, 
							function(
									v, 
									k
									){	qPromises.push(fetchMenuitems(v.menu_name));
									}
							);
					
					companies[companyName][KEYS.Menus] = menus;
					
					function fetchMenuitems(menuName){
						var deferred = $q.defer();
						
						var menuitems = undefined;
						
						menuitemService.setCompanyName(companyName);
						menuitemService.setMenuName(menuName);
						menuitemService.fetchMenuitems(	//getCompanyMenuMenuitems
								1, 
								{}
								)
								.then(fetchMenuitemsSuccessCallback)
								.then(_fetchMenuitemsSuccessCallback)
								.catch(fetchMenuitemsFailedCallback);
						
						function fetchMenuitemsSuccessCallback(response){
							menuitems = localStorage.getItem(KEYS.Menuitems);
							menuitems = JSON.parse(menuitems);
							
							companies[companyName][KEYS.Menus][menuName][KEYS.Menuitems] = menuitems;
							
							localStorage.removeItem(KEYS.Menus);
							localStorage.removeItem(KEYS.Menuitems);
							
							localStorage.setItem(
									KEYS.Companies, 
									JSON.stringify(companies)
									);
							
							deferred.resolve();
							}
						
						function _fetchMenuitemsSuccessCallback(){
							deferred.resolve();
							}
						
						function fetchMenuitemsFailedCallback(responseError){
							deferred.reject(responseError);
							}
						
						return deferred.promise;
						}
					
					return $q.all(qPromises);
					}
				
				function _fetchMenusSuccessCallback(){
					deferred.resolve();
					}
				
				function fetchMenusFailedCallback(responseError){
					deferred.reject(responseError);
					}
				
				return deferred.promise;
				}
			
			return $q.all(qPromises);
			}
		
		function _fetchCompaniesSuccessCallback(){
			$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesSuccess);
			$rootScope.$broadcast(BROADCAST_MESSAGES.closeIonRefresher);
			
			deferred.resolve();
			}
		
		function fetchCompaniesFailedCallback(responseError){
			reset();
			$rootScope.$broadcast(BROADCAST_MESSAGES.getCompaniesFailed);
			$rootScope.$broadcast(BROADCAST_MESSAGES.closeIonRefresher);
			
			deferred.reject(responseError);
			}
		
		return deferred.promise;
		}
	
	function fetchMarketing(){
		var qPromises = [];
		var marketing = undefined;
		var advertisements = undefined;
		var blogs = undefined;
		
		qPromises.push(fetchAdvertisements());
		qPromises.push(fetchBlogs());
		
		function fetchAdvertisements(){
			var deferred = $q.defer();
			
			marketingService.fetchAdvertisements(	//fetchAdvertisements
					1, 
					{}
					)
					.then(fetchAdvertisementsSuccessCallback)
					.catch(fetchAdvertisementsFailedCallback);
			
			function fetchAdvertisementsSuccessCallback(response){
				advertisements = localStorage.getItem(KEYS.Advertisements);
				advertisements = JSON.parse(advertisements);
				
				if(null == marketing){	marketing = {};
				}
				
				marketing[KEYS.Advertisements] = advertisements;
				
				localStorage.removeItem(KEYS.Advertisements);
				localStorage.setItem(
						KEYS.Marketing, 
						JSON.stringify(marketing)
						);
				
				deferred.resolve();
				}
			
			function fetchAdvertisementsFailedCallback(responseError){
				deferred.reject(responseError);
				}
			
			return deferred.promise;
			}
		
		function fetchBlogs(){
			var deferred = $q.defer();
			
			marketingService.fetchBlogs(	//getBlogs
					1, 
					{}
					)
					.then(fetchBlogsSuccessCallback)
					.catch(fetchBlogsFailedCallback);
			
			function fetchBlogsSuccessCallback(response){
				blogs = localStorage.getItem(KEYS.Blogs);
				blogs = JSON.parse(blogs);
				
				if(null == marketing){	marketing = {};
				}
				
				marketing[KEYS.Blogs] = blogs;
				
				localStorage.removeItem(KEYS.Blogs);
				localStorage.setItem(
						KEYS.Marketing, 
						JSON.stringify(marketing)
						);
				
				deferred.resolve();
				}
			
			function fetchBlogsFailedCallback(responseError){
				reset();
				deferred.reject(responseError);
				}
			
			return deferred.promise;
			}
		
		return $q.all(qPromises);
		}
	
	function reset(){
		localStorage.removeItem(KEYS.Companies);
		localStorage.removeItem(KEYS.Branches);
		localStorage.removeItem(KEYS.Menus);
		localStorage.removeItem(KEYS.Tables);
		localStorage.removeItem(KEYS.Menuitems);
		localStorage.removeItem(KEYS.Advertisements);
		localStorage.removeItem(KEYS.Blogs);
		}
	
	function resetOrderreferences(){
		localStorage.removeItem(KEYS.Orderreferences);
		localStorage.removeItem(KEYS.Orders);
		localStorage.removeItem(KEYS.Reservations);
		}
	
	return dataServiceObj;
	}