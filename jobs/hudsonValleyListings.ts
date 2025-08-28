import { Config } from "../services/config";
import { listingsParentProcessor } from "../services/listingsParentProcessor";
import { promptInput } from "../prompts/qualifyListing/v3";

listingsParentProcessor(Config.hudsonValleySearchUrl, promptInput);
