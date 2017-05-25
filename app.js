const express = require('express');
const app = express();
const http = require('http');

var options = {
  host: 'api.giphy.com',
  path: '/v1/gifs/trending?api_key=dc6zaTOxFJmzC'
};

app.get('/', (request, response) => {
  sendReq();


  // const body = sendReq();
  // console.log('now', body);

  response.json({test2: 'huw'});
});


app.listen(3000);

function  sendReq() {
  let body = [];
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
      // console.log(body);
      // ...and/or process the entire body here.
      // console.log(body);
      return body;
    });
  });
}
