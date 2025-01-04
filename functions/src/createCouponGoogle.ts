import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { getGoogleWalletCredential } from "./util";

const classSuffix = "jp.oisu.luckycat.offer";
const issuerId = "3388000000022271791";
const classId = `${issuerId}.${classSuffix}`;

export const createCouponGoogle = onRequest(async (request, response) => {
  const { issuerName, title, provider, barcodeValue } = request.query;
  const googleWalletCredentials = getGoogleWalletCredential();

  const objectId = `${issuerId}.${uuidv4()}`;
  const offerClass = {
    id: `${issuerId}.${classSuffix}`,
    reviewStatus: "APPROVED",
    redemptionChannel: "ONLINE",
    issuerName,
    provider,
    title,
  };
  const newObject = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    barcode: {
      type: "QR_CODE",
      alternateText: barcodeValue,
      value: barcodeValue,
    },
  };
  const claims = {
    iss: googleWalletCredentials.client_email,
    aud: "google",
    origins: [],
    typ: "savetowallet",
    payload: {
      offerClasses: [offerClass],
      offerObjects: [newObject],
    },
  };
  functions.logger.info(`${issuerId}.${objectId}`);

  const token = jwt.sign(claims, googleWalletCredentials.private_key, {
    algorithm: "RS256",
  });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  response.send(saveUrl);
});
