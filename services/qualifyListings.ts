import { zillowApi } from "../clients/Zillow/zillowClient";
import dotenv from "dotenv";
import { qualifyListing } from "./qualifyListing";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { ResponseInput } from "openai/resources/responses/responses.js";
dotenv.config();

export const qualifyListings = async (
  searchURL: string,
  promptInput: ResponseInput,
): Promise<PropertyDetails[]> => {
  const { results: listingsIDs } =
    await zillowApi.getAllListingsBySearchUrl(searchURL);

  console.log(listingsIDs);

  if (listingsIDs.length === 0) {
    return [];
  }

  const qualifiedListings: PropertyDetails[] = [];

  for (const listing of listingsIDs) {
    try {
      const propertyDetails = await zillowApi.getPropertyDetails(listing.zpid);
      const result = await qualifyListing(propertyDetails, promptInput);
      if (result?.isQualified) {
        qualifiedListings.push(propertyDetails);
      }
    } catch (error) {
      console.error(`Error qualifying listing ${listing.zpid}:`, error);
      continue;
    }
  }

  return qualifiedListings;
};
