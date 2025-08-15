import * as z from "zod";

const zpid = z.number();

const propertyAddressSchema = z.object({
  city: z.string().nullish(),
  community: z.string().nullish(),
  neighborhood: z.string().nullish(),
  state: z.string().nullish(),
  streetAddress: z.string().nullish(),
  subdivision: z.string().nullish(),
  zipcode: z.string().nullish(),
});

const listingAgentSchema = z.object({
  business_name: z.string().nullish(),
  display_name: z.string().nullish(),
});

const nearbyCitiesSchema = z.array(
  z.object({
    name: z.string().nullish(),
  }),
);

const responsivePhotosSchema = z.array(
  z.object({
    url: z.string().nullish(),
  }),
);

// ---- Listings ---- //

export const ListingsResponseSchema = z.object({
  results: z.array(
    z.object({
      zpid: zpid,
    }),
  ),
  resultsPerPage: z.number(),
  totalPages: z.number(),
  totalResultCount: z.number(),
});

// ---- Property Details ---- //

export const PropertyDetailsResponseSchema = z.object({
  address: propertyAddressSchema.nullish(),
  bathrooms: z.number().nullish(),
  bedrooms: z.number().nullish(),
  currency: z.string().nullish(),
  datePostedString: z.string().nullish(),
  daysOnZillow: z.number().nullish(),
  description: z.string().nullish(),
  homeStatus: z.string().nullish(),
  homeType: z.string().nullish(),
  listing_agent: listingAgentSchema.nullish(),
  livingAreaUnits: z.string().nullish(),
  livingAreaUnitsShort: z.string().nullish(),
  livingAreaValue: z.number().nullish(),
  lotAreaUnits: z.string().nullish(),
  lotAreaValue: z.number().nullish(),
  mlsid: z.string().nullish(),
  nearbyCities: nearbyCitiesSchema.nullish(),
  photoCount: z.number().nullish(),
  price: z.number().nullish(),
  propertyTypeDimension: z.string().nullish(), // E.g. "Single Family"
  architecturalStyle: z.string().nullish(), // E.g. "Farmhouse"
  responsivePhotos: responsivePhotosSchema.nullish(),
  timeOnZillow: z.string().nullish(),
  yearBuilt: z.number().nullish(),
  zpid: zpid,
});

// ---- Exports ---- //

export type ListingsResponseType = z.infer<typeof ListingsResponseSchema>;
export type PropertyDetailsResponseType = z.infer<
  typeof PropertyDetailsResponseSchema
>;
