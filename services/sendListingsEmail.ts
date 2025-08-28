import { Resend } from "resend";
import { ListingContent } from "../types";
import { ListingsEmail as HudsonValleyEmail } from "../emails/hudson-valley";
import { ListingsEmail as NewEnglandEmail } from "../emails/new-england";

export type EmailTemplate = "hudson-valley" | "new-england";

export async function sendListingsEmail(
  listingsContent: ListingContent[],
  recipients: string[],
  apiKey: string,
  template: EmailTemplate = "hudson-valley",
  subject?: string,
): Promise<void> {
  const resend = new Resend(apiKey);

  // Select the appropriate email template
  const EmailComponent =
    template === "new-england" ? NewEnglandEmail : HudsonValleyEmail;

  // Set default subject based on template if not provided
  const emailSubject =
    subject ||
    (template === "new-england"
      ? "New listings in New England coastal area"
      : "New listings in Hudson Valley area");

  const email = await resend.emails.send({
    from: "listings@castkills.roryhoulding.fyi",
    to: recipients,
    subject: emailSubject,
    react: EmailComponent({ listingsContent: listingsContent }),
  });

  if (email.error) {
    throw new Error(`Failed to send email: ${email.error.message}`);
  }

  console.log("Email sent successfully:", email);
}
