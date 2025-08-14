// Load environment variables
import dotenv from "dotenv";
import {
  ListingsResponseSchema,
  ListingsResponseType,
  PropertyDetailsResponseSchema,
  PropertyDetailsResponseType,
} from "./zillowSchema";

dotenv.config();

const ZILLOW_API_BASE_URL = "https://zillow56.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "zillow56.p.rapidapi.com";

export class ZillowApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = "ZillowApiError";
  }
}

export class ZillowClient {
  constructor(
    private apiKey: string = RAPIDAPI_KEY || "",
    private baseUrl: string = ZILLOW_API_BASE_URL,
    private host: string = RAPIDAPI_HOST,
  ) {
    if (!this.apiKey) {
      throw new Error("RAPIDAPI_KEY environment variable is required");
    }
  }

  private async makeRequest<T extends Record<string, unknown>>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    // TODO: Proper rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const url = new URL(endpoint, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-rapidapi-key": this.apiKey,
          "x-rapidapi-host": this.host,
        },
      });

      if (!response.ok) {
        throw new ZillowApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ZillowApiError) {
        throw error;
      }

      //   if (error instanceof z.ZodError) {
      //     throw new ZillowApiError(
      //       `Invalid response format: ${error.message}`,
      //       undefined,
      //       error,
      //     );
      //   }

      throw new ZillowApiError(
        `Request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        error,
      );
    }
  }

  async getListingsBySearchUrl(
    searchUrl: string,
  ): Promise<ListingsResponseType> {
    if (!searchUrl) {
      throw new Error("Search URL is required");
    }

    const data = await this.makeRequest("/search_url", { url: searchUrl });
    return ListingsResponseSchema.parse(data);
  }

  async getPropertyDetails(zpid: number): Promise<PropertyDetailsResponseType> {
    if (!zpid) {
      throw new Error("ZPID is required");
    }
    const data = await this.makeRequest("/propertyV2", {
      zpid: zpid.toString(),
    });
    return PropertyDetailsResponseSchema.parse(data);
  }
}

export const zillowApi = new ZillowClient();
