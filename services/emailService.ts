import { Resend } from "resend";
import { PropertyDetails } from "../clients/Zillow/zillowSchema";

export async function sendListingsEmail(
  qualifiedListings: PropertyDetails[],
  recipients: string[],
  apiKey: string,
  subject: string = "New listings in Hudson Valley area",
): Promise<void> {
  const resend = new Resend(apiKey);
  const listingsHtml = formatListingsHtml(qualifiedListings);

  const email = await resend.emails.send({
    from: "listings@castkills.roryhoulding.fyi",
    to: recipients,
    subject,
    html: `
      <h3>New listings</h3>
      ${listingsHtml}
    `,
  });

  if (email.error) {
    throw new Error(`Failed to send email: ${email.error.message}`);
  }

  console.log("Email sent successfully:", email);
}

function formatListingsHtml(listings: PropertyDetails[]): string {
  if (listings.length === 0) {
    return "<p>No qualified listings found today.</p>";
  }

  let html = "<h2>Qualified Listings:</h2><ul>";

  for (const listing of listings) {
    const zillowUrl = `https://www.zillow.com/homedetails/${listing.zpid}_zpid/`;
    const price = listing.price
      ? `$${listing.price.toLocaleString()}`
      : "Price not available";

    const location = formatLocation(listing.address);
    const linkText = `${location} - ${price}`;

    html += `<li><a href="${zillowUrl}" target="_blank">${linkText}</a></li>`;
  }

  html += "</ul>";
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
