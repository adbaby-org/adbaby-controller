// IMPORTS

// external

// local
import AuthClient from "./auth/authClient"
import UserClient from "./clients/userClient"
import OrgClient from "./clients/orgClient"
import CampaignClient from "./clients/campaignClient"
import ActivationClient from "./clients/activationClient"
import CommentClient from "./clients/commentClient"

// INTERFACE

export default class AdbabyClient {
  public baseUrl: string
  public authClient: AuthClient
  public userClient: UserClient
  public orgClient: OrgClient
  public campaignClient: CampaignClient
  public activationClient: ActivationClient
  public commentClient: CommentClient

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.authClient = new AuthClient()
    this.userClient = new UserClient(this.authClient, this.baseUrl)
    this.orgClient = new OrgClient(this.authClient, this.baseUrl)
    this.campaignClient = new CampaignClient(this.authClient, this.baseUrl)
    this.activationClient = new ActivationClient(this.authClient, this.baseUrl)
    this.commentClient = new CommentClient(this.authClient, this.baseUrl)
  }
}