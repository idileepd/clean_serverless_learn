const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({ region: "us-east-1" }); // Adjust the region as necessary

const publishSNSMessage = async (message, phoneNumber) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    return data.MessageId;
  } catch (err) {
    console.error("Error publishing SNS message:", err);
    return undefined;
  }
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const handler = async (event, _context, callback) => {
  if (event.triggerSource === "DefineAuthChallenge_Authentication") {
    if (event.request.session.length === 0) {
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    } else if (
      event.request.session.length === 1 &&
      event.request.session[0].challengeResult === true
    ) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    }
  } else if (event.triggerSource === "CreateAuthChallenge_Authentication") {
    if (event.request.challengeName === "CUSTOM_CHALLENGE") {
      const otp = generateOTP();
      const phoneNumber = event.request.userAttributes.phone_number; // Assuming the phone number is in user attributes
      await publishSNSMessage(`Your OTP is ${otp}`, phoneNumber);

      event.response.publicChallengeParameters = { otp }; // For testing purposes only. Do not send OTP back in a real scenario
      event.response.privateChallengeParameters = { answer: otp };
      event.response.challengeMetadata = "CUSTOM_CHALLENGE";
    }
  } else if (
    event.triggerSource === "VerifyAuthChallengeResponse_Authentication"
  ) {
    if (
      event.request.challengeAnswer ===
      event.request.privateChallengeParameters.answer
    ) {
      event.response.answerCorrect = true;
    } else {
      event.response.answerCorrect = false;
    }
  }

  callback(null, event);
};

module.exports.handler = handler;
