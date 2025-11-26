import { useAuthStore } from "@/store/auth-store";




export const getAllCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2,region"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();
    return data;  
  } catch (error) {
    console.error("Error fetching countries:", error);
    return null; 
  }
};

export const getAllServerSiteRecords = async () => {
  try {
    const token = useAuthStore.getState().token; 

    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      "https://api.staging.tokugawa.emerj.net/api/v1/sites",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch site records: ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching server site records:", error);
    return null;
  }
};
