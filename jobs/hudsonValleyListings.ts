import { qualifyListings } from "../services/qualifyListings";
import { sendListingsEmail } from "../services/sendListingsEmail";
import { Config } from "../services/config";

async function main(): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings(
      Config.hudsonValleySearchUrl,
    );

    await sendListingsEmail(
      qualifiedListings,
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
