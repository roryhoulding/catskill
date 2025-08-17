import * as z from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { prompt } from "../prompts/qualifyListing/qualifyListingPrompt";

// Load environment variables
dotenv.config();

const QualifyingResultSchema = z.object({
  isQualified: z.boolean(),
  score: z.number(),
  explanation: z.string(),
});

type QualifyingResult = z.infer<typeof QualifyingResultSchema>;

export const qualifyListing = async (
  propertyDetails: PropertyDetails,
): Promise<QualifyingResult | null> => {
  console.log(`Qualifying listing zpid: ${propertyDetails.zpid}`);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const imageInputs = propertyDetails.responsivePhotos
    ? propertyDetails.responsivePhotos
        .filter((photo) => photo.url)
        .map((photo) => ({
          type: "input_image" as const,
          image_url: photo.url!,
          detail: "auto" as const,
        }))
    : [];

  const response = await openai.responses.parse({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
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

// TODO: Remake this as class that you instantiate for property with a qualify property method? A model maybe?
