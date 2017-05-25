const express = require('express');
const app = express();
const http = require('http');

var firstMethod = function() {
  var promise = new Promise(function(resolve, reject) {
    const data = 'abcd';
    if (data) {
      console.log(data);
      resolve(data);  // resolve returns data and continues in the .then() route
    } else {
      console.log(data);
      reject('no data'); // reject returns the data and continues in the .catch() route
    }

  });
  return promise;
};

function secondMethod(input) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){
      resolve(input.toUpperCase());  // resolve returns data and continues in the .then() route
    } else {
      reject('Error in secondMethod');
    }
  });
  return promise;
}


function success(input) {
  console.log('success ',input);
}

function failure(input) {
  console.log('failure ',input);
}

// Make the call

firstMethod()
  .then((output) => {
    secondMethod(output)
    .then((output) => {
      success(output);
    })
    .catch((output) => {
      failure(output);
    });
  })
  .catch((output)=> {
    failure(output);
  });





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
