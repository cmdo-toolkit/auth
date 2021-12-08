import { AccessPermission } from "../Lib/AccessPermission";
import type { GrantValue } from "./Grants";

export type Query<Data extends GrantValue, Props extends GrantValue> = (data: Data) => Permission<Props>;

export type Permission<Props extends GrantValue = any> = (props: Props) => AccessPermission;
