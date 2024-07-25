import { getCurrentUser } from "@/api.services";

export default function rootLoader() {
  try {
    return getCurrentUser()
  } catch (error) {
    console.log("error ########## xx", error);
  }
}
