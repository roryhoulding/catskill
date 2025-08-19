import { qualifyListings } from "../services/qualifyListings";
import { sendListingsEmail } from "../services/emailService";
import { ConfigService } from "../services/configService";

async function main(): Promise<void> {
  try {
    // Validate configuration
    ConfigService.validateRequiredConfig();

    // Get qualified listings
    const qualifiedListings = await qualifyListings(
      ConfigService.hudsonValleySearchUrl,
    );

    // Send email notification
    await sendListingsEmail(
      qualifiedListings,
      ConfigService.emailConfig.recipients,
      ConfigService.emailConfig.apiKey,
    );

    console.log(`Processed ${qualifiedListings.length} qualified listings`);
  } catch (error) {
    console.error("Job failed:", error);
    throw error; // Re-throw to ensure job fails properly
  }
}

main();
