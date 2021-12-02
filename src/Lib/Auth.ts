import { container } from "../Container";
import { AccessControl } from "./AccessControl";

export class Auth {
  public readonly token: string;
  public readonly data: any;
  public readonly access: AccessControl;

  constructor(token: string, data: any, access: AccessControl) {
    this.token = token;
    this.data = data;
    this.access = access;
  }

  /**
   * Resolve the given token and return a new auth instance.
   */
  public static async resolve(value: string, token = container.get("Token")): Promise<Auth> {
    const data = await token.decode(value);
    return new Auth(value, data, await AccessControl.for(data.auditor));
  }

  /**
   * Get a guest authentication instance.
   */
  public static guest(): Auth {
    return new Auth("guest", { auditor: "guest" }, new AccessControl("guest", {}));
  }

  /**
   * Check the auththenticity of the instance.
   */
  public get isAuthenticated() {
    return this.data.auditor !== "guest";
  }

  /**
   * Get auditor identifier from the auth instance.
   */
  public get auditor(): string {
    return this.data.auditor;
  }
}
