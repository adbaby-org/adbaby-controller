// IMPORTS

// external
import superagent from "superagent"

// adbaby
import {
  Auth,
  Organization,
  OrganizationHeader
} from "adbaby-model"

// local
import AuthClient from "../auth/authClient"

// INTERFACE

export default class OrgClient {
  public authClient: AuthClient
  public baseUrl: string

  constructor(authClient: AuthClient, baseUrl: string) {
    this.authClient = authClient
    this.baseUrl = baseUrl
  }

  public async getOrgs(auth: Auth, handle?: string): Promise<OrganizationHeader[]> {
    const res = await superagent
      .get(this.baseUrl + "/orgs")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .query({ handle: handle })
      .then(res => JSON.parse(res.text))
    return res.map((org: any) => OrganizationHeader.fromJSON(org))
  }

  public async createOrg(auth: Auth, handle: string, name: string): Promise<{"status": number, "orgId": number | null, "error": string | null}> {
    const res = await superagent
      .post(this.baseUrl + "/org/create")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ handle: handle, properties: {"name": name}})
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async getOrg(auth: Auth, orgId: number): Promise<Organization> {
    // TODO !!! this is getting returned as a string, not a JSON object
    // works for user, figure out why not for org
    const res = await superagent
      .get(this.baseUrl + "/org")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .query({ orgId: orgId })
      .then(res => JSON.parse(res.text))
    // TODO handle errors
    return Organization.fromJSON(res)
  }

  public async updateOrg(auth: Auth, orgId: number, handle: string, properties: {}): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/org/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId, handle: handle, properties: properties })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async deleteOrg(auth: Auth, orgId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .delete(this.baseUrl + "/org/delete")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async inviteMember(auth: Auth, orgId: number, email: string, isAdmin: boolean): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .post(this.baseUrl + "/org/members/invite")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId, email: email, isAdmin: isAdmin })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async updateMember(auth: Auth, orgId: number, userId: number, isAdmin: boolean): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/org/members/update")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId, userId: userId, isAdmin: isAdmin })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async removeMember(auth: Auth, orgId: number, userId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/org/members/remove")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId, userId: userId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }

  public async confirmMembership(auth: Auth, orgId: number): Promise<{"status": number, "error": string | null}> {
    const res = await superagent
      .put(this.baseUrl + "/org/members/confirm")
      .set("Content-Type", "application/json")
      .auth(auth.accessToken, { type: "bearer" })
      .send({ orgId: orgId })
      .then(res => JSON.parse(res.text))
      .catch(err => JSON.parse(err.response.text))
    return res
  }
}