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
      console.log(`sending ${options.host} -- ${options.path}`);
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

function filterForGetData(input) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){
      // console.log(input);
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

function filterForGetEntires(input) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){
      // console.log(input);
      var newArr = input.entries.map(function(element){
        // console.log(element.id);
        return {
          date_created: element.date_created,
          likes: element.likes.length,
          title: element.title,
          cover_url: element.cover_url,
          username: element.user.username
        };
      });
      console.log('newArr', newArr);
      resolve(newArr);  // resolve returns data and continues in the .then() route
    } else {
      reject('Error in secondMethod'); // reject returns 'Error in...' and continues in the .catch() route
    }
  });
  return promise;
}

function concatFive(input, all) {
  var promise = new Promise( (resolve, reject)=> {
    if(input){
      console.log('this one', input);
      console.log('all', all);

      const total = all.concat(input);
      console.log('total', total);
      resolve(total);  // resolve returns data and continues in the .then() route
    } else {
      reject('Error in concatFive'); // reject returns 'Error in...' and continues in the .catch() route
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
      return filterForGetData(output);
    })
    .then((output) => {
      response.json({data: output});
    })
    .catch((output) => {
      failure(output);
    });
});


app.get('/more', (request, response) => {
  var all = [];

  // const data = 'joy';
  for(let i=1;i<=3;i++) {
    const apiOptionsMore = {
      host: '',
      path: `/share?limit=2?page=${i}`
    };
    httpGet(apiOptionsMore)
      .then((output) => {
        return filterForGetEntires(output);
      })
      .then((output) => {
        return concatFive(output, all);
      })
      .then((output) => {
        all = output;
        if (output.length >= 6 ){
          response.json({entries: output});
        } else {
          console.log(i);
          return;
        }
      })
    .catch((output) => {
      failure(output);
    });
  }
});

app.listen(3000);
