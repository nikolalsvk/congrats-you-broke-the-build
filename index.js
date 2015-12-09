var fs = require('fs');
var AWS = require('aws-sdk');
var twilio = require('twilio');

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

    var twilio_account_sid = numbers.twilio.twilio_account_sid;
    var twilio_auth_token = numbers.twilio.twilio_auth_token;
    var twilio_number = numbers.twilio.twilio_number;

    console.log(twilio_account_sid);

    manipulateNumbers(numbers, twilio_account_sid, twilio_auth_token, twilio_number);
  });

  function manipulateNumbers(numbers, twilio_account_sid, twilio_auth_token, twilio_number) {
    if(event.branch_name == "master" && event.result == "failed") {
      var blame = event.commit.author_name;
      var blame_mail = event.commit.author_email;

      var message = "Congrats " + blame + ", you managed to brake master branch on SemaphoreCI! Go and buy some kuglice for the office to make up."

      var client = twilio(twilio_account_sid, twilio_auth_token);
      console.log(twilio_account_sid, twilio_auth_token, twilio_number);

      client.sendSms({
        to: numbers[blame_mail],
        from: twilio_number,
        body: message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) {
          console.log(responseData);
          context.done(null, "Message sent!");
        } else {
          console.log(err);
          context.done(null, "Error has happened, message was not sent!");
        }
      });
    };
  };
}
