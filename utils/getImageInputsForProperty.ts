import { ResponseInputImage } from "openai/resources/responses/responses.js";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";

export const getImageInputsForProperty = (
  propertyDetails: PropertyDetails,
  step: number = 1,
): ResponseInputImage[] => {
  return propertyDetails.responsivePhotos
    ? propertyDetails.responsivePhotos
        .filter((photo) => photo.url)
        .filter((_, i) => i % step === 0) // Get every other photo to save on cost
        .map((photo) => ({
          type: "input_image" as const,
          image_url: photo.url!,
          detail: "auto" as const,
        }))
    : [];
};
