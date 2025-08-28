import { ListingContent } from "../types";
import { emailConfig } from "../utils/config";
import { generateDescriptionAndSelectImages } from "./generateDescription";
import { qualifyListings } from "./qualifyListings";
import { sendListingsEmail, EmailTemplate } from "./sendListingsEmail";
import { ResponseInput } from "openai/resources/responses/responses.js";

export async function listingsParentProcessor(
  searchUrl: string,
  promptInput: ResponseInput,
  template: EmailTemplate = "hudson-valley",
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
      emailConfig.recipients,
      emailConfig.apiKey,
      template,
    );

    console.log(`Processed ${qualifiedListings.length} qualified listings`);
  } catch (error) {
    console.error("Job failed:", error);
    throw error;
  }
}
