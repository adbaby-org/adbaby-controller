// IMPORTS

// external
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  GetUserAttributeVerificationCodeCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandOutput,
  SignUpCommand,
  SignUpCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js';
import { CognitoJwtVerifier } from "aws-jwt-verify";

// internal
import { Auth } from 'adbaby-model'

// CONSTANTS

// TODO add these to centralized config file
// support multiple environments
const AWS_REGION = "us-east-1";
const COGNITO_POOL_ID = "us-east-1_SPpttVwSN";
const COGNITO_POOL_CLIENT_ID = "1u39eqh6iqargs0jp0svc81glo";

// INTERFACE

export default class AuthClient {
  public cognitoClient: CognitoIdentityProviderClient;
  public userPool: CognitoUserPool;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
    this.userPool = new CognitoUserPool({
      UserPoolId: COGNITO_POOL_ID,
      ClientId: COGNITO_POOL_CLIENT_ID
    });
  }

  async loadAuth(): Promise<Auth | null> {
    var auth: Auth | null = null;
    if (typeof window !== 'undefined') {
      auth = Auth.fromJSON(JSON.parse(localStorage.getItem("auth") || "{}"));
    }
    if (auth?.accessToken && await this.validateToken(auth.accessToken)) {
      return auth;
    } else {
      localStorage.removeItem("auth");
      return null;
    }
  }

  async signUp(email: string, password: string): Promise<{ output: SignUpCommandOutput | null, error: any }> {
    const command = new SignUpCommand({
      ClientId: COGNITO_POOL_CLIENT_ID,
      Username: email,
      Password: password
    });

    try {
      let output = await this.cognitoClient.send(command);
      return { output, error: null };
    } catch (e) {
      return { output: null, error: e };
    }
  }

  async confirmSignUp(username: string, code: string): Promise<{ output: ConfirmSignUpCommandOutput | null, error: any }> {
    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_POOL_CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    });

    try {
      let output = await this.cognitoClient.send(command);
      return { output, error: null };
    } catch (e) {
      return { output: null, error: e };
    }
  }

  async resendConfirmationCode(username: string): Promise<{ output: ResendConfirmationCodeCommandOutput | null, error: any }> {
    const command = new ResendConfirmationCodeCommand({
      ClientId: COGNITO_POOL_CLIENT_ID,
      Username: username,
    });

    try {
      let output = await this.cognitoClient.send(command);
      return { output, error: null };
    } catch (e) {
      return { output: null, error: e };
    }
  }

  async signIn(username: string, password: string): Promise<Auth | null> {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    try {
      const result = await this.cognitoClient.send(command);
      if (
        result.AuthenticationResult?.AccessToken
        && result.AuthenticationResult?.RefreshToken
        && result.AuthenticationResult?.ExpiresIn
      ) {
        const auth = new Auth(
          username,
          result.AuthenticationResult?.AccessToken,
          result.AuthenticationResult?.RefreshToken,
          Date.now() + (result.AuthenticationResult?.ExpiresIn || 0)
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem("auth", JSON.stringify(auth));
        }
        return auth;
      } else {
        return null;
      }  
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth");
    }
  }

  async validateToken(token: string): Promise<boolean> {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: COGNITO_POOL_ID,
      tokenUse: "access",
      clientId: COGNITO_POOL_CLIENT_ID,
    });
    
    try {
      const payload = await verifier.verify(
        token
      );
      console.log("Token is valid. Payload:", payload);
    } catch {
      console.log("Token not valid!");
      return false;
    }
    return true;
  }
}