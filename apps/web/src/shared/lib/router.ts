import { useParams } from "react-router-dom";

export function useRequiredParam<K extends string>(key: K): string {
  const params = useParams();
  const value = params[key];
  if (!value) {
    throw new Error(`Missing route param: ${key}`);
  }
  return value;
}
