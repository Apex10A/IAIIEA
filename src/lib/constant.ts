/* eslint-disable */
interface CountryData {
    code: string;
    name: string;
    flag: string;
  }
  
  export const fetchCountryCodes = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
  
      const processedData = data
        .filter((country: any) => country.idd.root)
        .map((country: any) => {
          const code = country.idd.suffixes?.[0]
            ? `${country.idd.root}${country.idd.suffixes[0]}`
            : country.idd.root;
          return {
            code: code.replace(/\+\+/, "+"), // Remove duplicate plus signs
            name: country.name.common,
            flag: country.flags.svg,
          };
        })
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
  
      // Remove duplicates based on country code
      const uniqueData = Array.from(
        new Map(
          processedData.map((item: CountryData) => [item.code, item]),
        ).values(),
      );
  
      return uniqueData;
    } catch (error) {
      console.error("Error fetching country codes:", error);
      return [];
    }
  };
  