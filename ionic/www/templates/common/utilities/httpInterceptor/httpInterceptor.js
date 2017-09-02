angular
.module('starter')
.factory(
		'httpInterceptor', 
		httpInterceptor
		);

httpInterceptor.$inject = [
	'$injector', 
	'$localStorage'
	];

function httpInterceptor(
		$injector, 
		$localStorage
		){
	const STATE_LOGIN = 'login';
	const ERR_TOKEN_EXPIRED_EXCEPTION = 'token_expired';
	const STATUS_CODE_UNAUTHORIZED = 401;
	const STATUS_TEXT_UNAUTHORIZED = 'Unauthorized';
	
	var httpInterceptorObj = {
			request: request, 
			response: response, 
			requestError: requestError, 
			responseError: responseError
			};
	
	function request(config){
		return config
		}
	
	function response(res){
		return res;
		}
	
	function requestError(config){
		return config;
		}
	
	function responseError(res){
		if(
				STATUS_CODE_UNAUTHORIZED == res.status &&
				STATUS_TEXT_UNAUTHORIZED == res.statusText &&
				ERR_TOKEN_EXPIRED_EXCEPTION == res.data.error
				){
			var stateProvider = $injector.get('$state');
			var ionicHistoryProvider = $injector.get('$ionicHistory');
			var popupServiceProvider = $injector.get('popupService');
			
			var msg = 'session has expired, please login';
			popupServiceProvider.dispIonicPopup(msg);
			
			ionicHistoryProvider.clearHistory();
			stateProvider.go(
					STATE_LOGIN, 
					{}, 
					{	reload: true	}
					);
			}
		
		return res;
		}
	
	return httpInterceptorObj;
	}