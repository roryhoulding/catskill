# Catskill - House Hunting Automation

This job automates the process of finding and qualifying house listings in the Hudson Valley area.

## GitHub Workflow Setup

The project includes a GitHub workflow that runs the Hudson Valley listings job every morning at 8am NY time.

### Required GitHub Secrets

To run the workflow, you need to set up the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:

#### `RESEND_API_KEY`

Your Resend API key for sending email notifications. Get it from [resend.com](https://resend.com).

#### `OPENAI_API_KEY`

Your OpenAI API key for qualifying listings. Get it from [platform.openai.com](https://platform.openai.com).

### Workflow Details

- **Schedule**: Runs every morning at 8am NY time (12:00 UTC)
- **Manual Trigger**: You can also manually trigger the workflow from the Actions tab
- **Job**: Executes `jobs/hudsonValleyListings.ts` which:
  - Scrapes Zillow for new listings in the Hudson Valley area
  - Qualifies listings using AI
  - Sends email notifications with qualified listings

### Local Development

To run the job locally:

```bash
npm install
npx tsx jobs/hudsonValleyListings.ts
```

Make sure to set up your environment variables in a `.env` file (see `env.example` for reference).
