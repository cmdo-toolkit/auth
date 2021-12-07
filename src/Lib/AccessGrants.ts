import { container } from "../Container";
import { AccessGrantOperation } from "../Types/Grants";

export class AccessGrants {
  public readonly id: string;
  public readonly acid: string;
  public readonly operations: AccessGrantOperation[] = [];

  private readonly store = container.get("Store");

  constructor(id: string, acid: string) {
    this.id = id;
    this.acid = acid;
  }

  /**
   * Grant access to a specified action under given resource.
   */
  public grant(resource: string, action: string): AccessGrants;
  public grant<T = unknown>(resource: string, action: string, data: T): AccessGrants;
  public grant<T = unknown>(resource: string, action: string, data: T | boolean = true): AccessGrants {
    this.operations.push({ type: "set", resource, action, data });
    return this;
  }

  /**
   * Remove access to a resource or a specific action under given resource.
   */
  public deny(resource: string, action?: string): AccessGrants {
    this.operations.push({ type: "unset", resource, action });
    return this;
  }

  /**
   * Persist the grant operations to persistent access control store.
   */
  public async commit(): Promise<void> {
    await this.store.setGrants(this.id, this.acid, this.operations);
  }
}
