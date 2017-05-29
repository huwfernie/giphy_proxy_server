const express = require('express');
const app = express();
const http = require('http');
const json2csv = require('json2csv');
const fs = require('fs');


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
        return {
          date_created: element.date_created,
          likes: element.likes.length,
          title: element.title,
          cover_url: element.cover_url,
          username: element.user.username
        };
      });
      resolve(newArr);  // resolve returns data and continues in the .then() route
    } else {
      reject('Error in secondMethod'); // reject returns 'Error in...' and continues in the .catch() route
    }
  });
  return promise;
}


function csv(inputData){
  return new Promise((resolve) => {
    const fields = ['date_created', 'likes', 'title', 'cover_url', 'username'];
    const csv = json2csv({ data: inputData, fields: fields });

    fs.writeFile('file500.csv', csv, function(err) {
      if (err) throw err;
      // console.log('file saved');
      resolve();
    });
  });
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


app.get('/share.csv', (request, response) => {
  var all = [];


  // const i =1;
  for(let i=1; i<= 5; i++){
    const apiOptionsPages = {
      host: '',
      path: `/share?limit=100&page=${i}`
    };
    httpGet(apiOptionsPages)
      .then((output) => {
        return filterForGetEntires(output);
      })
      .then((output) => {
        all = all.concat(output);
        if (all.length >= 500 ) {
          console.log('done ', all.length);
          // response.json({ entries: all });
          csv(all)
          .then(() => {
            response.download('./file500.csv', '500.csv');
          })
          .catch((output) => {
            failure(output);
          });
        } else {
          console.log('not yet! ', all.length);
        }
      })
      .catch((output) => {
        failure(output);
      });
  }
});

app.listen(3000);
