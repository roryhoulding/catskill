import { zillowApi } from "../clients/Zillow/zillowClient";

const hudsonValleyOneDaySearchUrl =
  "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-75.9885441015625%2C%22east%22%3A-72.1982608984375%2C%22south%22%3A40.81737559955039%2C%22north%22%3A42.98800528029415%7D%2C%22customRegionId%22%3A%226327468838X1-CRow3wi1ata20h_12tnev%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22doz%22%3A%7B%22value%22%3A%221%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A8%2C%22usersSearchTerm%22%3A%22%22%7D";

export const qualifyListings = async () => {
  console.log("Fetching listings from Zillow...");
  const { results: listingsIDs } = await zillowApi.getAllListingsBySearchUrl(
    hudsonValleyOneDaySearchUrl,
  );

  if (listingsIDs.length === 0) {
    console.log("No listings found");
    return;
  }

  const propertyDetails = await zillowApi.getPropertyDetails(
    listingsIDs[0].zpid,
  );
  console.log(propertyDetails);
};
