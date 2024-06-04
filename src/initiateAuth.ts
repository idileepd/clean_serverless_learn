import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandler } from "aws-lambda";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { phone_number } = JSON.parse(event.body);

  try {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: process.env.USER_POOL_REF,
      AuthFlow: "CUSTOM_AUTH",
      ClientId: process.env.USER_POOL_CLIENT_REF,
      AuthParameters: {
        USERNAME: phone_number,
      },
    });
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Session), // Return the session for use in the next step
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
