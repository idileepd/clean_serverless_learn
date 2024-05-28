// import { CloudWatchLogsEvent } from "aws-lambda";

// export const handler = async (event: CloudWatchLogsEvent) => {
//   const { request, response } = event as any;
//   const { userPoolId, userName, callerContext, triggerSource } = request;
//   console.log("token Patcher info", request, response);
//   console.log(userPoolId, userName, callerContext, triggerSource);
//   const { idToken } = response;

//   // Modify the ID token context
//   const modifiedIdToken = {
//     ...idToken,
//     "custom:myCustomClaim": "myCustomValue",
//   };

//   return {
//     statusCode: 200,
//     response: {
//       ...response,
//       idToken: modifiedIdToken,
//     },
//   };
// };

// import { Context } from "aws-lambda";

// interface CognitoPreTokenGenerationEvent {
//   version: string;
//   triggerSource: string;
//   region: string;
//   userPoolId: string;
//   userName: string;
//   callerContext: {
//     awsSdkVersion: string;
//     clientId: string;
//   };
//   request: {
//     userAttributes: { [key: string]: string };
//     groupConfiguration: {
//       groupsToOverride: string[];
//       iamRolesToOverride: string[];
//       preferredRole: string;
//     };
//   };
//   response: {
//     claimsOverrideDetails?: {
//       claimsToAddOrOverride?: { [key: string]: string };
//       claimsToSuppress?: string[];
//     };
//   };
// }

// export const handler = async (
//   event: CognitoPreTokenGenerationEvent,
//   context: Context
// ): Promise<CognitoPreTokenGenerationEvent> => {
//   console.log("called trigger");
//   console.log(event, context);
//   if (event.triggerSource === "TokenGeneration_HostedAuth") {
//     event.response = {
//       claimsOverrideDetails: {
//         claimsToAddOrOverride: {
//           "custom:role": "admin", // example of adding a custom claim
//         },
//       },
//     };
//   }

//   return event;
// };

// exports.handler = async (event: any) => {
//   console.log(event);
//   // Modify the token here
//   event.response = {
//     claimsOverrideDetails: {
//       claimsToAddOrOverride: {
//         // Add custom claims here
//         "custom:role": "user",
//         "custom:additionalData": "someValue",
//       },
//     },
//   };

//   return event;
// };

// src/tokenPatcher.js

const handler = async (event) => {
  console.log("TEST !! --", event);
  // Modify the token response as needed
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        // Add custom claims here
        test: "test-data",
        "custom:additionalData": "someValue",
      },
    },
  };

  return event;
};

module.exports.handler = handler;
