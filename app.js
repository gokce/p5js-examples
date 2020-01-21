const express = require('express');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const dateformat = require('dateformat');
const git = require('simple-git');

let app = express();

if (app.get('env') === 'development') {
  let browserSync = require('browser-sync');
  let bs = browserSync.create();

  bs.init({ logSnippet: false });
  bs.watch("public/**/*.*").on("change", bs.reload);

  app.use(require('connect-browser-sync')(bs));
}

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

app.use(bodyParser.json());
app.post('/save/image', (req, res) => {
  let filename = getDateString();
  savePng(req.body.img, filename);
  res.sendStatus(200);
});

app.post('/save-hash/image', (req, res) => {
  saveWithCommitHash(req);
  res.sendStatus(200);
});


// Save PNG
function savePng(img, filename) {
  let data = img.replace(/^data:image\/\w+;base64,/, "");
  let buffer = Buffer.from(data, 'base64');

  fs.writeFile(`output/${filename}.png`, buffer, function(err, result) {
     if(err) console.log('error', err);
   });
}

// Date
function getDateString() {
  const dateFormat = 'yyyy-mm-dd-HH-MM-ss';
  let d = new Date().getTime();
  let offset = (new Date().getTimezoneOffset()) * -60 * 1000;
  let date = new Date(d + offset);
  return dateformat(new Date(), dateFormat);
}

// Git
function saveWithCommitHash(req) {
  git().revparse(["--short", "HEAD"], function(err, data) {
    if (err) {
      console.log("An error ocurred while fething git hash.")
    } else {
      let filename = data;
      savePng(req.body.img, filename);
    }
  });
}

// Create Server
let port = 3000;
http.createServer(app).listen(port, function() {
  console.log('Listening on port ' + port + '...');
});
