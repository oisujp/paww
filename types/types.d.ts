type PassTemplateProps = {
  name: string;
  labelColor: string;
  logoText: string | null;
  organizationName: string | null;
  foregroundColor: string;
  backgroundColor: string;
  expirationDate: string | null;
  coupon: PassTemplateFields;
  caveats?: string | null;
  logoUrl: string | null;
  stripUrl: string | null;
  createdAt?: string;
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
