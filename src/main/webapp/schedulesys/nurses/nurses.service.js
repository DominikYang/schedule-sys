(function() {
	'use strict';
	
	angular
		.module('scheduleSys')
		.factory('NursesService', NursesService)
		.factory('NurseLicenseService', NurseLicenseService);
	
	
	
	NursesService.$Inject = ['$resource'];
	
	function NursesService($resource) {
		console.log('calling nurses service');
		var resourceUrl = '/nurses/:id';
		
		return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' },
            'remove':  {
                method: 'DELETE',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.toJson(data);
                    }
                    return data;
                }
            },
            'save': {
                method: 'POST',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.toJson(data);
                    }
                    return data;
                }
            
            }
        });
		
	}
	
NurseLicenseService.$Inject = ['$resource'];
	
	function NurseLicenseService($resource){
		var resourceUrl = '/nurses/:id/licenses';
		return $resource(resourceUrl, {},{
			'query': { method: 'GET', isArray: true}
		});
	}
	
})();