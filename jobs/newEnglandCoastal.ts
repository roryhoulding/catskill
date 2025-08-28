import { newEnglandCoastalSearchUrl } from "../utils/config";
import { listingsParentProcessor } from "../services/listingsParentProcessor";
import { promptInput } from "../prompts/qualifyListing/newEnglandCoastal/v1";

listingsParentProcessor(newEnglandCoastalSearchUrl, promptInput, "new-england");
