import { zillowApi } from "../clients/Zillow/zillowClient";

const hudsonValleyOneDaySearchUrl =
  "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-84.036029453125%2C%22east%22%3A-64.150775546875%2C%22south%22%3A37.38917935682012%2C%22north%22%3A46.135532234510215%7D%2C%22mapZoom%22%3A7%2C%22usersSearchTerm%22%3A%22%22%2C%22customRegionId%22%3A%226327468838X1-CRow3wi1ata20h_12tnev%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22doz%22%3A%7B%22value%22%3A%221%22%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22price%22%3A%7B%22max%22%3A2000000%7D%2C%22mp%22%3A%7B%22max%22%3A10091%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D";

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
