import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { getImageInputsForProperty } from "../utils/getImageInputsForProperty";
import OpenAI from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod.js";
import { zillowApi } from "../clients/Zillow/zillowClient";
import { promptInput } from "../prompts/generateDescriptionAndSelectImages/v1";

dotenv.config();

const ContentSchema = z.object({
  description: z.string(),
  images: z.array(
    z.object({
      index: z.number(),
      reasoning: z.string(),
    }),
  ),
});

type Content = z.infer<typeof ContentSchema>;

export const generateDescriptionAndSelectImages = async (
  propertyDetails: PropertyDetails,
): Promise<Content | null> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const imageInputs = getImageInputsForProperty(propertyDetails);
  const propertyData = getPropertyDataForDescription(propertyDetails);

  console.log(imageInputs);

  const response = await openai.responses.parse({
    model: "gpt-5-mini",
    input: [
      promptInput,
      {
        role: "user",
        content: [
          ...imageInputs,
          {
            type: "input_text",
            text: JSON.stringify(propertyData),
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(ContentSchema, "content"),
    },
  });

  console.log(response.output_parsed);

  return response.output_parsed;
};

function getPropertyDataForDescription(
  propertyDetails: PropertyDetails,
): Partial<PropertyDetails> {
  return {
    address: propertyDetails.address,
    bathrooms: propertyDetails.bathrooms,
    bedrooms: propertyDetails.bedrooms,
    currency: propertyDetails.currency,
    description: propertyDetails.description,
    homeType: propertyDetails.homeType,
    livingAreaUnits: propertyDetails.livingAreaUnits,
    livingAreaValue: propertyDetails.livingAreaValue,
    lotAreaUnits: propertyDetails.lotAreaUnits,
    lotAreaValue: propertyDetails.lotAreaValue,
    price: propertyDetails.price,
    propertyTypeDimension: propertyDetails.propertyTypeDimension,
    architecturalStyle: propertyDetails.architecturalStyle,
    yearBuilt: propertyDetails.yearBuilt,
  };
}

async function main(): Promise<void> {
  const propertyDetails = await zillowApi.getPropertyDetails(84111705);
  generateDescriptionAndSelectImages(propertyDetails);
}

main();
