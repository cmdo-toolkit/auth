import { AccessPermission } from "../Lib/AccessPermission";
import type { AccessGrantValue } from "./Grants";

export type AccessQueryHandler<Data extends unknown, Props extends AccessGrantValue> = (data: Data) => AccessPermissionHandler<Props>;

export type AccessPermissionHandler<Value extends unknown> = (value: Value) => AccessPermission;
