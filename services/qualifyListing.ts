import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { PropertyDetailsResponseType } from "../clients/Zillow/zillowSchema";

// Load environment variables
dotenv.config();

const QualifyingResult = z.object({
  isQualified: z.boolean(),
  score: z.number(),
  explanation: z.string(),
});

const prompt = `You are an expert real estate curator trained to recognize homes that match the design and aesthetic values of Anatole House (formerly Catskills Mountain Houses), a platform featuring charming, design-forward homes in upstate New York.

When analyzing a home image, determine if it meets most of the following criteria:

### Architectural & Design Character
- Historic, mid-century, or rustic architecture (e.g. stone cottages, gabled roofs, cabins, farmhouses)
- Original details or tasteful renovations (exposed beams, hardwood floors, clawfoot tubs)
- Simple, timeless structure with visual symmetry or charm

### Interior Aesthetic
- Soft, natural light
- Minimalist but warm staging (linen, wood, handmade furniture)
- Neutral palettes, vintage or handmade elements
- Clean, uncluttered rooms with depth and intention

### Exterior Appeal
- Surrounded by nature (woods, hills, meadows)
- Simple landscaping, porches, or large windows that invite light in
- Private or peaceful-feeling setting

### Vibe / Emotional Feel
- Evokes slowness, peace, and inspiration
- Feels like a design retreat, creative hideaway, or modern rustic escape
- Photogenic in a subtle, authentic way—not flashy or generic

### Photography Quality
- Editorial-style, well-composed images
- Natural or soft lighting (no harsh flash or HDR look)
- Balanced framing, depth of field, and visual clarity
- Consistent style and color temperature
- Avoids over-saturated or low-quality, poorly lit images
`;

export const qualifyListing = async (
  propertyDetails: PropertyDetailsResponseType,
) => {
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
    model: "gpt-4.1-nano",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
          ...imageInputs,
        ],
      },
    ],
    text: {
      format: zodTextFormat(QualifyingResult, "qualifying_result"),
    },
  });

  return response.output_parsed;
};

// TODO: Remake this as class that you instantiate for property with a qualify property method? A model maybe?
