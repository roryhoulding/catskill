import { zillowApi } from "../clients/Zillow/zillowClient";
import dotenv from "dotenv";
import { qualifyListing } from "./qualifyListing";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
dotenv.config();

export const qualifyListings = async (
  searchURL: string,
): Promise<PropertyDetails[]> => {
  const { results: listingsIDs } =
    await zillowApi.getAllListingsBySearchUrl(searchURL);

  console.log(listingsIDs);

  if (listingsIDs.length === 0) {
    return [];
  }

  const qualifiedListings: PropertyDetails[] = [];

  for (const listing of listingsIDs) {
    const propertyDetails = await zillowApi.getPropertyDetails(listing.zpid);
    const result = await qualifyListing(propertyDetails);
    if (result?.isQualified) {
      qualifiedListings.push(propertyDetails);
    }
  }

  return qualifiedListings;
};
