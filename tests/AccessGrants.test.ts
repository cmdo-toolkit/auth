import { AccessGrants } from "../src/Lib/AccessGrants";
import { store } from "./mocks/TestAccessStore";

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("AccessGrants", () => {
  it("should assign new grants", async () => {
    const grants = new AccessGrants("john", "xyz");

    await grants.grant("account", "update").grant("account", "read", ["*"]).grant("account", "delete").commit();

    expect(store).toEqual({
      john: {
        xyz: {
          account: {
            update: true,
            read: ["*"],
            delete: true
          }
        }
      }
    });
  });

  it("should update read permissions", async () => {
    const grants = new AccessGrants("john", "xyz");

    await grants.grant("account", "read", ["*", "!password"]).commit();

    expect(store).toEqual({
      john: {
        xyz: {
          account: {
            update: true,
            read: ["*", "!password"],
            delete: true
          }
        }
      }
    });
  });

  it("should remove update permissions", async () => {
    const grants = new AccessGrants("john", "xyz");

    await grants.deny("account", "delete").commit();

    expect(store).toEqual({
      john: {
        xyz: {
          account: {
            update: true,
            read: ["*", "!password"]
          }
        }
      }
    });
  });
});
