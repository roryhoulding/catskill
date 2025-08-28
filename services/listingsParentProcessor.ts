import { ListingContent } from "../types";
import { Config } from "./config";
import { generateDescriptionAndSelectImages } from "./generateDescription";
import { qualifyListings } from "./qualifyListings";
import { sendListingsEmail } from "./sendListingsEmail";
import { ResponseInput } from "openai/resources/responses/responses.js";

export async function listingsParentProcessor(
  searchUrl: string,
  promptInput: ResponseInput,
): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings(searchUrl, promptInput);

    const listingsContent: ListingContent[] = await Promise.all(
      qualifiedListings.map(async (listing) => {
        const content = await generateDescriptionAndSelectImages(listing);
        return {
          listing,
          content,
        };
      }),
    );

    await sendListingsEmail(
      listingsContent,
      Config.emailConfig.recipients,
      Config.emailConfig.apiKey,
    );

    console.log(`Processed ${qualifiedListings.length} qualified listings`);
  } catch (error) {
    console.error("Job failed:", error);
    throw error;
  }
}
