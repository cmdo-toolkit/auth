export type AccessGrantsData = Record<string, AccessGrantsResources>;

export type AccessGrantsResources = Record<string, AccessGrantActions>;

export type AccessGrantActions = Record<string, AccessGrantValue | AccessGrantValue[]>;

export type AccessGrantValue = Record<string, unknown> | string | boolean | number;

export type AccessGrantOperation<Data = unknown> = AccessGrantSetOperation<Data> | AccessGrantUnsetOperation;

type AccessGrantSetOperation<Data = unknown> = {
  type: "set";
  resource: string;
  action: string;
  data?: Data;
};

type AccessGrantUnsetOperation = {
  type: "unset";
  resource: string;
  action?: string;
};
