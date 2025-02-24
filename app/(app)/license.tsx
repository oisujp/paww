import licenseFile from "oss-license.json";
import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";

type LicenseValue = {
  name: string;
  version: string;
  description: string;
  licenses: string[];
  copyright: string;
  licenseText: string;
  publisher: string;
};

type License = [key: string, value: LicenseValue];
type LicenseFile = { [key: string]: LicenseValue };

// just for avoiding type error
const isLicenseFile = (raw: unknown): LicenseFile => {
  return raw as LicenseFile;
};

export default function LicenseScreen() {
  const renderItem = ({ item }: { item: License }) => {
    const key = item[0];
    const { licenses, publisher, licenseText, copyright } = item[1];
    return (
      <View className="p-4 text-left text-sm">
        <Text className={`font-bold`}>
          {key} published by {publisher}
        </Text>
        <Text>{licenseText}</Text>
        <Text>{copyright}</Text>
        <Text>{licenses}</Text>
      </View>
    );
  };
  const licenseData: License[] = Object.keys(
    licenseFile as unknown as LicenseFile
  ).map((key) => {
    const license = isLicenseFile(licenseFile)[key] as LicenseValue;
    return [key, license];
  });

  return (
    <View>
      <FlatList
        data={licenseData}
        renderItem={renderItem}
        contentContainerClassName="bg-white rounded-lg"
      />
    </View>
  );
}
