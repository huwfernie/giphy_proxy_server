const express = require('express');
const app = express();
const http = require('http');

var firstMethod = function() {
  var promise = new Promise(function(resolve, reject) {
    const data = {test: '123'};
    if (data) {
      console.log(data);
      resolve(data);
    } else {
      reject('no data');
    }

  });
  return promise;
};


function success(input) {
  console.log('success ',input);
}

function failure(input) {
  console.log('failure ',input);
}

firstMethod()
  .then(success())
  .catch(failure());





//
//
// var secondMethod = function(someStuff) {
//   var promise = new Promise(function(resolve){
//     setTimeout(function() {
//       console.log('second method completed');
//       resolve({newData: someStuff.data + ' some more data'});
//     }, 1000);
//   });
//   return promise;
// };
//
// var thirdMethod = function(someStuff) {
//   var promise = new Promise(function(resolve){
//     setTimeout(function() {
//       console.log('third method completed');
//       resolve({result: someStuff.newData});
//     }, 2000);
//   });
//   return promise;
// };
