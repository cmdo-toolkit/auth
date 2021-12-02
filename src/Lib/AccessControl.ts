import { container } from "../Container";
import { AccessGrantsData } from "../Types/Grants";
import { AccessGrants } from "./AccessGrants";
import { AccessQuery } from "./AccessQuery";

export class AccessControl {
  public readonly id: string;
  public readonly data: AccessGrantsData;

  /**
   * Create a new AccessControl instance.
   *
   * @param id     - Unique persistent storage id.
   * @param grants - Access control grants.
   */
  constructor(id: string, data: AccessGrantsData = {}) {
    this.id = id;
    this.data = data;
  }

  /**
   * Get AccessControl instance.
   *
   * @param id - Access control id.
   *
   * @returns AccessControl.
   */
  public static async for(id: string, store = container.get("Store")): Promise<AccessControl> {
    return new AccessControl(id, await store.getGrants(id));
  }

  /**
   * Get AccessQuery instance for the provided access control id.
   *
   * @param acid - Access control id.
   *
   * @returns AccessQuery.
   */
  public get(acid: string): AccessQuery {
    return new AccessQuery(this.data[acid]);
  }

  /**
   * Get AccessGrants instance.
   *
   * @param acid - Access control id.
   *
   * @returns AccessGrants.
   */
  public grants(acid: string): AccessGrants {
    return new AccessGrants(this.id, acid);
  }

  /**
   * Get the acccess control grants.
   *
   * @returns AccessGrantsData.
   */
  public toJSON(): AccessGrantsData {
    return this.data;
  }
}
