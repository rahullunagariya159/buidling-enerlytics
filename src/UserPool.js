import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-central-1_Gbm4J4Kio',
  ClientId: '5ea5mmhts3s8if5o3ti05m5o9b',
  // ----
  // UserPoolId: 'ap-south-1_wFlMyCjHE',
  // ClientId: '5qfc54kl2jcb99va74e2jgue9u',
};

export default new CognitoUserPool(poolData);
