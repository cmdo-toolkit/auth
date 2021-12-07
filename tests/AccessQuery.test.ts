import { AccessPermission, PERMISSION_DENIED_MESSAGE } from "../src/Lib/AccessPermission";
import { AccessQuery } from "../src/Lib/AccessQuery";
import { PrescriptionAccessAttributes } from "./mocks/PrescriptionAccessAttributes";

/*
 |--------------------------------------------------------------------------------
 | Mock
 |--------------------------------------------------------------------------------
 */

const query = new AccessQuery({
  patient: {
    read: true
  },
  doctor: {
    read: false
  },
  medicine: {
    prescribe: {
      ibuprofen: 100
    }
  }
});

/*
 |--------------------------------------------------------------------------------
 | Custom Handler
 |--------------------------------------------------------------------------------
 */

type Prescription = {
  type: "ibuprofen" | "cephalexin";
  amount: number;
  doctor: string;
};

type Medications = {
  [type: string]: number;
};

function createPrescription({ type, amount }: Pick<Prescription, "type" | "amount">) {
  return function (medications: Medications) {
    const dosage = medications[type];
    if (!dosage) {
      return new AccessPermission({
        granted: false,
        message: `You are not eligible to prescribe ${type}.`
      });
    }
    if (amount > dosage) {
      return new AccessPermission({
        granted: false,
        message: `Prescribed ${amount} of ${type} exceeds the allowed amount of ${dosage}.`
      });
    }
    return new AccessPermission({
      granted: true,
      attributes: PrescriptionAccessAttributes.for(type)
    });
  };
}

function readPrescription(type: Prescription["type"]) {
  return (granted: boolean) => new AccessPermission({ granted, attributes: PrescriptionAccessAttributes.for(type) });
}

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("AccessQuery", () => {
  describe("when providing action handler", () => {
    it("should allow prescribing ibuprofen 80", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = query.can("prescribe", "medicine", createPrescription(prescription));

      expect(permission.granted).toBeTruthy();
    });

    it("should deny prescribing cephalexin", () => {
      const prescription: Prescription = { type: "cephalexin", amount: 100, doctor: "John Doe" };
      const permission = query.can("prescribe", "medicine", createPrescription(prescription));

      expect(permission.granted).toBeFalsy();
      expect(permission.message).toEqual("You are not eligible to prescribe cephalexin.");
    });

    it("should deny prescribing ibuprofen 120", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 120, doctor: "John Doe" };
      const permission = query.can("prescribe", "medicine", createPrescription(prescription));

      expect(permission.granted).toBeFalsy();
      expect(permission.message).toEqual("Prescribed 120 of ibuprofen exceeds the allowed amount of 100.");
    });

    it("should deny read access to doctors", () => {
      const permission = query.can("read", "doctor");
      expect(permission.granted).toBeFalsy();
      expect(permission.message).toEqual(PERMISSION_DENIED_MESSAGE);
    });

    it("should default to allowing $all when no filter key is provided", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = query.can("read", "patient", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription)).toEqual({ type: "ibuprofen", amount: 80, doctor: "John Doe" });
    });

    it("should filter out prescription amount when accessing as patient", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = query.can("read", "patient", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription, "patient")).toEqual({ type: "ibuprofen", doctor: "John Doe" });
    });

    it("should filter nothing when accessing as doctor", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = query.can("read", "patient", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription, "doctor")).toEqual({ type: "ibuprofen", amount: 80, doctor: "John Doe" });
    });
  });
});
