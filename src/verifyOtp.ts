import {
  CognitoIdentityProviderClient,
  AdminRespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandler } from "aws-lambda";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { session, otp, phone_number } = JSON.parse(event.body);

  try {
    const command = new AdminRespondToAuthChallengeCommand({
      UserPoolId: process.env.USER_POOL_REF,
      ChallengeName: "CUSTOM_CHALLENGE",
      ClientId: process.env.USER_POOL_CLIENT_REF,
      ChallengeResponses: {
        USERNAME: phone_number,
        ANSWER: otp,
      },
      Session: session,
    });
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response.AuthenticationResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
