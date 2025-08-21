import * as z from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { promptInput } from "../prompts/qualifyListing/v2";
import { ResponseInputImage } from "openai/resources/responses/responses.js";

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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const imageInputs = getImageInputs(propertyDetails);

  const response = await openai.responses.parse({
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

export const getImageInputs = (
  propertyDetails: PropertyDetails,
): ResponseInputImage[] => {
  return propertyDetails.responsivePhotos
    ? propertyDetails.responsivePhotos
        .filter((photo) => photo.url)
        .filter((_, i) => i % 2 === 0) // Get every other photo to save on cost
        .map((photo) => ({
          type: "input_image" as const,
          image_url: photo.url!,
          detail: "auto" as const,
        }))
    : [];
};

// TODO: Remake this as class that you instantiate for property with a qualify property method? A model maybe?
