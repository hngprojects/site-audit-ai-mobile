
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

