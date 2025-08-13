// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Environment configuration
const ZILLOW_API_BASE_URL = "https://zillow56.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "zillow56.p.rapidapi.com";

// Custom error class
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

  async getListingsBySearchUrl(searchUrl: string): Promise<unknown> {
    if (!searchUrl) {
      throw new Error("Search URL is required");
    }

    return this.makeRequest("/search_url", { url: searchUrl });
  }

  //   /**
  //    * Fetch detailed information for a specific property
  //    * @param zpid - The Zillow Property ID
  //    * @returns Promise<ZillowPropertyDetails>
  //    */
  //   async getPropertyDetails(zpid: string): Promise<ZillowPropertyDetails> {
  //     if (!zpid) {
  //       throw new Error("ZPID is required");
  //     }

  //     return this.makeRequest(
  //       "/propertyV2",
  //       { zpid },
  //       ZillowPropertyDetailsSchema,
  //     );
  //   }
}

// Export a default instance
export const zillowApi = new ZillowClient();

// // Validation schemas for API responses
// const ZillowListingSchema = z.object({
//   zpid: z.string().optional(),
//   address: z.string().optional(),
//   price: z.string().optional(),
//   bedrooms: z.number().optional(),
//   bathrooms: z.number().optional(),
//   livingArea: z.string().optional(),
//   lotSize: z.string().optional(),
//   yearBuilt: z.number().optional(),
//   propertyType: z.string().optional(),
//   listingStatus: z.string().optional(),
//   daysOnZillow: z.number().optional(),
//   url: z.string().optional(),
//   imgSrc: z.string().optional(),
//   latitude: z.number().optional(),
//   longitude: z.number().optional(),
// });

// const ZillowSearchResponseSchema = z.object({
//   searchResults: z.array(ZillowListingSchema).optional(),
//   totalResults: z.number().optional(),
//   error: z.string().optional(),
// });

// const ZillowPropertyDetailsSchema = z.object({
//   zpid: z.string().optional(),
//   address: z
//     .object({
//       streetAddress: z.string().optional(),
//       city: z.string().optional(),
//       state: z.string().optional(),
//       zipcode: z.string().optional(),
//     })
//     .optional(),
//   price: z
//     .object({
//       current: z.number().optional(),
//       currency: z.string().optional(),
//     })
//     .optional(),
//   bedrooms: z.number().optional(),
//   bathrooms: z.number().optional(),
//   livingArea: z.number().optional(),
//   lotSize: z.number().optional(),
//   yearBuilt: z.number().optional(),
//   propertyType: z.string().optional(),
//   description: z.string().optional(),
//   images: z.array(z.string()).optional(),
//   latitude: z.number().optional(),
//   longitude: z.number().optional(),
//   error: z.string().optional(),
// });

// // Type definitions
// export type ZillowListing = z.infer<typeof ZillowListingSchema>;
// export type ZillowSearchResponse = z.infer<typeof ZillowSearchResponseSchema>;
// export type ZillowPropertyDetails = z.infer<typeof ZillowPropertyDetailsSchema>;
