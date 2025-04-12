import { getUserAttributes } from "../services/apiService";

export const fetchUserAttributes = async (
  userId: string,
  setDescription: (value: string) => void,
  setPhone: (value: string) => void,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void,
  setOriginalDescription: (value: string) => void,
  setOriginalPhone: (value: string) => void
) => {
  setLoading(true);
  try {
    const response = await getUserAttributes(userId);
    const { description = "Not assigned", phone = "Not assigned" } =
      response.data;

    setDescription(description);
    setPhone(phone);
    setOriginalDescription(description);
    setOriginalPhone(phone);
  } catch {
    setError("Failed to load user data");
  } finally {
    setLoading(false);
  }
};
