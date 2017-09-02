angular
.module('starter')
.factory(
		'popupService', 
		popupService
		);

popupService.$inject = [
	'$ionicLoading', 
    '$ionicPopup', 
    '$q', 
    '$timeout', 
    'WAITER_REQUESTS'
    ];

function popupService(
		$ionicLoading, 
		$ionicPopup, 
		$q, 
		$timeout, 
		WAITER_REQUESTS
		){
	var popupServiceObj = {
			dispIonicLoading: dispIonicLoading, 
			hideIonicLoading: hideIonicLoading, 
			dispIonicPopup: dispIonicPopup, 
			dispIonicConfirm: dispIonicConfirm, 
			dispWaiterRequestOptions: dispWaiterRequestOptions
			};
	
	function dispIonicLoading(msg){
		var templateString = '';
		templateString += '<ion-spinner></ion-spinner><br>';
		templateString += "<span class='font-family-3-size-medium'>" + msg + '</span>';
		
		$ionicLoading.show(
				{	template: templateString	}
				);
		}
	
	function hideIonicLoading(){	$ionicLoading.hide();
	}
	
	function dispIonicPopup(msg){
		var templateString = '';
		templateString += "<span class='font-family-3-size-medium'>" + msg + '</span>';
		
		$ionicPopup.alert(
				{	template: templateString	}
				);
		}
	
	function dispIonicConfirm(
			msg, 
			customButtons
			){
		var deferred = $q.defer();
		var templateString = '';
		
		templateString += "<span class='font-family-3-size-medium'>" + msg + '</span>';
		
		if(!customButtons){
			var ionicConfirm = $ionicPopup.show(
					{
						template: templateString, 
						buttons: [
							{
								text: 'cancel', 
								type: 'button-assertive button-small', 
								onTap: function(event){
									event.preventDefault();
									event.stopPropagation();
									
									$timeout(
											function(){	ionicConfirm.close();
											}, 
											500
											);
									
									deferred.resolve(false);
									}
							}, 
							{
								text: 'ok', 
								type: 'button-positive button-small', 
								onTap: function(event){
									event.preventDefault();
									event.stopPropagation();
									
									$timeout(
											function(){	ionicConfirm.close();
											}, 
											500
											);
									
									deferred.resolve(true);
									}
							}
							]
					}
					);
			} else {
				var ionicConfirm = $ionicPopup.show(
						{
							template: templateString, 
							buttons: customButtons
							}
						);
				}
		
		return deferred.promise;
		}
	
	function dispWaiterRequestOptions(msg){
		var deferred = $q.defer();
		var templateString = '';
		
		templateString += "<span class='font-family-3-size-medium'>" + msg + '</span>';
		
		var ionicConfirm = $ionicPopup.show(
				{
					template: templateString, 
					buttons: [
						{
							text: WAITER_REQUESTS.callWaiter, 
							type: 'button-assertive button-small', 
							onTap: function(event){
								event.preventDefault();
								event.stopPropagation();
								
								$timeout(
										function(){	ionicConfirm.close();
										}, 
										500
										);
								
								deferred.resolve(WAITER_REQUESTS.callWaiter);
								}
						}, 
						{
							text: WAITER_REQUESTS.billOut, 
							type: 'button-assertive button-small', 
							onTap: function(event){
								event.preventDefault();
								event.stopPropagation();
								
								$timeout(
										function(){	ionicConfirm.close();
										}, 
										500
										);
								
								deferred.resolve(WAITER_REQUESTS.billOut);
								}
						}
						]
				}
				);
		
		return deferred.promise;
		}
	
	return popupServiceObj;
	}