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

export default class ActivationClient {
  public authClient: AuthClient
  public baseUrl: string

  constructor(authClient: AuthClient, baseUrl: string) {
    this.authClient = authClient
    this.baseUrl = baseUrl
  }

  public async createActivation(
    auth: Auth,
    campaignId: number,
    properties: {}
  ): Promise<number> {
    console.log("CREATE ACTIVATION")
    const res = await superagent
      .post(this.baseUrl + "/activation/create")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })  
      .timeout(10000)
      .send({
        campaignId: campaignId,
        properties: properties
      })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return res.campaignId
  }

  public async getActivation(auth: Auth, activationId: number): Promise<Activation> {
    // TODO !!! this is getting returned as a string, not a JSON object
    // works for user, figure out why not for org
    const res = await superagent
      .get(this.baseUrl + "/activation")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .query({ activationId: activationId })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return Activation.fromJSON(res)
  }

  public async updateActivation(
    auth: Auth,
    activationId: number,
    properties: {}
  ): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/activation/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .timeout(10000)
      .send({
        activationId: activationId,
        properties: properties
      })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async deleteActivation(
    auth: Auth,
    activationId: number
  ): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .delete(this.baseUrl + "/activation/delete")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .timeout(10000)
      .send({ activationId: activationId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }
}