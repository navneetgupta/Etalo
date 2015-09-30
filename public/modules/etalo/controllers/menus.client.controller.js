/**
 * Created by navneet_gupta on 14/09/15.
 */
'use strict';

angular.module('etalo').controller('MenusController', ['$scope','$window','MenusService',
	function($scope,$window,MenusService) {
		if(localStorage.getItem('outlet') !== null) {
			$('.outlet_selected').text(localStorage.getItem('outlet'));
			$('.outlet').css('display', 'block');
		} else {
			$window.location.href = '/#!/outles';
		}

		$scope.getMenu = function(){
			if(localStorage.getItem('outlet') !== null) {
				var menus = MenusService.query({outlet:localStorage.getItem('outlet')},function(){
					$scope.menus = menus.menu;
				});
			}
		};
		$scope.cart={};
		$scope.totalCost = 0.00;
		$scope.total_items = 4;
		$scope.cartEmpty = true;
		$scope.incrementItemToCart = function(menu) {
			menu.noOfItemsSelected ++;
			if($scope.cart.hasOwnProperty(menu.name)) {
				$scope.cart[menu.name].noOfItems  = menu.noOfItemsSelected;
				$scope.totalCost = $scope.totalCost + menu.price;
			} else {
				$scope.cart[menu.name] = {noOfItems:menu.noOfItemsSelected,priceEach:menu.price};
				$scope.totalCost = $scope.totalCost + menu.price;
			}
			$scope.cartEmpty = $scope.cart.length>0;
		};
		$scope.decrementItemFromCart = function(menu) {
			menu.noOfItemsSelected --;
			if($scope.cart.hasOwnProperty(menu.name)) {
				if(menu.noOfItemsSelected ===0) {
					delete $scope.cart[menu.name];
				} else {
					$scope.cart[menu.name].noOfItems  = menu.noOfItemsSelected;
					$scope.totalCost = $scope.totalCost - menu.price;
				}
			} else {
				$scope.cart[menu.name] = {noOfItems:menu.noOfItemsSelected,priceEach:menu.price};
				$scope.totalCost = $scope.totalCost - menu.price;
			}
			$scope.cartEmpty = $scope.cart.length>0;
		};
			
		$scope.resetCart = function() {
			for(var property in $scope.cart){
				if($scope.cart.hasOwnProperty(property)) {
					$scope.menus.forEach(function(menu) {
						menu.noOfItemsSelected=0;
					});
					delete $scope.cart[property];
				}
			}
			$scope.cartEmpty = $scope.cart.length > 0;
			$scope.totalCost = 0.00;
		};
		$scope.getCart = function(){
			var cart = $scope.cart;
			$.post( '/getCartValue', {cart})
                .done(function( data ) {
                    $scope.cart = data.cart;
                    $scope.totalCost = data.cost;
            });
		};
		
	}

]);