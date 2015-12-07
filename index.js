var fs = require('fs');
var AWS = require('aws-sdk');

exports.handler = function(event, context) {
  console.log("JSON API from Semaphore: %j", event);

  AWS.config.apiVersions = {
    s3: '2006-03-01'
  }

  console.log("GET numbers.json from S3 bucket");

  var s3 = new AWS.S3({region: 'us-west-2'});
  var params = {Bucket: 'congrats-you-broke-the-build', Key: 'numbers.json'};

  s3.getObject(params, { stream: true }, function(err, data) {
    if(err) console.log(err, err.stack); // an error has happened

    console.log("Successfully read file from S3");
    fs.writeFile('numbers.json', data, function(err) {
      if(err) console.log(err, err.stack);
    });
    console.log("Written contents of S3 file to numbers.json");

    console.log("Finished GET numbers.json from S3 Bucket");

    var numbersNonJson = fs.readFileSync("numbers.json");
    var numbers = JSON.parse(numbersNonJson);

    console.log("Numbers from S3: %j", numbers);
  });
};
