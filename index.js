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

  s3.getObject(params, function(err, data) {
    if(err) console.log(err, err.stack); // an error has happened

    console.log("Successfully read file from S3");
    var numbers = JSON.parse(data.Body);
    console.log(numbers);

    console.log("Finished GET numbers.json from S3 Bucket");

    manipulateNumbers(numbers);
  });

  function manipulateNumbers(numbers) {
    if(event.branch_name == "master" && event.result == "failed") {
      var blame = event.commit.author_name;
      var blame_mail = event.commit.author_email;
      var number = numbers[blame_mail];
      console.log("Congrats " + blame + ", you broke the build! Go and buy some kuglice for the office to make up.");
      console.log(number);
    };
  };
};
