import * as React from "react";
import {
  Body,
  Container,
  Html,
  Img,
  Section,
  Preview,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import { ListingContent } from "../types";

interface ListingsEmailProps {
  listingsContent: ListingContent[];
}

export const ListingsEmail = ({ listingsContent }: ListingsEmailProps) => (
  <Html>
    <Preview>{listingsContent.length.toString()} new upstate houses</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={text}>
          {listingsContent.length} new
          {listingsContent.length === 1 ? " property" : " properties"}
        </Text>
        {listingsContent.map((listingContent, index) => (
          <div key={index}>
            <Listing listing={listingContent} />
            {index < listingsContent.length - 1 && <Hr style={hr} />}
          </div>
        ))}
      </Container>
    </Body>
  </Html>
);

const Listing = ({ listing }: { listing: ListingContent }) => {
  const { listing: propertyDetails, content } = listing;

  const mainPhotoURL =
    content?.images?.[0]?.index !== undefined
      ? propertyDetails.responsivePhotos?.[content.images[0].index]?.url
      : propertyDetails.responsivePhotos?.[0]?.url || null;

  // Format address
  const address = propertyDetails.address;
  const addressString = [
    address?.streetAddress,
    address?.city,
    address?.state,
    address?.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

  // Format price
  const price = propertyDetails.price
    ? `$${propertyDetails.price.toLocaleString()}`
    : "Price not available";

  // Format bedrooms and bathrooms
  const bedrooms = propertyDetails.bedrooms || 0;
  const bathrooms = propertyDetails.bathrooms || 0;

  // Get description from generated content or fallback to original
  const description =
    content?.description ||
    propertyDetails.description ||
    "No description available.";

  // Create Zillow link
  const zillowLink = `https://www.zillow.com/homedetails/${propertyDetails.zpid}_zpid/`;

  return (
    <Section style={listingSection}>
      {mainPhotoURL && (
        <Img
          alt={`${addressString} - Main Photo`}
          style={listingImage}
          height="300"
          src={mainPhotoURL}
        />
      )}

      <Section style={listingContent}>
        <Text style={listingTitle}>{addressString}</Text>
        <Text style={listingPrice}>{price}</Text>
        <Text style={listingDetails}>
          {bedrooms} bed • {bathrooms} bath
        </Text>

        <Text style={listingDescription}>{description}</Text>

        <Button style={viewButton} href={zillowLink}>
          VIEW LISTING
        </Button>
      </Section>
    </Section>
  );
};

ListingsEmail.PreviewProps = {
  listingsContent: [
    {
      listing: {
        zpid: 84111705,
        address: {
          streetAddress: "168 Muhlig Road",
          city: "Liberty",
          state: "NY",
          zipcode: "12754",
        },
        price: 769000,
        bedrooms: 3,
        bathrooms: 2,
        description:
          "Dreamy restored 1900 farmhouse in Liberty, NY for $769,000 — original beams, sun-soaked rooms and a chef’s kitchen by Jersey Ice Cream Co. Mostly furnished and move-in ready with sweeping fields, a rebuilt red barn and a hammock-ready pergola, all about two hours from NYC.",
        responsivePhotos: [
          {
            url: "https://photos.zillowstatic.com/fp/876e1afa6246b2077cc0531b40aded9c-p_d.jpg",
          },
        ],
      },
      content: {
        description:
          "Dreamy restored 1900 farmhouse in Liberty, NY for $769,000 — original beams, sun-soaked rooms and a chef’s kitchen by Jersey Ice Cream Co. Mostly furnished and move-in ready with sweeping fields, a rebuilt red barn and a hammock-ready pergola, all about two hours from NYC.",
        images: [
          {
            index: 0,
            reasoning:
              "Charming exterior with porch, pergola and lush gardens — perfect cover to show the house and its bucolic setting.",
          },
          {
            index: 5,
            reasoning:
              "Wide shot of the chef’s kitchen with oversized island, exposed beams and professional range — the true heart of the home.",
          },
          {
            index: 16,
            reasoning:
              "Cozy living room with pellet stove and warm light — showcases the inviting gathering space and vintage-meets-modern vibe.",
          },
        ],
      },
    },
  ],
} as ListingsEmailProps;

export default ListingsEmail;

const main = {
  backgroundColor: "#F8F7F2",
  fontFamily:
    "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  lineHeight: "1.6",
};

const containerHeader = {
  margin: "0 auto",
};

const container = {
  paddingLeft: "24px",
  paddingRight: "24px",
  margin: "0 auto",
  maxWidth: "600px",
};

const text = {
  color: "#00200F",
  opacity: 0.8,
  fontSize: "14px",
  margin: "10px 0",
  textAlign: "center" as const,
  fontWeight: "400",
};

const listingSection = {
  margin: "40px 0",
  backgroundColor: "transparent",
  borderRadius: "0",
  overflow: "hidden",
};

const listingImage = {
  width: "100%",
  height: "auto",
  borderRadius: "0",
  marginBottom: "0",
  display: "block",
};

const listingContent = {
  padding: "0",
};

const listingTitle = {
  color: "#1A3633",
  fontSize: "16px",
  fontWeight: "600",
  margin: "24px 0 8px 0",
  lineHeight: "1.3",
  textAlign: "left" as const,
};

const listingPrice = {
  color: "#1A3633",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  textAlign: "left" as const,
};

const listingDetails = {
  color: "#1A3633",
  fontSize: "14px",
  margin: "0 0 12px 0",
  fontWeight: "500",
  textAlign: "left" as const,
};

const listingDescription = {
  color: "#1A3633",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  fontWeight: "400",
  textAlign: "left" as const,
};

const viewButton = {
  backgroundColor: "transparent",
  borderRadius: "25px",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "2px solid #000000",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const hr = {
  borderColor: "#CCCCCC",
  margin: "40px 0",
  borderWidth: "1px",
  borderStyle: "solid",
};
