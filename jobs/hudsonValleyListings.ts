import { qualifyListings } from "../services/qualifyListings";
import { sendListingsEmail } from "../services/sendListingsEmail";
import { Config } from "../services/config";
import { generateDescriptionAndSelectImages } from "../services/generateDescription";
import { ListingContent } from "../types";

async function main(): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings(
      Config.hudsonValleySearchUrl,
    );

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

main();
