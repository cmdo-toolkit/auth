import { container } from "../Container";
import { GuestToken } from "../Providers/GuestToken";
import { Token } from "../Services/Token";
import { AccessControl } from "./AccessControl";

export class Auth {
  public readonly token: Token;
  public readonly access: AccessControl;

  public readonly get: Token["get"];

  constructor(token: Token, access: AccessControl) {
    this.token = token;
    this.access = access;
    this.get = token.get.bind(token);
  }

  /**
   * Resolve the given token and return a new auth instance.
   */
  public static async resolve(value: string, token = container.get("Token", value)): Promise<Auth> {
    return token.decode().then(async (token) => {
      return new Auth(token, await AccessControl.for(token.get("auditor")));
    });
  }

  /**
   * Get a guest authentication instance.
   */
  public static async guest(): Promise<Auth> {
    return new GuestToken().decode().then((token) => {
      return new Auth(token, new AccessControl(token.get("auditor"), {}));
    });
  }

  /**
   * Check the auththenticity of the instance.
   */
  public get isAuthenticated() {
    return this.auditor !== "guest";
  }

  /**
   * Get auditor identifier from the auth instance.
   */
  public get auditor(): string {
    return this.token.get("auditor", "guest");
  }
}
