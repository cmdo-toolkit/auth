import type { GrantOperation, GrantsData } from "../Types/Grants";

export type Store = {
  /**
   * Set access grants for given access control id.
   *
   * @param id         - Storage id.
   * @param acid       - Access control id.
   * @param operations - List of grant operations to perform.
   */
  setGrants(id: string, acid: string, operations: GrantOperation[]): Promise<void>;

  /**
   * Get access control instance for given access control id.
   *
   * @param id - Storage id.
   *
   * @returns access grant data
   */
  getGrants(id: string): Promise<GrantsData>;
};
