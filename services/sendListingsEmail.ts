import { Resend } from "resend";
import { ListingContent } from "../types";
import { ListingsEmail } from "../emails/listings-email";

export async function sendListingsEmail(
  listingsContent: ListingContent[],
  recipients: string[],
  apiKey: string,
  subject: string = "New listings in Hudson Valley area",
): Promise<void> {
  const resend = new Resend(apiKey);

  const email = await resend.emails.send({
    from: "listings@castkills.roryhoulding.fyi",
    to: recipients,
    subject,
    react: ListingsEmail({ listingsContent: listingsContent }),
  });

  if (email.error) {
    throw new Error(`Failed to send email: ${email.error.message}`);
  }

  console.log("Email sent successfully:", email);
}
