import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { Content } from "../services/generateDescription";

// Combined type for listing with generated content
export type ListingContent = {
  listing: PropertyDetails;
  content: Content | null;
};
