const express = require('express');
const app = express();
const http = require('http');


var options = {
  host: 'api.giphy.com',
  path: '/v1/gifs/trending?api_key=dc6zaTOxFJmzC'
};
let body = {};

var firstMethod = function() {
  var promise = new Promise(function(resolve, reject) {
    http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(bodyChunks);
        body = JSON.parse(body);

        if (body) {
          resolve(body);  // resolve returns body and continues in the .then() route
        } else {
          reject('no data'); // reject returns 'no data' and continues in the .catch() route
        }
      });
    });

  });
  return promise;
};

function secondMethod(input) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){

      console.log(input.data);
      var newArr = input.data.map(function(element){
        return {
          id: element.id,
          url: element.images.fixed_height.url,
          slug: element.slug
        };
      });


      resolve(newArr);  // resolve returns data and continues in the .then() route
    } else {
      reject('Error in secondMethod'); // reject returns 'Error in...' and continues in the .catch() route
    }

    // function filter(element, index, array){
    //   console.log({ id: element.id });
    //   temp = temp.push({ id: element.id } );
    // }

  });
  return promise;
}


// function success(input) {
//   console.log('success ',input);
// }

function failure(input) {
  console.log('failure ',input);
}

// Make the call

app.get('/', (request, response) => {
  firstMethod()
    .then((output) => {
      secondMethod(output)
      .then((output) => {
        response.json(output);
      })
      .catch((output) => {
        failure(output);
      });
    })
    .catch((output)=> {
      failure(output);
    });
});

app.listen(3000);
