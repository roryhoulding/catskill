import { zillowApi } from "../../clients/Zillow/zillowClient";
import { propertiesToTest } from "./evalData";
import { PropertyDetails } from "../../clients/Zillow/zillowSchema";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { getImageInputsForProperty } from "../../utils/getImageInputsForProperty";
import { ResponseInput } from "openai/resources/responses/responses.js";
import {
  QualifyingResultSchema,
  QualifyingResult,
} from "../../services/qualifyListing";

// Load environment variables
dotenv.config();

export interface EvaluationConfig {
  promptInput: ResponseInput;
  model: string;
}

export interface EvaluationResult {
  propertyId: string;
  expectedResult: boolean;
  actualResult: boolean;
  isMatch: boolean;
  error?: string;
}

export interface EvaluationSummary {
  totalProcessed: number;
  passed: number;
  failed: number;
  successRate: number;
  results: EvaluationResult[];
}

export class Evaluator {
  private config: EvaluationConfig;

  constructor(config: EvaluationConfig) {
    this.config = config;
  }

  updateConfig(config: Partial<EvaluationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): EvaluationConfig {
    return { ...this.config };
  }

  private async qualifyProperty(
    propertyDetails: PropertyDetails,
  ): Promise<QualifyingResult | null> {
    console.log(`Qualifying listing zpid: ${propertyDetails.zpid}`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const imageInputs = getImageInputsForProperty(propertyDetails);

    const response = await openai.responses.parse({
      model: this.config.model,
      input: [
        ...this.config.promptInput,
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Photos of the property to qualify",
            },
            ...imageInputs,
          ],
        },
      ],
      text: {
        format: zodTextFormat(QualifyingResultSchema, "qualifying_result"),
      },
    });

    console.log(response.output_parsed);

    return response.output_parsed;
  }

  private async evaluateProperty(property: {
    id: number;
    expectedResult: boolean;
  }): Promise<EvaluationResult> {
    const propertyDetails = await zillowApi.getPropertyDetails(property.id);
    const result = await this.qualifyProperty(propertyDetails);
    const isQualified = result?.isQualified || false;

    return {
      propertyId: property.id.toString(),
      expectedResult: property.expectedResult,
      actualResult: isQualified,
      isMatch: isQualified === property.expectedResult,
    };
  }

  async evaluate(): Promise<EvaluationSummary> {
    const results: EvaluationResult[] = [];
    let passCount = 0;
    let totalProcessed = 0;

    console.log("Testing property qualifications...\n");
    console.log(`Using model: ${this.config.model}\n`);

    for (const property of propertiesToTest) {
      try {
        const result = await this.evaluateProperty(property);
        results.push(result);

        const status = result.actualResult ? "QUALIFIED" : "NOT QUALIFIED";
        const expectedStatus = result.expectedResult
          ? "QUALIFIED"
          : "NOT QUALIFIED";
        const match = result.isMatch ? "✅" : "❌";

        if (result.isMatch) {
          passCount++;
        }
        totalProcessed++;

        console.log(`Property ${result.propertyId}:`);
        console.log(
          `  URL: https://www.zillow.com/homedetails/${result.propertyId}_zpid`,
        );
        console.log(`  Expected: ${expectedStatus}`);
        console.log(`  Actual:   ${status}`);
        if (result.error) {
          console.log(`  Error:    ${result.error}`);
        }
        console.log(`  Result:   ${match}\n`);
      } catch (error) {
        console.error(`Error qualifying property ${property.id}:`, error);
      }
    }

    const successRate = (passCount / totalProcessed) * 100;

    console.log(`\nSummary:`);
    console.log(`  Total processed: ${totalProcessed}`);
    console.log(`  Passed: ${passCount}`);
    console.log(`  Failed: ${totalProcessed - passCount}`);
    console.log(`  Success rate: ${successRate.toFixed(1)}%`);

    return {
      totalProcessed,
      passed: passCount,
      failed: totalProcessed - passCount,
      successRate,
      results,
    };
  }
}
