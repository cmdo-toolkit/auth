import type { GrantsPermissions } from "../Types/Grants";
import type { Permission } from "../Types/Query";
import { AccessPermission } from "./AccessPermission";

export class AccessQuery<
  Permissions extends GrantsPermissions = GrantsPermissions,
  Resource extends keyof Permissions = keyof Permissions,
  Action extends keyof Permissions[Resource] = keyof Permissions[Resource]
> {
  public readonly resources: Permissions;

  constructor(resources: Permissions = {} as Permissions) {
    this.resources = resources;
    Object.freeze(this);
  }

  public get(resource: Resource, action?: Action) {
    if (action) {
      return this.resources[resource][action];
    }
    return this.resources[resource];
  }

  public can<Handler extends Permission>(action: Action, resource: Resource, handler?: Handler) {
    const value = this.resources[resource][action];
    if (!value) {
      return new AccessPermission({ granted: false });
    }
    if (handler) {
      return handler(value);
    }
    return new AccessPermission({ granted: true });
  }
}
