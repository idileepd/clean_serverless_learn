exports.handler = async (event, _context, callback) => {
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
      // Send the OTP using your preferred method, e.g., SMS via SNS
      // For this example, we just echo the code back in the response
      event.response.publicChallengeParameters = { otp: "123456" }; // In reality, generate a real OTP here
      event.response.privateChallengeParameters = { answer: "123456" }; // Store the OTP for verification
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
