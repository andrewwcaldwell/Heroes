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
        when('/heroes/:heroID/:eventID', {
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
    //console.log($scope.heroes);
}]);

//////////// CHARACTER DETAIL CONTROLLER ////////////
heroApp.controller('HeroDetailController', ['$scope', '$routeParams', 'HeroService', function($scope, $routeParams, HeroService) {
    //console.log('Hero Detail is Working');
    $scope.indy = HeroService.getCurrentHero($routeParams.heroID);
    //console.log('Hero Detail');
    //console.log($scope.indy);
    $scope.events = HeroService.getHeroEvents($routeParams.heroID);
    //console.log('Hero Events');
    //console.log($scope.events);
    $scope.eventCharacters = HeroService.getSelectedEvent();
    //console.log($scope.hoverEvent);
    $scope.setClick = function(event) {HeroService.setSelect(event);};
    //console.log(event);
}]);

//////////// EVENT DETAIL CONTROLLER ////////////
heroApp.controller('EventDetailController', ['$scope', '$routeParams', 'HeroService', function($scope, $routeParams, HeroService) {
    console.log('Event Detail is Working');
    //$scope.event = HeroService.getCurrentEvent($routeParams.heroID, $routeParams.event);
    $scope.event = HeroService.getSelectedEvent();
    $scope.characters = HeroService.getEventCharacters($routeParams.eventID);
    console.log($scope.characters);
}]);

//////////// HERO FACTORY ////////////
heroApp.factory('HeroService', function($http) {
    //$scope.findem = '';
    var heroes = [];
    var events = [];
    var selectedHero = [];
    var selectedEvent = [];
    var characters = [];
    
    $http({
        method: 'get',
        url: 'http://gateway.marvel.com:80/v1/public/characters?limit=5&apikey=50f1baf21e1535c08fef3b992e928123',
    }).then(function (response) {
        angular.copy(response.data.data.results, heroes);
        //console.log(heroes);
    });
    
    return {
        
        getAllHeroes: function() {
            return heroes;
        },
        
        getCurrentHero: function (input) {
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/characters/'+ input +'?apikey=50f1baf21e1535c08fef3b992e928123'
            }).then(function (response) {
                angular.copy(response.data.data.results[0], selectedHero);
                //console.log(selectedHero);
            });
            return selectedHero;
        },
        
        getHeroEvents: function (input) {
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/characters/'+ input +'/events?apikey=50f1baf21e1535c08fef3b992e928123'
            }).then(function (response) {
                angular.copy(response.data.data.results, events);
                angular.copy(response.data.data.results[0], selectedEvent);
                //console.log(selectedEvent);
            });
            return events;
        },
        
        getEventCharacters: function (input) {
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/events/'+ input +'/characters?apikey=50f1baf21e1535c08fef3b992e928123'
            }).then(function (response) {
                angular.copy(response.data.data.results, characters);
            });
            return characters;
        },
        
        getSelectedEvent: function() {
            return selectedEvent;
        },
        
        setSelect: function(input) {
            angular.copy(input, selectedEvent);
            console.log("Click Works");
        }, 
    };
});