// IMPORTS

// external
import superagent from "superagent"

// adbaby
import {
  Auth,
  Activation
} from "adbaby-model"

// local
import AuthClient from "../auth/authClient"

// INTERFACE

export default class CommentClient {
  public authClient: AuthClient
  public baseUrl: string

  constructor(authClient: AuthClient, baseUrl: string) {
    this.authClient = authClient
    this.baseUrl = baseUrl
  }

  public async createComment(
    auth: Auth,
    campaignId: number,
    activationId: number | null,
    parentId: number | null,
    text: string,
  ): Promise<number> {
    const res = await superagent
      .post(this.baseUrl + "/comment/create")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })  
      .timeout(10000)
      .send({
        campaignId: campaignId,
        activationId: activationId,
        parentId: parentId,
        text: text
      })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return res.commentId
  }
}