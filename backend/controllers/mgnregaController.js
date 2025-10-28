// controllers/mgnregaController.js
import fetch from "node-fetch";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
  });
}

const db = getFirestore();

// 🔸 Government API constants
// 🔸 Government API constants
const RESOURCE_ID = process.env.RESOURCE_ID;
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY;

// ✅ Fetch from Government API (and cache to Firebase if successful)
export const getDistrictData = async (req, res) => {
  const {
    "api-key": apiKey = DEFAULT_API_KEY,
    "filters[fin_year]": finYear,
    district_name,
    month,
  } = req.query;

  const state = "TAMIL NADU";
  let apiUrl = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&filters[state_name]=${encodeURIComponent(
    state
  )}`;

  if (district_name)
    apiUrl += `&filters[district_name]=${encodeURIComponent(district_name)}`;
  if (finYear) apiUrl += `&filters[fin_year]=${encodeURIComponent(finYear)}`;
  if (month) apiUrl += `&filters[month]=${encodeURIComponent(month)}`;
  apiUrl += `&limit=1000`;

  console.log("🌐 Fetching data from:", apiUrl);

  try {
    // 1️⃣ Fetch from API
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      console.log(`✅ API Success: ${data.records.length} records found.`);

      // 2️⃣ Cache only top 30 records to Firebase to avoid size errors
      const cacheData = data.records.slice(0, 30);
      const cacheRef = db
        .collection("districtData")
        .doc(district_name || "TAMIL NADU");

      cacheRef
        .set({
          finYear: finYear || "latest",
          month: month || "N/A",
          state,
          data: cacheData,
          totalCached: cacheData.length,
          lastUpdated: new Date().toISOString(),
        })
        .then(() =>
          console.log(`📦 Cached ${cacheData.length} records to Firebase`)
        )
        .catch((err) => console.warn("⚠️ Firebase cache error:", err.message));

      // ✅ Respond to frontend with full API data
      return res.json({
        source: "api",
        totalRecords: data.records.length,
        data: data.records,
      });
    } else {
      throw new Error("No records found from API");
    }
  } catch (error) {
    console.warn("⚠️ API Failed:", error.message);

    // 3️⃣ Fallback: Fetch from Firebase cache
    try {
      const districtKey = district_name || "TAMIL NADU";
      const cacheRef = db.collection("districtData").doc(districtKey);
      const cachedSnap = await cacheRef.get();

      if (cachedSnap.exists) {
        console.log(`📦 Serving cached data for ${districtKey}`);
        const cached = cachedSnap.data();
        return res.json({
          source: "firebase",
          totalRecords: cached.data.length,
          data: cached.data,
        });
      } else {
        console.error("❌ No Firebase backup found.");
        return res
          .status(500)
          .json({ message: "API and cache both unavailable." });
      }
    } catch (fbError) {
      console.error("🔥 Firebase fetch failed:", fbError.message);
      return res
        .status(500)
        .json({ message: "Internal error", error: fbError.message });
    }
  }
};

// ✅ States endpoint (currently only Tamil Nadu)
export const getStates = (req, res) => {
  res.json(["TAMIL NADU"]);
};
