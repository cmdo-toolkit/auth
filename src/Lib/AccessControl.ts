import { container } from "../Container";
import type { GrantsData } from "../Types/Grants";
import { AccessGrants } from "./AccessGrants";
import { AccessQuery } from "./AccessQuery";

export class AccessControl {
  public readonly id: string;
  public readonly data: GrantsData;

  constructor(id: string, data: GrantsData = {}) {
    this.id = id;
    this.data = data;
  }

  /**
   * Get AccessControl instance for given id.
   */
  public static async for(id: string, store = container.get("Store")): Promise<AccessControl> {
    return new AccessControl(id, await store.getGrants(id));
  }

  /**
   * Retrieve access query instance for a specific access control id within the
   * current access control instance.
   */
  public get(acid: string): AccessQuery {
    return new AccessQuery(this.data[acid]);
  }

  /**
   * Get AccessGrants instance.
   */
  public grants(acid: string): AccessGrants {
    return new AccessGrants(this.id, acid);
  }

  /**
   * Get the acccess control grants data.
   */
  public toJSON(): GrantsData {
    return { ...this.data };
  }
}
