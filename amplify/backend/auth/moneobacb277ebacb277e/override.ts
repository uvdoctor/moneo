import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
    resources.userPool.usernameConfiguration = {
        caseSensitive: false
    } 
}
