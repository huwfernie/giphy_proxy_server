const express = require('express');
const app = express();
const http = require('http');

var options = {
  host: 'api.giphy.com',
  path: '/v1/gifs/trending?api_key=dc6zaTOxFJmzC'
};

app.use((request, response, next) => {
  console.log(request.headers);
  next();
});

app.use((request, response, next) => {
  request.chance = Math.random();
  next();
});

app.get('/', (request, response) => {
  // response.json(sendReq());
  response.json({huw: 'huw'});
});



app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
});

app.listen(3000);

function  sendReq() {
  http.get(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      body = JSON.parse(body);
      //console.log(body);
      return body;
      // ...and/or process the entire body here.
    });
  });
}
