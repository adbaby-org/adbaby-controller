// IMPORTS

// external
import superagent from "superagent"

// adbaby
import {
  Auth,
  User
} from "adbaby-model"

// local
import AuthClient from "../auth/authClient"

// INTERFACE

export default class UserClient {
  public authClient: AuthClient
  public baseUrl: string

  constructor(authClient: AuthClient, baseUrl: string) {
    this.authClient = authClient
    this.baseUrl = baseUrl
  }

  public async getUser(auth: Auth): Promise<User> {
    const res = await superagent
      .get(this.baseUrl + "/user")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .then(res => res.body)
    console.log(res);
    // TODO handle errors
    return User.fromJSON(res)
  }

  public async updateUser(
    auth: Auth,
    displayName: string,
    fistName: string,
    lastName: string
  ): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/user/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ displayName: displayName, firstName: fistName, lastName: lastName })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }
}