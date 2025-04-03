import { ServerURL } from "../Constants/urls";
import axios, { AxiosResponse } from "axios";

interface ApiResponse<T = any> {
  isOk: boolean;
  message?: string;
  data?: T;
  id?: string | number;
}

export async function get<T = any>(urlSuffix: string): Promise<ApiResponse<T>> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response: AxiosResponse<T> = await axios.get(ServerURL.prefix + urlSuffix, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`get --> ${urlSuffix} --> response:`, response);
    console.log(`get --> ${urlSuffix} --> data:`, response.data);

    if (response.status === 200) {
      return {
        isOk: true,
        data: response.data,
      };
    }
    return {
      isOk: false,
      message: "Unable to Get Data From The Server",
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function post<T = any>(
  urlSuffix: string,
  payload: any
): Promise<ApiResponse<T>> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(ServerURL.prefix + urlSuffix, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.status === 200) {
      return {
        isOk: true,
        id: data.uniqueID,
        message: data.message,
        data: data,
      };
    }
    return {
      isOk: false,
      message: data.message ?? data.Message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function postFormData<T = any>(
  urlSuffix: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(ServerURL.prefix + urlSuffix, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Remove Content-Type header for FormData, let browser set it with boundary
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status === 200) {
      return {
        isOk: true,
        id: data.uniqueID,
        message: data.message,
        data: data,
      };
    }
    return {
      isOk: false,
      message: data.message ?? data.Message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function put<T = any>(
    urlSuffix: string,
    payload: any
  ): Promise<ApiResponse<T>> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
  
      const response = await fetch(ServerURL.prefix + urlSuffix, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
  
      // Handle empty response
      if (response.status === 204) { // No Content
        return {
          isOk: true,
          message: "Update successful"
        };
      }
  
      // Try to parse JSON only if there's content
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
  
      if (response.ok) {
        return {
          isOk: true,
          message: data.message || "Update successful",
          data: data,
        };
      }
      return {
        isOk: false,
        message: data.message || data.Message || "Update failed",
        data: data,
      };
    } catch (error: any) {
      return {
        isOk: false,
        message: error.message || "An error occurred during update",
      };
    }
  }
export async function deleteM<T = any>(
  urlSuffix: string,
  payload?: any
): Promise<ApiResponse<T>> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(ServerURL.prefix + urlSuffix, options);
    const data = await response.json();
    console.log("delete response:", data);
    if (response.status === 200) {
      return {
        isOk: true,
        message: data.message,
        data: data,
      };
    }
    return {
      isOk: false,
      message: data.message,
      data: data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.message || "An error occurred",
    };
  }
}