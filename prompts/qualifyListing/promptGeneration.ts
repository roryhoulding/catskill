import OpenAI from "openai";
import dotenv from "dotenv";
import { propertiesToTest } from "../evals/evalData";
import { zillowApi } from "../../clients/Zillow/zillowClient";
import { prompt as existingPrompt } from "./qualifyListingPrompt";

import { ResponseInputMessageContentList } from "openai/resources/responses/responses";
import { ResponseInputImage } from "openai/resources/responses/responses";

type UserInput = {
  role: "user" | "system" | "developer";
  content: ResponseInputMessageContentList;
};

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
You are an expert prompt engineer. You are given an existing prompt and a list of property data, most notably the images,and structured output schema. 

Each property in the dataset has an expected isQualified value. Your job is to improve the prompt the prompt so that every property will match the expected value when the prompt is used and passed a property.

You are to generate a new prompt that is more specific and accurate for qualifying properties.
`;

type PropertyData = {
  id: number;
  expectedIsQualified: boolean;
  images: ResponseInputImage[];
};

async function generatePropertyData(): Promise<PropertyData[]> {
  const propertyData: PropertyData[] = [];

  for (const property of propertiesToTest) {
    const propertyDetails = await zillowApi.getPropertyDetails(property.id);
    const imageInputs = propertyDetails.responsivePhotos
      ? propertyDetails.responsivePhotos
          .filter((photo) => photo.url)
          .map((photo) => ({
            type: "input_image" as const,
            image_url: photo.url!,
            detail: "auto" as const,
          }))
      : [];

    propertyData.push({
      id: property.id,
      expectedIsQualified: property.expectedResult,
      images: imageInputs,
    });
  }

  return propertyData;
}

async function generateContent(): Promise<UserInput[]> {
  const propertyData = await generatePropertyData();

  const userInput: UserInput[] = [];

  for (const property of propertyData) {
    userInput.push({
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Photos for property id: ${property.id}. The expected isQualified value is ${property.expectedIsQualified}.`,
        },
        ...property.images,
      ],
    });
  }

  return userInput;
}

async function main(): Promise<void> {
  const userInput = await generateContent();
  // console.log(userInput[0]);

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
        content: [
          {
            type: "input_text",
            text: existingPrompt,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Structured output schema is : {isQualified: boolean, score: number, explanation: string}`,
          },
        ],
      },
      ...userInput,
    ],
  });

  console.log(response.output);
}

main();
