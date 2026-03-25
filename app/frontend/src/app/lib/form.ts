import { ApiError } from "./http";

export type FieldErrors = Record<string, string>;

export function parseFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError)) return {};
  const maybeData = error.data as { errors?: Record<string, string[] | string> } | undefined;
  const source = maybeData?.errors;
  if (!source || typeof source !== "object") return {};

  const result: FieldErrors = {};
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value[0] || "";
      return;
    }
    if (typeof value === "string") {
      result[key] = value;
    }
  });
  return result;
}
