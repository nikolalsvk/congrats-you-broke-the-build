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
    if(err) console.log(err, err.stack); // an error has happened on AWS

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

      // message that is sent to the one who broke the master branch
      var message = "Congrats " + blame + ", you managed to brake master branch on SemaphoreCI! Go and buy some kuglice for the office to make up."

      twilioHandler(numbers, message);
    };
  };

  function twilioHandler(numbers, message) {
    // twilio params
    var twilio_account_sid = numbers.twilio.twilio_account_sid;
    var twilio_auth_token = numbers.twilio.twilio_auth_token;
    var twilio_number = numbers.twilio.twilio_number;

    var client = twilio(twilio_account_sid, twilio_auth_token);

    // Send SMS
    client.sendSms({
      to: numbers[blame_mail],
      from: twilio_number,
      body: message
    }, function(err, responseData) { // this function is executed when a response is received from Twilio
      if (!err) {
        console.log(responseData);
        context.done(null, "Message sent to " + numbers[blame_mail] + "!");
      } else {
        console.log(err);
        context.done(null, "Error has happened, message was not sent!");
      }
    });
  };
}
