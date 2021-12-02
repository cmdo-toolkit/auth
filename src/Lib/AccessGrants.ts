import { container } from "../Container";
import { AccessGrantOperation } from "../Types/Grants";

export class AccessGrants {
  public readonly id: string;
  public readonly acid: string;
  public readonly operations: AccessGrantOperation[] = [];

  private readonly store = container.get("Store");

  /**
   * Create a new AccessGrants instance.
   *
   * @param id   - Unique persistent storage id.
   * @param acid - Access control id to modify grants within.
   */
  constructor(id: string, acid: string) {
    this.id = id;
    this.acid = acid;
  }

  /**
   * Grant access to a specified resource action.
   *
   * @param resource - Resource to create a grant for.
   * @param action   - Action to create a grant under.
   * @param data     - (Optional) Grant data. Default: true
   *
   * @returns AccessGrants.
   */
  public grant(resource: string, action: string): AccessGrants;
  public grant<T = unknown>(resource: string, action: string, data: T): AccessGrants;
  public grant<T = unknown>(resource: string, action: string, data: T | boolean = true): AccessGrants {
    this.operations.push({ type: "set", resource, action, data });
    return this;
  }

  /**
   * Remove access to specified resource, or a specific resource action. This removes a previously
   * create grant.
   *
   * @param resource - Resource to deny access to.
   * @param action   - Action to deny access for.
   *
   * @returns AccessGrants.
   */
  public deny(resource: string, action?: string): AccessGrants {
    this.operations.push({ type: "unset", resource, action });
    return this;
  }

  /**
   * Commit the grants to the persistent storage.
   */
  public async commit(): Promise<void> {
    await this.store.setGrants(this.id, this.acid, this.operations);
  }
}
