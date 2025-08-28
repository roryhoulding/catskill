import { hudsonValleySearchUrl } from "../utils/config";
import { listingsParentProcessor } from "../services/listingsParentProcessor";
import { promptInput } from "../prompts/qualifyListing/hudsonValley/v3-1";

listingsParentProcessor(hudsonValleySearchUrl, promptInput, "hudson-valley");
