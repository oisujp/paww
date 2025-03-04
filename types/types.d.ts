type PassData = {
  fields: PassTemplateFields;
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

type PassTemplateProps = {
  name: string;
  labelColor: string;
  logoText: string | null;
  organizationName: string | null;
  foregroundColor: string;
  backgroundColor: string;
  expirationDate: string | null;
  coupon: PassTemplateFields;
  logoUrl: string | null;
  stripUrl: string | null;
  createdAt?: string;
};

type PassTemplateBase = {
  formatVersion: number;
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  labelColor: string;
  foregroundColor: string;
  backgroundColor: string;
};

type PassTemplateFields = {
  headerFields: Field[];
  primaryFields: Field[];
  secondaryFields: Field[];
  auxiliaryFields: Field[];
  backFields: Field[];
};

type Field = {
  key: string;
  label: string;
  value: string;
};
