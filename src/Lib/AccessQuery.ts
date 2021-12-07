import type { AccessGrantsResources } from "../Types/Grants";
import type { AccessPermissionHandler } from "../Types/Query";
import { defaultPermissionHandler } from "../Utils/Permission";
import { AccessPermission } from "./AccessPermission";

export class AccessQuery<
  Resources extends AccessGrantsResources,
  Resource extends keyof Resources,
  Action extends keyof Resources[Resource]
> {
  public readonly resources: Resources;

  constructor(resources: Resources = {} as Resources) {
    this.resources = resources;
    Object.freeze(this);
  }

  public get(resource: Resource, action?: Action) {
    if (action) {
      return this.resources?.[resource]?.[action];
    }
    return this.resources?.[resource];
  }

  public can(action: string, resource: Resource, handler?: AccessPermissionHandler<Resources[Resource][Action]>) {
    const value = this.resources?.[resource]?.[action];
    if (!value) {
      return new AccessPermission({ granted: false });
    }
    if (handler) {
      return handler(value as any);
    }
    return defaultPermissionHandler();
  }
}
