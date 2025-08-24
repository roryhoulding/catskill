import { Resend } from "resend";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";
import { ListingContent } from "../types";

export async function sendListingsEmail(
  listingsContent: ListingContent[],
  recipients: string[],
  apiKey: string,
  subject: string = "New listings in Hudson Valley area",
): Promise<void> {
  const resend = new Resend(apiKey);
  const listingsHtml = formatListingsHtml(listingsContent);

  const email = await resend.emails.send({
    from: "listings@castkills.roryhoulding.fyi",
    to: recipients,
    subject,
    html: listingsHtml,
  });

  if (email.error) {
    throw new Error(`Failed to send email: ${email.error.message}`);
  }

  console.log("Email sent successfully:", email);
}

function formatListingsHtml(listingsContent: ListingContent[]): string {
  if (listingsContent.length === 0) {
    return "<p>No qualified listings found today.</p>";
  }

  let html = "<h3>New listings</h3>";

  for (const { listing, content } of listingsContent) {
    const zillowUrl = `https://www.zillow.com/homedetails/${listing.zpid}_zpid/`;
    const price = listing.price
      ? `$${listing.price.toLocaleString()}`
      : "Price not available";

    const location = formatLocation(listing.address);
    const linkText = `${location} - ${price}`;

    html += `<div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">`;
    html += `<h4><a href="${zillowUrl}" target="_blank">${linkText}</a></h4>`;

    // Add AI-generated description if available
    if (content?.description) {
      html += `<p style="margin: 10px 0; line-height: 1.5;">${content.description}</p>`;
    }

    // Add property details
    html += `<div style="margin: 10px 0; font-size: 14px; color: #666;">`;
    if (listing.bedrooms)
      html += `<span style="margin-right: 15px;">🛏️ ${listing.bedrooms} beds</span>`;
    if (listing.bathrooms)
      html += `<span style="margin-right: 15px;">🚿 ${listing.bathrooms} baths</span>`;
    if (listing.livingAreaValue)
      html += `<span style="margin-right: 15px;">📏 ${listing.livingAreaValue} ${listing.livingAreaUnits || "sqft"}</span>`;
    if (listing.yearBuilt)
      html += `<span style="margin-right: 15px;">🏗️ Built ${listing.yearBuilt}</span>`;
    html += `</div>`;

    // Add selected images info if available
    if (content?.images && content.images.length > 0) {
      html += `<div style="margin: 10px 0; font-size: 12px; color: #888;">`;
      html += `<strong>Selected images:</strong> ${content.images.length} images chosen based on AI analysis`;
      html += `</div>`;
    }

    html += `</div>`;
  }

  return html;
}

function formatLocation(address: PropertyDetails["address"]): string {
  if (address?.streetAddress && address?.city && address?.state) {
    return `${address.streetAddress}, ${address.city}, ${address.state}`;
  }
  if (address?.city && address?.state) {
    return `${address.city}, ${address.state}`;
  }
  return "Location not available";
}
