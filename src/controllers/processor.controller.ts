export type ProcessingType = "uppercase" | "add_timestamp" | "filter_field";

export const processData = (type: ProcessingType, payload: any) => {
  switch (type) {
    case "uppercase":
      if (typeof payload.text === "string") {
        return { ...payload, text: payload.text.toUpperCase() };
      }
      return payload;

    case "add_timestamp":
      return { ...payload, timestamp: new Date().toISOString() };

    case "filter_field":
      if (payload.fieldToKeep) {
        return { fieldToKeep: payload.fieldToKeep } ;
      }
      return {};

    default:
      return payload;
  }
};