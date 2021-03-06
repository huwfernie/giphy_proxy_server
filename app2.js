const express = require('express');
const app = express();
const http = require('http');


const apiOptions = {
  host: 'api.giphy.com',
  path: '/v1/gifs/trending?api_key=dc6zaTOxFJmzC'
};


function httpGet(options) {
  var promise = new Promise(function(resolve, reject) {
    let body = {};
    http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
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
}

function filterForGet(input) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){
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
  });
  return promise;
}


function failure(input) {
  console.log('failure ',input);
}

// Make the call

app.get('/', (request, response) => {
  httpGet(apiOptions)
    .then((output) => {
      filterForGet(output)
      .then((output) => {
        response.json({data: output});
      })
      .catch((output) => {
        failure(output);
      });
    })
    .catch((output)=> {
      failure(output);
    });
});

app.get('/more', (request, response) => {
  const all = [];
  for(let i=0;i<5;i++) {
    const apiOptionsMore = {
      host: 'api.giphy.com',
      path: `/v1/gifs/trending?api_key=dc6zaTOxFJmzC?page=${i}`
    };
    console.log(i);
    httpGet(apiOptionsMore)
      .then((output) => {
        filterForGet(output)
        .then((output) => {
          all.concat(output);
          if(i>=5){
            response.json(all);
          }
        })
        .catch((output) => {
          failure(output);
        });
      })
      .catch((output)=> {
        failure(output);
      });
  }
});

app.listen(3000);
