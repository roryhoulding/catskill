// Load environment variables
import dotenv from "dotenv";
import {
  ListingsResponseSchema,
  ListingsResponseType,
  PropertyDetailsResponseSchema,
  PropertyDetails,
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
    // Basic rate limiter, 2 requests per second
    await new Promise((resolve) => setTimeout(resolve, 500));

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

  async getPageOfListingsBySearchUrl(
    searchUrl: string,
    page: number = 1,
  ): Promise<ListingsResponseType> {
    if (!searchUrl) {
      throw new Error("Search URL is required");
    }

    if (page < 1) {
      throw new Error("Page must be 1 or greater");
    }

    const data = await this.makeRequest("/search_url", {
      url: searchUrl,
      page: page.toString(),
    });
    return ListingsResponseSchema.parse(data);
  }

  async getPropertyDetails(zpid: number): Promise<PropertyDetails> {
    if (!zpid) {
      throw new Error("ZPID is required");
    }
    const data = await this.makeRequest("/propertyV2", {
      zpid: zpid.toString(),
    });
    return PropertyDetailsResponseSchema.parse(data);
  }

  async getAllListingsBySearchUrl(
    searchUrl: string,
  ): Promise<ListingsResponseType> {
    if (!searchUrl) {
      throw new Error("Search URL is required");
    }

    // Get the first page to determine total pages
    const firstPage = await this.getPageOfListingsBySearchUrl(searchUrl, 1);

    const totalPages = firstPage.totalPages;

    // If only one page, return the first page result
    if (totalPages <= 1) {
      return firstPage;
    }

    // Fetch all remaining pages sequentially to avoid rate limits
    const remainingPages: ListingsResponseType[] = [];
    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await this.getPageOfListingsBySearchUrl(
        searchUrl,
        page,
      );
      remainingPages.push(pageResult);
    }

    // Combine all results
    const allResults = [
      ...firstPage.results,
      ...remainingPages.flatMap((page) => page.results),
    ];

    return {
      results: allResults,
      resultsPerPage: firstPage.resultsPerPage,
      totalPages: firstPage.totalPages,
      totalResultCount: firstPage.totalResultCount,
    };
  }
}

export const zillowApi = new ZillowClient();
