import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";
import cors from "cors";
import {
  ENV,
  SIGNALS,
  DOCUMENT_TYPE,
  CAPTURE_LANGUAGE,
} from "./utils/constants.js";
import { parse } from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // or '*' for all origins (not recommended in production)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "customer-id", "signature", "Accept"],
  })
);

app.use(express.json());

app.post("/api/start", async (req, res) => {
  try {
    const { CUSTOMER_ID, API_KEY, BASE_URL, END_POINT_START } = ENV;
    const { NA_DL } = DOCUMENT_TYPE;
    const { EN_US } = CAPTURE_LANGUAGE;

    if (!CUSTOMER_ID || !API_KEY || !BASE_URL || !END_POINT_START) {
      return res.status(400).json({
        success: false,
        message: "Something is missing in the API composition",
      });
    }

    const payload = {
      public_data: {
        capture_language: EN_US,
        qr_breakpoint_px: 700,
      },
      private_data: {
        ttl: 10,
        document_type: NA_DL,
        signals: SIGNALS,
        return_capture_url: true,
      },
    };

    const payloadString = JSON.stringify(payload);
    const base64EncodedPayload = Buffer.from(payloadString).toString("base64");

    const hmac = crypto.createHmac("sha256", API_KEY);
    hmac.update(base64EncodedPayload);

    const signature = "sha256=" + hmac.digest("hex");

    const headers = {
      "customer-id": CUSTOMER_ID,
      signature: signature,
      Accept: "application/json",
    };

    const response = await axios.post(
      BASE_URL + END_POINT_START,
      base64EncodedPayload,
      { headers }
    );

    const decoded = Buffer.from(response.data, "base64").toString("utf8");
    const parseData = JSON.parse(decoded);

    res.json(parseData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Scan start failed" });
  }
});

app.post("/api/send-capture-sms", async (req, res) => {
  const { CUSTOMER_ID, API_KEY, BASE_URL, END_POINT_START } = ENV;
  const { NA_DL } = DOCUMENT_TYPE;
  const { EN_US } = CAPTURE_LANGUAGE;
  const {
    application_id,
    phone_number,
    document_type,
    capture_language,
    signals,
  } = req.body;

  console.log("Received request to send capture SMS:", req.body);

  if (!phone_number) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required." });
  }

  try {
    const payload = {
      public_data: {
        capture_language: capture_language,
      },
      private_data: {
        ttl: 10,
        document_type: document_type,
        signals: signals,
        send_link: {
          type: "sms",
          to: phone_number,
          body: "PurpleCheck ✔️: Fast & Secure ID Validation  ",
        },
        user_defined: {
          application_id: application_id,
        },
      },
    };

    console.log("Payload to be sent:", payload);

    const payloadString = JSON.stringify(payload);
    const base64EncodedPayload = Buffer.from(payloadString).toString("base64");

    const hmac = crypto.createHmac("sha256", API_KEY);
    hmac.update(base64EncodedPayload);

    const signature = "sha256=" + hmac.digest("hex");

    const headers = {
      "customer-id": CUSTOMER_ID,
      signature: signature,
      Accept: "application/json",
    };

    console.log("Headers to be sent:", headers);

    const response = await axios.post(
      BASE_URL + END_POINT_START,
      base64EncodedPayload,
      { headers }
    );

    const decoded = Buffer.from(response.data, "base64").toString("utf8");
    const parseData = JSON.parse(decoded);
    console.log("Response from API:", parseData);

    res.json(parseData);
  } catch (err) {
    // console.error("Error sending SMS:", err.message);
    // res.status(500).json({ success: false, message: "Failed to send link" });

    if (axios.isAxiosError(err)) {
      console.error("❌ Axios error status:", err.response?.status);
      console.error("❌ Axios error headers:", err.response?.headers);
      console.error("❌ Axios error data:", err.response?.data);
    } else {
      console.error("❌ Unexpected error:", err);
    }

    res.status(500).json({ success: false, message: "Failed to send link" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on: http://localhost:${PORT}/`);
});
