# Secret project

Node.js application deployed on AWS Lambda

It is invoked by Semaphore CI API when a build is finished.

If build was somehow broken on master branch on semaphore-front
repository, a message is sent to the one who broke the build.

Made for fun and to show everyone here at Rendered Text that
AWS Lambda can be useful.

Twilio was used to send messages to the users.

# Detailed flow

Semaphore sends and API request to AWS API Gateaway that is connected
to AWS Lambda function. API consists of information about build stats.
For example - who commited last, their username, email, status of build
(passed, failed, stopped) and name of the branch.

Application gets `numbers.json` file from AWS S3 where I have all the numbers of
employees at Rendered Text. With the email of a user who launched the build,
application finds its phone number and sends a message telling them that they
broke the master branch, and that they need to buy some sweets for the office to
make up. Twilio client is used to send a message to a specific number.
