import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
    resources.userPool.usernameConfiguration = {
        caseSensitive: false
    };
    resources.userPool.accountRecoverySetting = {
        recoveryMechanisms: [{name: "verified_email", priority: 1}]
    };
    resources.userPool.aliasAttributes = ["email", "phone_number", "preferred_username"];
}
