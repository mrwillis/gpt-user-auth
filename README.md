# gpt-user-auth

Pulumi example of how to implement user authentication for a custom GPT with a postgres database. It additionally supports saving and retrieving past user conversations to the databse. You can use this to implement your own user authentication for your custom GPT. The flow for the user is as follows:

1. User logs into your custom GPT
2. User provides their email address for login verification
3. User receives a verification code in their email
4. User provides the verification code to the custom GPT
5. The custom GPT verifies the code and loads the user's past conversation data

Here's an example GPT instruction you can use:

> Here's the authentication process: Prompt the user to provide their email address for login verification. Use the sendVerificationCode API to send a verification code to the provided email. Once the user provides the verification code, use the verifyCode API to validate it. If the verification succeeds, warmly welcome the user and inform them that you will load their past conversation data for context. Fetch their previous conversations using the POST /conversation/list API, passing the token obtained during verification. Import this data into the session to tailor responses, discussions, and exercises based on the user's history.
>
> Inform the user that they can save their progress at any time by typing "save," which will save the entire session using the POST /conversation API. First authenticate the user if they are not already authenticated. Ensure the saved data includes both the user's text and the GPT's text, allowing for seamless continuity in future sessions. Tailor future interactions by revisiting themes from past discussions and exercises to ensure continuity and a natural progression in learning. If the user did exercises, also record how well the user completed the exercise.

## Features

- This uses firebase but solely for user ID storage. Firebase is not required and one could just store users in a database. The JWT scheme is custom.
- Stores and retrieves user conversations in a Postgres database with SSL enabled (see the .pem file)
- Uses Amazon SES to send verification codes to users
- In terms of authentication between the lambda and ChatGPT, it uses the custom header `x-api-key` which is set in ChatGPT
- User has to login everytime they start a new session. I currently don't see a way around this because there is effectively no session outside of the custom GPT chat.
- Uses the lambda extension to securely fetch secrets from AWS Parameter Store

## Usage

First set configs. In this project I am using a stack reference to another infra project containing the database which I didn't include. If you're not using stack references, you'll have to change some pulumi files to just fetch from the pulumi config instead.

```bash
pulumi config set fromEmail "your-email@example.com"
pulumi config set rdsEndpoint "your-rds-endpoint"
pulumi config set rdsDbName "your-rds-db-name"
pulumi config set --secret apiKey "your-api-key"
pulumi config set --secret jwtSecret "your-jwt-secret"
pulumi config set --secret rdsUsernameParameterArn "your-rds-username-parameter-arn" # not required if not using stack references   
pulumi config set --secret rdsPasswordParameterArn "your-rds-password-parameter-arn" # not required if not using stack references
pulumi config set --secret firebaseCredentialsParameterArn "your-firebase-credentials-parameter-arn" # not required if not using stack references
```

In `ssm.ts` you have to make sure that the paths of the parameters are correct. Here's an example pulumi file that sets the parameters:

```ts
// Create SSM Parameters with dynamic stack names
const rdsUsernameParameter = new aws.ssm.Parameter("rdsUsername", {
    type: "SecureString",
    name: `/gpt-user-auth/${stack}/DB_USERNAME`,
    value: dbUsername,
});

const rdsPasswordParameter = new aws.ssm.Parameter("rdsPassword", {
    type: "SecureString",
    name: `/gpt-user-auth/${stack}/DB_PASSWORD`,
    value: dbPassword,
});

const firebaseCredentialsParameter = new aws.ssm.Parameter("firebaseCredentials", {
    type: "SecureString",
    name: `/gpt-user-auth/${stack}/FIREBASE_CREDENTIALS`,
    value: config.requireSecret("firebaseCredentials"),
});
```

Then change `ssmParameterPolicy` to use the ARNs of the parameters created above.

Then if all configs are set, you can run

```bash
pulumi up
```

After the infra is set up, you'll need to run the database migrations with:

```bash
npm run migrate up
```

Go into your custom GPT and add the `schema.yaml` file and set the authentication to use API key and set the header to be "x-api-key". There is also a privacy policy that is generated with this project which you can link as well in the custom GPT. Test and make sure the authentication scheme works. As of Dec 31, 2024, the editor is extremely buggy especially with custom actions and using authentication in terms of saving your work. If you're sure the authentication works using some local HTTP client, try simply re-adding the entire action to the custom GPT.

Enjoy!
