import * as z from "zod";
import { openAIClient } from "../clients/openAI/openAIClient";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { promptInput } from "../prompts/qualifyListing/v3";
import { getImageInputsForProperty } from "../utils/getImageInputsForProperty";

// Load environment variables
dotenv.config();

export const QualifyingResultSchema = z.object({
  isQualified: z.boolean(),
  score: z.number(),
  explanation: z.string(),
});

export type QualifyingResult = z.infer<typeof QualifyingResultSchema>;

export const qualifyListing = async (
  propertyDetails: PropertyDetails,
): Promise<QualifyingResult | null> => {
  console.log(`Qualifying listing zpid: ${propertyDetails.zpid}`);

  const imageInputs = getImageInputsForProperty(propertyDetails, 2);

  const response = await openAIClient.responses.parse({
    model: "gpt-4.1-mini",
    input: [
      ...promptInput,
      {
        role: "user",
        content: imageInputs,
      },
    ],
    text: {
      format: zodTextFormat(QualifyingResultSchema, "qualifying_result"),
    },
  });

  console.log(response.output_parsed);

  return response.output_parsed;
};
