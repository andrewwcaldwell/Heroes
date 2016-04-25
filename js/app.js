/* es next = true */
'use strict';
/// MUST RUN PYTHON FROM PUBLIC DIRECTORY w/ TERMINAL
/// Run : python -m SimpleHTTPServer
/// In Browser set address to: localhost:8000

/// Instantiate Angular - String Matches HTML 'ng-app'

var heroApp = angular.module('MarvelApp', ['ngRoute']);

//////////// ROUTER ////////////
heroApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/heroes', {
            controller: 'HeroListController',
            templateUrl: 'templates/hero-list.html',
        }).
        when('/heroes/:heroID', {
            controller: 'HeroDetailController',
            templateUrl: 'templates/hero-detail.html',
        }).
        when('/heroes/:heroID/:event', {
            controller: 'EventDetailController',
            templateUrl: 'templates/event-detail.html'
        }).
        otherwise({
            redirectTo: '/heroes'
        });
    //console.log('Router Hot');
}]);
    
//////////// LIST CHARACTERS CONTROLLER ////////////
heroApp.controller('HeroListController', ['$scope', 'HeroService', function($scope, HeroService) {
    //console.log('Hero List is Working');
    $scope.heroes = HeroService.getAllHeroes();    
}]);

//////////// CHARACTER DETAIL CONTROLLER ////////////
heroApp.controller('HeroDetailController', ['$scope', '$routeParams', 'HeroService', function($scope, $routeParams, HeroService) {
    //console.log('Hero Detail is Working');
    $scope.indy = HeroService.getCurrentHero($routeParams.heroID);
    HeroService.prepEvents($routeParams.heroID);
}]);

//////////// EVENT DETAIL CONTROLLER ////////////
heroApp.controller('EventDetailController', ['$scope', '$routeParams', 'HeroService', function($scope, $routeParams, HeroService) {
    //console.log('Event Detail is Working');
    $scope.event = HeroService.getCurrentEvent($routeParams.event);   
}]);

//////////// HERO FACTORY ////////////
heroApp.factory('HeroService', function($http) {
    //$scope.findem = '';
    var heroes = [];
    var events = [];
    var selectedHero = [];
    var selectedEvent = [];
    
    $http({
        method: 'get',
        url: 'http://gateway.marvel.com:80/v1/public/characters?limit=50&apikey=50f1baf21e1535c08fef3b992e928123',
    }).then(function (response) {
        angular.copy(response.data.data.results, heroes);
        //console.log(heroes);
    });
    
    return {
        
        getAllHeroes: function() {
            return heroes;
        },
        
        getCurrentHero: function (callback) {
            for (let i = 0; i < heroes.length; i++) {
                if (heroes[i].id === parseInt(callback)) {
                    selectedHero = heroes[i]; 
                }
            }
            //console.log(selectedHero);
            return selectedHero;
        },
        
        prepEvents: function(heroID) {
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/characters/'+ heroID +'/events?apikey=50f1baf21e1535c08fef3b992e928123'
            }).then(function (response) {
                angular.copy(response.data.data.results, events);
                //console.log(events);
            });
        },
        
        getCurrentEvent: function (callback) {
            console.log(callback);
            for (let i = 0; i < events.length; i++) {
                if (events[i].title === callback) {
                    selectedEvent= events[i]; 
                }
            }
            //console.log(selectedEvent);
            return selectedEvent;
            
        },
    };
});