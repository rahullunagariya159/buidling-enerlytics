import { Amplify } from "aws-amplify";

Amplify.configure({
  // Auth: {
  //   region: 'ap-south-1',
  //   userPoolId: 'ap-south-1_S42m5ed3P',
  //   userPoolWebClientId: 'jeila6q7hfeksf3uq2e8jhdfb',
  //   mandatorySignIn: false,
  //   oauth: {
  //     domain: 'building-social-pool.auth.ap-south-1.amazoncognito.com',
  //     scope: ['openid', 'aws.cognito.signin.user.admin'],
  //     // redirectSignIn: 'http://localhost:3000/dashboard',
  //     // redirectSignOut: 'http://localhost:3000/',
  //     redirectSignIn: 'https://dev.buildingenerlytics.com/dashboard',
  //     redirectSignOut: 'https://dev.buildingenerlytics.com/',
  //     responseType: 'code'
  //   }
  // }
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_Gbm4J4Kio",
    userPoolWebClientId: "5ea5mmhts3s8if5o3ti05m5o9b",
    mandatorySignIn: false,
    oauth: {
      domain: "building-user-pool.auth.eu-central-1.amazoncognito.com",
      scope: ["openid", "aws.cognito.signin.user.admin"],
      redirectSignIn: "http://localhost:3000/dashboard",
      redirectSignOut: "http://localhost:3000/",
      // redirectSignIn: "https://dev.buildingenerlytics.com/dashboard",
      // redirectSignOut: "https://dev.buildingenerlytics.com/",
      responseType: "code",
    },
  },
});

// const currentConfig = Auth.configure();
