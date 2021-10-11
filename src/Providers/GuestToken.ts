import { Token } from "../Services/Token";

export class GuestToken extends Token {
  constructor() {
    super("");
  }

  public async decode(): Promise<this> {
    this.data = { auditor: "guest" };
    return this;
  }

  public async verify(): Promise<boolean> {
    return false;
  }
}
