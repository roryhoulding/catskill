import { Config } from "../services/config";
import { listingsParentProcessor } from "../services/listingsParentProcessor";
import { promptInput } from "../prompts/qualifyListing/hudsonValley/v3-1";

listingsParentProcessor(Config.hudsonValleySearchUrl, promptInput);
