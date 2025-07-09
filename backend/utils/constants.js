// src/config/constants.ts
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.CUSTOMER_ID ||
  !process.env.API_KEY ||
  !process.env.BASE_URL ||
  !process.env.END_POINT_BARCODE_ONLY ||
  !process.env.BARCODE
) {
  console.error("❌ Missing one or more required environment variables.");
  process.exit(1);
}

export const ENV = {
  CUSTOMER_ID: process.env.CUSTOMER_ID,
  API_KEY: process.env.API_KEY,
  BASE_URL: process.env.BASE_URL,
  END_POINT_BARCODE_ONLY: process.env.END_POINT_BARCODE_ONLY,
  BARCODE: process.env.BARCODE,
  MY_PHONE: process.env.MY_PHONE,
  TRANSACTION_ID_ONE: process.env.TRANSACTION_ID_ONE,
  TRANSACTION_ID_TWO: process.env.TRANSACTION_ID_TWO,
  END_POINT_SUB_EMAIL: process.env.END_POINT_SUB_EMAIL,
  END_POINT_START: process.env.END_POINT_START,
  END_POINT_END: process.env.END_POINT_END,
  END_POINT_GET_STATUS: process.env.END_POINT_GET_STATUS,
  END_POINT_GET_RESULTS: process.env.END_POINT_GET_RESULTS,
  END_POINT_GET_TRANS_DATA: process.env.END_POINT_GET_TRANS_DATA,
  END_POINT_GET_JOURNEY: process.env.END_POINT_GET_JOURNEY,
  END_POINT_START_SELFIE: process.env.END_POINT_START_SELFIE,
  END_POINT_END_SELFIE: process.env.END_POINT_END_SELFIE,
  END_POINT_SUB_FRONT: process.env.END_POINT_SUB_FRONT,
  END_POINT_SUB_BACK: process.env.END_POINT_SUB_BACK,
  END_POINT_SUB_BARCODE: process.env.END_POINT_SUB_BARCODE,
  END_POINT_SUB_SELFIE: process.env.END_POINT_SUB_SELFIE,
};

export const SIGNALS = [
  "idcheck",
  "ocr_match",
  "selfie",
  "document_liveness_idrnd",
  "ocr_scan",
];

export const DOCUMENT_TYPE = {
  NA_DL: "na_dl",
  PASSPORT: "passport",
  OTHER: "other",
};

export const CAPTURE_LANGUAGE = {
  EN_US: "en-us",
  FR_CA: "fr-ca",
  ES_MX: "es-mx",
};
