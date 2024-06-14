import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandler } from "aws-lambda";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { email } = JSON.parse(event.body);

  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: process.env.USER_POOL_REF,
      Username: email,
      UserAttributes: [
        // { Name: "custom:phoneNumber", Value: phone_number },

        { Name: "email", Value: email },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS", // Suppress the default email sending by Cognito
    });
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
