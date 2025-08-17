import { qualifyListings } from "../services/qualifyListings";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function main(): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Create HTML content with links to all qualified listings
    let listingsHtml = "";

    if (qualifiedListings.length === 0) {
      listingsHtml = "<p>No qualified listings found today.</p>";
    } else {
      listingsHtml = "<h2>Qualified Listings:</h2><ul>";

      for (const listing of qualifiedListings) {
        const zillowUrl = `https://www.zillow.com/homedetails/${listing.zpid}_zpid/`;

        // Create listing name and details
        const price = listing.price
          ? `$${listing.price.toLocaleString()}`
          : "Price not available";
        const location =
          listing.address?.streetAddress &&
          listing.address?.city &&
          listing.address?.state
            ? `${listing.address.streetAddress}, ${listing.address.city}, ${listing.address.state}`
            : listing.address?.city && listing.address?.state
              ? `${listing.address.city}, ${listing.address.state}`
              : "Location not available";

        const linkText = `${location} - ${price}`;

        listingsHtml += `<li><a href="${zillowUrl}" target="_blank">${linkText}</a></li>`;
      }

      listingsHtml += "</ul>";
    }

    const email = await resend.emails.send({
      from: "listings@castkills.roryhoulding.fyi",
      to: ["rohoulding@googlemail.com", "becky.hirsch@gmail.com"],
      subject: "New listings in Hudson Valley area",
      html: `
        <h3>New listings</h3>
        ${listingsHtml}
      `,
    });

    if (email.error) {
      console.error(email.error);
    } else {
      console.log(email);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
