import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import jwt from "npm:jsonwebtoken@9.0.2";
import { v4 as uuidv4 } from "npm:uuid@11.0.3";

const credentials = {
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBc78+By/HAf1f\neFHCLVBb1zbm32VRF/9BlcsQaLZeazlmLAuGJ1uSKcu+XlOXzLusDd4BLx9tJ7hc\n635GDA5irDpWnTi6LZ7OtcXP1UneAQnXFg5vtDP90j7doi/VZvEnNmUjKzb0DM1J\nyHZUqXbuoX5eqiDmIR0jFEJyZJNtqlj8yS1TfzQcWIriya5YjDnmUZeJc4y1TjWl\nyEFqj/VxlSSTX4rnv/4pIcn8TyeHZfRBP+SOXPdvmAShnGulQqEOzF+8njMV/rIQ\nBbGE0/1378SeV7rRwMzycJNtDZCxQzMJcIc0IzFI6KfoKliNoAp714SXXJfkh5Yt\nz0ko9BnFAgMBAAECggEABYXJm4OkSyxVAuWkXQSHb6/Dqx5V9OehZu78cf+w/IvF\nOaYfiBke03dPRu1aTEkH5a2+PRf8gjAEdQIPMZLgG6+83cKQ1hYZLbsYSu75fToz\nXKSgewV1URVU9Rxhs6FD6rq7To4TMy8bzg816QQcoJTu80J1qh56mfayUFi0jQiC\n/4d1V4tvl0SxpUfPA9lX279osr1M977BzvipwoGDGVXsxstZIPxIvQeFmDnl9r1i\nAsFhSt3rMn2km/88yRys1Fv53FQCHrWAzUe5a03KpuonImvm6Spz3DGlYfMj8IcA\n/CIo8+l20dD2fJi5LPuD0b/Ap5e9ikKKEwFdao4WiwKBgQDimnd5gv7xJ9xSoE3V\nSJWJil1eL8mwMveQYrca0A2i8Uyv9b2I0MewmHgyEXVjNmTIUpzU4VGWYbuhLhY0\n7ER4QpbjBv3Xwzv2FEaXbarhdCbbGxCTq8Ifirm+xA6F/6yWCiOXhXjQrHf/qBkL\nxhxslUyaYJ/L2Qorp8ln2wCJzwKBgQDajFKAfitUdf7REE/2jBuYUD9rdXC0z/B+\niXrcGwYp4h+RJOvquWjLvQ7DODgu5fIqBuZ0FeLl2ceYmbsPYAnxzoNGRJpS4OQh\nFPV0eRAxWgZDnYFbrpmB2nwZtRLCsCtMJBkOUo0I38pY4+cv8sj81aTeAhn4Xj3u\nD3K6zDTMKwKBgAsttZEf/jWlUsAculo4L3BOjBaWYuu3R/EufXvsIZAVOURA6i2y\npvc2Pk+x/sl7KHOdZ7E0wFKb1aa44E2SDjqkhk8CzEj1j6KvE2Bq/5AJq9UJO8Md\nKQFnVYxsnY7MsxXfwCu8YN5ic7T/9ORYzJQqtVG0TI3A0jifGVdvPVKPAoGABCpC\ndEJzTvPEvHVEIN3AtOFqpACj+j4wRikWl1VIg8nUci6y9FE+Rwu+WUgcAgDN4bEp\n+TJllZ3V6PmdEAjzh5E4/UDXdBbnIh5FI0gfX+FoVyeMTJQCRvBEBzVlOyKiYJwb\ngiNenrmtII6PXGGTJQZpUvXVSt947K2MsTStGOsCgYEAxbxHOm/wntuxyjImfGVw\nzdDPHn2xid6ILo3gbn5U+GVkwhpsCVH3RUGhqS44Qmfh5smqgd7WDkfH5A3smvFi\nkILKzQykqgH7+6diDTLYkkWkbJPopYntqv21KtVsCeFwqHim2BFjne08SkfcvMGp\ntdCxWKIUsmEp3Elof5nk7J4=\n-----END PRIVATE KEY-----\n",
  client_email: "google-wallet-dev@oisu-dev.iam.gserviceaccount.com",
};
const classSuffix = "jp.oisu.luckycat.offer";
const issuerId = "3388000000022271791";
const classId = `${issuerId}.${classSuffix}`;

export function createCouponPassAndroid(params: {
  issuerName: string;
  title: string;
  provider: string;
  barcodeValue: string;
}) {
  const { issuerName, title, provider, barcodeValue } = params;
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
    iss: credentials.client_email,
    aud: "google",
    origins: [],
    typ: "savetowallet",
    payload: {
      offerClasses: [offerClass],
      offerObjects: [newObject],
    },
  };
  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256",
  });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
}
