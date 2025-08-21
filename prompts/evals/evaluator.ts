import { zillowApi } from "../../clients/Zillow/zillowClient";
import { propertiesToTest } from "./evalData";
import { PropertyDetails } from "../../clients/Zillow/zillowSchema";
import * as z from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { getImageInputs } from "../../services/qualifyListing";
import { promptInput } from "../qualifyListing/v2";

// Load environment variables
dotenv.config();

export const QualifyingResultSchema = z.object({
  isQualified: z.boolean(),
  score: z.number(),
  explanation: z.string(),
});

type QualifyingResult = z.infer<typeof QualifyingResultSchema>;

export interface EvaluationConfig {
  prompt: string;
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

  /**
   * Update the evaluation configuration
   */
  updateConfig(config: Partial<EvaluationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get the current configuration
   */
  getConfig(): EvaluationConfig {
    return { ...this.config };
  }

  /**
   * Qualify a single property using the current prompt and model
   */
  private async qualifyProperty(
    propertyDetails: PropertyDetails,
  ): Promise<QualifyingResult | null> {
    console.log(`Qualifying listing zpid: ${propertyDetails.zpid}`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const imageInputs = getImageInputs(propertyDetails);

    const response = await openai.responses.parse({
      model: this.config.model,
      input: [
        ...promptInput,
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

  /**
   * Evaluate a single property
   */
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

  /**
   * Run the full evaluation on all test properties
   */
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

  /**
   * Run evaluation with a temporary configuration
   */
  async evaluateWithConfig(
    tempConfig: EvaluationConfig,
  ): Promise<EvaluationSummary> {
    const originalConfig = this.getConfig();
    this.updateConfig(tempConfig);

    try {
      return await this.evaluate();
    } finally {
      this.updateConfig(originalConfig);
    }
  }
}
