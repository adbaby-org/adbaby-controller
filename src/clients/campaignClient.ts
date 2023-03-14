// IMPORTS

// external
import superagent from "superagent"

// adbaby
import {
  Auth,
  Campaign
} from "adbaby-model"

// local
import AuthClient from "../auth/authClient"

// INTERFACE

export default class CampaignClient {
  public authClient: AuthClient
  public baseUrl: string

  constructor(authClient: AuthClient, baseUrl: string) {
    this.authClient = authClient
    this.baseUrl = baseUrl
  }

  public async createCampaign(
    auth: Auth,
    publisherOrgId: number,
    advertiserOrgId: number | null,
    properties: {}
  ): Promise<number> {
    const res = await superagent
      .post(this.baseUrl + "/campaign/create")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })  
      .timeout(10000)
      .send({
        publisherOrgId: publisherOrgId,
        advertiserOrgId: advertiserOrgId,
        properties: properties
      })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return res.campaignId
  }

  public async getCampaign(auth: Auth, campaignId: number): Promise<Campaign> {
    // TODO !!! this is getting returned as a string, not a JSON object
    // works for user, figure out why not for org
    const res = await superagent
      .get(this.baseUrl + "/campaign")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .query({ campaignId: campaignId })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return Campaign.fromJSON(res)
  }

  public async updateCampaign(
    auth: Auth,
    campaignId: number,
    advertiserOrgId: number | null,
    properties: {}
  ): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/campaign/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({
        campaignId: campaignId,
        advertiserOrgId: advertiserOrgId,
        properties: properties
      })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async deleteCampaign(auth: Auth, campaignId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .delete(this.baseUrl + "/campaign/delete")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ campaignId: campaignId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async inviteMember(auth: Auth, campaignId: number, email: string, isAdmin: boolean): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .post(this.baseUrl + "/campaign/members/invite")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ campaignId: campaignId, email: email, isAdmin: isAdmin })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async updateMember(auth: Auth, campaignId: number, userId: number, isAdmin: boolean): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/campaign/members/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ campaignId: campaignId, userId: userId, isAdmin: isAdmin })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async removeMember(auth: Auth, campaignId: number, userId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/campaign/members/remove")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ campaignId: campaignId, userId: userId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async confirmMembership(auth: Auth, campaignId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/campaign/members/confirm")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ campaignId: campaignId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }
}