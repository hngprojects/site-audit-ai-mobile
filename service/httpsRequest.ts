import { useAuthStore } from "@/store/auth-store";
import { getPersistentDeviceInfo } from "@/utils/device-id";

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



export const scanService = {
  async startScan(
    url: string,
    onEvent: (eventName: string, data: any) => void
  ) {
    if (!url) {
      throw new Error("URL is required");
    }

    try {
      const authState = useAuthStore.getState();
      const isAuthenticated = authState.isAuthenticated;
      const token = authState.token;
      const userId = authState.user?.id;
  
      const deviceInfo = await getPersistentDeviceInfo();
  
      const payload: any = {
        url,
        device_id: deviceInfo.deviceId,
      };
  
      if (isAuthenticated && userId) {
        payload.user_id = userId;
      }
  
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
  
      if (isAuthenticated && token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
  
      const apiUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/scan/start-scan-sse?url=${encodeURIComponent(url)}&device_id=${deviceInfo.deviceId}`;
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
      });
  

  
      if (!response.ok) {
        throw new Error("Failed to start scan.");
      }
  
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
  
      let buffer = "";
  
      //  New: capture first job_id + url from SSE
      let firstJobId: string | null = null;
      let firstUrl: string | null = null;
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";
  
        for (const block of blocks) {
          if (!block.startsWith("event:")) continue;
  
          const lines = block.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"));
          const dataLine = lines.find((l) => l.startsWith("data:"));
  
          if (!eventLine || !dataLine) continue;
  
          const eventName = eventLine.replace("event:", "").trim();
          const dataJson = dataLine.replace("data:", "").trim();
  
          try {
            const parsedData = JSON.parse(dataJson);
  
            //  Capture first job_id once
            if (!firstJobId && parsedData.job_id) {
              firstJobId = parsedData.job_id;
              firstUrl = parsedData.url;
            }
  
            // Forward the SSE event to your UI
            onEvent(eventName, parsedData);
          } catch (err) {
            console.warn("Failed to parse SSE data:", dataJson);
          }
        }
      }
  
      //  Return useful data instead of "true"
      return {
        job_id: firstJobId,
        url: firstUrl,
      };
      
    } catch (error: any) {
       if (error instanceof Error) {
         console.log(error.message)
          throw error; 
        }
      throw new Error('Failed to run scan. Please try again.');
    }
  },
};
