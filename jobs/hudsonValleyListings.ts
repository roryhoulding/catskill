import { qualifyListings } from "../services/qualifyListings";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const hudsonValleyOneDaySearchUrl =
  "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-89.2545353125%2C%22east%22%3A-58.932269687499996%2C%22south%22%3A32.650280914252846%2C%22north%22%3A50.001941278332176%7D%2C%22mapZoom%22%3A5%2C%22usersSearchTerm%22%3A%22%22%2C%22customRegionId%22%3A%226327468838X1-CRow3wi1ata20h_12tnev%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22price%22%3A%7B%22min%22%3Anull%2C%22max%22%3A2000000%7D%2C%22mp%22%3A%7B%22min%22%3Anull%2C%22max%22%3A10091%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22doz%22%3A%7B%22value%22%3A%221%22%7D%7D%2C%22isListVisible%22%3Atrue%7D";

async function main(): Promise<void> {
  try {
    const qualifiedListings = await qualifyListings(
      hudsonValleyOneDaySearchUrl,
    );
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
