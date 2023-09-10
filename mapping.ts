import mappingConfig from "./mappingConfig.json";

interface Characteristic {
  name: string;
  value: string;
}

type CharacteristicsMapper = (
  characteristics: Characteristic[],
  supplier: string
) => Promise<Characteristic[]>;

const mapGatewayCharacteristics: CharacteristicsMapper = async (
  characteristics,
  supplier
) => {
  const supplierMappings = mappingConfig[supplier] || []; // Get mappings for the specified supplier.

  const mappedCharacteristics: Characteristic[] = [];

  for (const characteristic of characteristics) {
    const mapping = supplierMappings.find(
      (m) =>
        m.name === characteristic.name && // Match the characteristic name.
        m.value === characteristic.value // Match the characteristic value.
    );

    if (mapping) {
      if (Array.isArray(mapping.destination)) {
        // Handle multiple destination mappings.
        mappedCharacteristics.push(...mapping.destination);
      } else {
        // Handle single destination mapping.
        mappedCharacteristics.push(mapping.destination);
      }
    } else {
      // If no mapping is found, use the original characteristic.
      mappedCharacteristics.push(characteristic);
    }
  }

  return mappedCharacteristics;
};

const mapSupplierCharacteristics: CharacteristicsMapper = async (
  characteristics,
  supplier
) => {
  const supplierMappings = mappingConfig[supplier] || []; // Get mappings for the specified supplier.

  const mappedCharacteristics: Characteristic[] = [];

  for (const characteristic of characteristics) {
    const mapping = supplierMappings.find(
      (m) =>
        m.destination.name === characteristic.name && // Match the characteristic name.
        m.destination.value === characteristic.value // Match the characteristic value.
    );

    if (mapping) {
      if (Array.isArray(mapping.source)) {
        // Handle multiple source mappings.
        mappedCharacteristics.push(...mapping.source);
      } else {
        // Handle single source mapping.
        mappedCharacteristics.push(mapping.source);
      }
    } else {
      // If no mapping is found, use the original characteristic.
      mappedCharacteristics.push(characteristic);
    }
  }

  return mappedCharacteristics;
};

// Example usage:
const gatewayCharacteristics: Characteristic[] = [
  { name: "LINE_ID", value: "12345" },
  { name: "PROFILE", value: "1" },
];

const supplierCharacteristics: Characteristic[] = [
  { name: "LINE_IDENTIFIER", value: "12345" },
  { name: "LINE_PROFILE", value: "ABC/123" },
];

mapGatewayCharacteristics(gatewayCharacteristics, "supplier1").then(
  (mappedToSupplier) => {
    console.log("Mapped to Supplier:");
    console.log(mappedToSupplier);
  }
);

mapSupplierCharacteristics(supplierCharacteristics, "supplier1").then(
  (mappedToGateway) => {
    console.log("Mapped to Gateway:");
    console.log(mappedToGateway);
  }
);
