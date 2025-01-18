type PassData = {
  fields: PassFields;
  images: {
    icon: string;
    logo?: string;
    strip?: string;
    background?: string;
  };
  colors: {
    labelColor: string;
    foregroundColor: string;
    backgroundColor: string;
  };
};

type PassProps = {
  templateName: string;
  labelColor: string;
  organizationName: string | null;
  foregroundColor: string;
  backgroundColor: string;
  expirationDate: string | null;
  coupon: PassFields;
  logoBase64: string | null;
  stripBase64: string | null;
  createdAt?: string;
};

type PassBase = {
  formatVersion: number;
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  labelColor: string;
  foregroundColor: string;
  backgroundColor: string;
};

type PassFields = {
  headerFields: Field[];
  primaryFields: Field[];
  secondaryFields: Field[];
  auxiliaryFields: Field[];
  backFields: Field[];
};

type Field = {
  type: "text" | "number" | "date" | "dateTime";
  key: string;
  label: string;
  value: string;
};
