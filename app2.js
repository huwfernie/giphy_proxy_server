const express = require('express');
const app = express();
const http = require('http');

var firstMethod = function() {
  var promise = new Promise(function(resolve){
    setTimeout(function() {
      console.log('first method completed');
      resolve({data: '123'});
    }, 1000);
  });
  return promise;
};


var secondMethod = function(someStuff) {
  var promise = new Promise(function(resolve){
    setTimeout(function() {
      console.log('second method completed');
      resolve({newData: someStuff.data + ' some more data'});
    }, 1000);
  });
  return promise;
};

var thirdMethod = function(someStuff) {
  var promise = new Promise(function(resolve){
    setTimeout(function() {
      console.log('third method completed');
      resolve({result: someStuff.newData});
    }, 2000);
  });
  return promise;
};

firstMethod()
   .then(secondMethod)
   .then(thirdMethod);
