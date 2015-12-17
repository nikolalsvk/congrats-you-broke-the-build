# Short description

Node.js application deployed on AWS Lambda

It is invoked by Semaphore CI API when a build is finished.

If build was somehow broken on master branch on semaphore-front
repository, a message is sent to the one who broke the build.

Made for fun and to show everyone here at Rendered Text that
AWS Lambda can be useful and fun.

Twilio was used to send messages to the users.

# Detailed flow

Semaphore sends and API request to AWS API Gateaway that is connected
to AWS Lambda function. API JSON consists of information about build stats.
For example - who pushed the latest commit, their username, email, status of 
build (passed, failed, stopped) and name of the branch.

Then application gets `numbers.json` file from AWS S3 where I have all the numbers of
employees at Rendered Text. With the email of a user who launched the build,
application finds user's phone number and sends a message telling them that they
broke the master branch, and that they need to buy some sweets for the office to
make up. Text message is sent with Twilio API from the code.

[![Build Status](https://semaphoreci.com/api/v1/projects/5a49f1fa-72f2-415e-9b6d-e69e6c290ee0/625675/badge.svg)](https://semaphoreci.com/nikolalsvk/congrats-you-broke-the-build)
