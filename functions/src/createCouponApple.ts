import * as crypto from "crypto";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { onInit } from "firebase-functions/v2";
import * as fs from "fs";
import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { PKPass } from "passkit-generator";
import * as path from "path";

onInit(() => {
  admin.initializeApp();
});

const certDirectory = path.resolve(process.cwd(), "certs");
const wwdr = fs.readFileSync(path.join(certDirectory, "wwdr.pem"));
const signerCert = fs.readFileSync(path.join(certDirectory, "signerCert.pem"));
const signerKey = fs.readFileSync(path.join(certDirectory, "signerKey.pem"));

export const createCouponApple = functions.https.onRequest(
  async (request, response) => {
    const { name } = request.query;
    if (!name || typeof name !== "string") {
      return;
    }

    // Feel free to use any other kind of UID here or even read an
    // existing ticket from the database and use its ID
    const passID = crypto
      .createHash("md5")
      .update(`${name}_${Date.now()}`)
      .digest("hex");

    // Generate the pass
    const pass = await PKPass.from(
      {
        model: path.resolve(process.cwd(), "./tmp/example"),
        certificates: {
          wwdr,
          signerCert,
          signerKey,
        },
      },
      {
        serialNumber: passID,
      }
    );

    pass.backFields.push({
      key: "lineItem4",
      label: "Test link",
      value: "https://apple.com",
      dataDetectorTypes: ["PKDataDetectorTypeLink"],
      attributedValue:
        '<a href="https://apple.com">Used literally on iPhone, used correctly on Watch</a>',
    });

    // Adding some settings to be written inside pass.json

    if (Boolean(name)) {
      pass.secondaryFields.push({
        key: "name",
        label: "お名前",
        value: name,
      });
    }

    const tempFilePath = path.join(tmpdir(), "pass.pkpass");
    writeFileSync(tempFilePath, pass.getAsBuffer());

    const bucket = admin.storage().bucket();
    const remoteFilePath = `passes/${passID}.pkpass`;

    const [file] = await bucket.upload(tempFilePath, {
      destination: remoteFilePath,
      contentType: "application/vnd.apple.pkpass",
    });
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    response.setHeader("Content-Type", "application/vnd-apple.pkpass");
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="foobar.pkpass"'
    );

    response.send(publicUrl);
  }
);
