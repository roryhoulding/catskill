import { qualifyListing } from "./qualifyListing";
import { zillowApi } from "../clients/Zillow/zillowClient";

const propertiesToTest = [
  { id: 102046383, expectedResult: false }, // fail
  { id: 31831342, expectedResult: false }, // fail
  { id: 55941162, expectedResult: false }, // fail
  { id: 449578462, expectedResult: false }, // fail
  { id: 84110899, expectedResult: false }, // pass
  { id: 2086622587, expectedResult: true }, // pass
  { id: 56816839, expectedResult: true }, // pass
  { id: 84111705, expectedResult: true }, // pass
  { id: 30139195, expectedResult: true }, // pass
  { id: 455510903, expectedResult: true }, // pass
  { id: 30007714, expectedResult: true }, // pass
];

async function benchmarkHV() {
  let passCount = 0;
  let totalProcessed = 0;

  console.log("Testing property qualifications...\n");

  for (const property of propertiesToTest) {
    try {
      const propertyDetails = await zillowApi.getPropertyDetails(property.id);
      const result = await qualifyListing(propertyDetails);
      const isQualified = result?.isQualified || false;

      const status = isQualified ? "QUALIFIED" : "NOT QUALIFIED";
      const expectedStatus = property.expectedResult
        ? "QUALIFIED"
        : "NOT QUALIFIED";
      const match = isQualified === property.expectedResult ? "✅" : "❌";

      if (isQualified === property.expectedResult) {
        passCount++;
      }
      totalProcessed++;

      console.log(`Property ${property.id}:`);
      console.log(`  Expected: ${expectedStatus}`);
      console.log(`  Actual:   ${status}`);
      console.log(`  Result:   ${match}\n`);
    } catch (error) {
      console.error(`Error processing property ${property.id}:`, error);
      console.log(
        `  Expected: ${property.expectedResult ? "QUALIFIED" : "NOT QUALIFIED"}`,
      );
      console.log(`  Actual:   ERROR\n`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Total processed: ${totalProcessed}`);
  console.log(`  Passed: ${passCount}`);
  console.log(`  Failed: ${totalProcessed - passCount}`);
  console.log(
    `  Success rate: ${((passCount / totalProcessed) * 100).toFixed(1)}%`,
  );
}

benchmarkHV();
