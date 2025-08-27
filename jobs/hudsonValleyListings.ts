import { Config } from "../services/config";
import { listingsParentProcessor } from "../services/listingsParentProcessor";

listingsParentProcessor(Config.hudsonValleySearchUrl);
