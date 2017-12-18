// create module
var app = angular.module('CalculatorApp', []);

 //Store variables and methods in the controller
app.controller('calcController', ['$scope', '$http', function($scope, $http){
    $scope.parsedList = [];    
        
    //title 
    $scope.title = 'AngularJS Calculator';
    
    //the calculation method to the scope
    $scope.result = function (){
         if($scope.operator == '+') {
           return $scope.a + $scope.b;
       }
         if($scope.operator == '-') {
           return $scope.a - $scope.b;
       }
         if($scope.operator == '*') {
           return $scope.a * $scope.b;
       }
         if($scope.operator == '/') {
           return $scope.a / $scope.b;
       } 
              
    };
       //create a table for storing data
      $scope.exchangerate = {};
      
      //GET the latest currencies from api.fixer.io
      var response = $http.get("http://api.fixer.io/latest");
        
     //http promise for success
      response.then(function(response){
        // Show in console the JSON data
          console.log(response.data);
                 
        $scope.exchangerate = response.data;
         parseData();
        //error case
      },function(error){
        
          console.log('error occured');
          
      })
      
      function parseData() {
        $scope.exchangerate.rates["EUR"] = 1;
         //providing the library with the current exchange rates for money.js
        fx.rates = $scope.exchangerate.rates;
          // for every currency in the table scope.exchangerate.rates redifine a new array (parsedlist) as ("rate": , "currency": )
        for (var cu in $scope.exchangerate.rates) {
            if (cu) {
                var cuVal = $scope.exchangerate.rates[cu];
                 
                var parsedObject = {
                    "rate": cuVal,
                    "currency": cu
                };
                
                
                $scope.parsedList.push(parsedObject);
                //console.log($scope.parsedList);
            }
        }
          //Set the array parsedList with asc order by currency
        $scope.parsedList = _.orderBy($scope.parsedList, ["currency"], ["asc"]);
    }
        
        //When user changes currency
        $scope.currChanged = function(amount, cur) {
        if (cur != null && amount != null) {
            $scope.currencyList = [];
                
            for (var i = 0; i < $scope.parsedList.length; i++) {
                console.log("cur = " + $scope.parsedList[i]['currency'] + " ,rate = " + $scope.parsedList[i]['rate']);
                
                var tmpCur = $scope.parsedList[i]["currency"];
                
                //Process the amount from cur to the tmpCur with 4 float (money.js)
                var rate = fx(amount).from(cur).to(tmpCur).toFixed(4);
                
                //Define a new object
                var currObject = {
                    "amount": amount,
                    "base": cur,
                    "rate": rate,
                    "currency": tmpCur
                };
               
                $scope.currencyList.push(currObject);
                //console.log($scope.currencyList);
                
            }
        } else {
            // When amount field is empty reset the list of currencies
            $scope.currencyList = []; 
        }
    };
    
    
}]);

app.filter("CurrencyListFrom", function() {
    return function(obj, currentCur) {

        var myList = [];
        for (var c in obj) {
            if (obj[c]["currency"] != currentCur) {
                myList.push(obj[c]);
            }
        }

        
        myList = _.orderBy(myList, ["currency"], ["asc"]);
        return myList;
    };
});
/* });  */