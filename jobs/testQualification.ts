import { qualifyListing } from "../services/qualifyListing";
import { zillowApi } from "../clients/Zillow/zillowClient";

const propertyIds = [
  102046383, // fail
  31831342, // fail
  55941162, // fail
  449578462, // fail
  84110899, // pass
  2086622587, // pass
  56816839, // pass
  84111705, // pass
  30139195, // pass
  455510903, // pass
];

async function testQualifications() {
  for (const id of propertyIds) {
    try {
      const propertyDetails = await zillowApi.getPropertyDetails(id);
      await qualifyListing(propertyDetails);
    } catch (error) {
      console.error(`Error processing property ${id}:`, error);
    }
  }
}

testQualifications();
