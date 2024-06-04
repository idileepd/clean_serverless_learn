import { APIGatewayProxyHandler } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});

export const sendTransactionalMessage: APIGatewayProxyHandler = async (
  event
) => {
  const body = JSON.parse(event.body || "{}");
  const { message, phoneNumber } = body;

  if (!message || !phoneNumber) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required parameters" }),
    };
  }

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
    return {
      statusCode: 200,
      body: JSON.stringify({ messageId: data.MessageId }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send transactional message" }),
    };
  }
};
