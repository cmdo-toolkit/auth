export type GrantsData = Record<string, GrantsPermissions>;

export type GrantsPermissions = Record<string, GrantActions>;

export type GrantActions = Record<string, GrantValue | GrantValue[]>;

export type GrantValue = Record<string, unknown> | string | boolean | number;

export type GrantOperation<Data = unknown> = SetOperation<Data> | UnsetOperation;

type SetOperation<Data = unknown> = {
  type: "set";
  resource: string;
  action: string;
  data?: Data;
};

type UnsetOperation = {
  type: "unset";
  resource: string;
  action?: string;
};
