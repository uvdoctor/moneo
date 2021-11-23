import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
    resources.userPool.usernameConfiguration = {
        caseSensitive: false
    };
    resources.userPool.accountRecoverySetting = {
        recoveryMechanisms: [{name: "verified_email", priority: 1}]
    };
    resources.userPool.aliasAttributes = ["email", "phone_number", "preferred_username"];
    resources.userPoolClient.preventUserExistenceErrors = "ENABLED";
    resources.userPoolClientWeb.preventUserExistenceErrors = "ENABLED";
    resources.userPoolClient.explicitAuthFlows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_CUSTOM_AUTH"];
    resources.userPoolClientWeb.explicitAuthFlows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_CUSTOM_AUTH"];
}
