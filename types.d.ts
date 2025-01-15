type PassData = {
  fields: {
    headerFields: Field[];
    primaryFields: Field[];
    secondaryFields: Field[];
    auxiliaryFields: Field[];
    backFields: Field[];
  };
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

type PassBase = {
  formatVersion: number;
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  labelColor: string;
  foregroundColor: string;
  backgroundColor: string;
};

type Field = {
  type: "text" | "number" | "date" | "dateTime";
  label: string;
  value: string;
};
