import { qualifyListing } from "../../services/qualifyListing";
import { zillowApi } from "../../clients/Zillow/zillowClient";
import { propertiesToTest } from "./benchmarkPropertySet";

async function benchmarkHV(): Promise<void> {
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
