import { qualifyListings } from "../services/qualifyListings";
import { sendListingsEmail } from "../services/sendListingsEmail";
import { Config } from "../services/config";
import { generateDescriptionAndSelectImages } from "../services/generateDescription";
import { ListingContent } from "../types";

async function main(): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings(
      // Config.hudsonValleySearchUrl,
      "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-74.78129482076466%2C%22east%22%3A-74.662848470667%2C%22south%22%3A41.78949673150471%2C%22north%22%3A41.85742360935052%7D%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22price%22%3A%7B%22min%22%3A0%2C%22max%22%3A2000000%7D%2C%22mp%22%3A%7B%22min%22%3A0%2C%22max%22%3A10091%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22doz%22%3A%7B%22value%22%3A%2230%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A13%2C%22customRegionId%22%3A%22462a168ab4X1-CRz5aie3hqao9x_w41n3%22%7D",
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
