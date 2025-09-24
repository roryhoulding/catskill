# Catskill

An experiment in AI image analysis and content curation. Uses Open AI vision for image qualifying, few shot prompting, [sequential processing pattern](https://ai-sdk.dev/docs/agents/workflows#sequential-processing-chains), structured output with Zod, and content generation.

_Readme created with the help of AI._

## In Brief

Catskill is an automated house-hunting assistant that:

1. Fetches property listings from Zillow using predefined search URLs
2. Qualifies or rejects each listing using AI image analysis
3. Generates content to describe the qualified listings
4. Sends an email of the qualified listings

### Example email
<img width="690" height="472" alt="image" src="https://github.com/user-attachments/assets/9edb65b6-74b7-4610-b7f5-9d1d0314aeb9" />

## In Detail

### Architecture Overview

The system follows a modular, service-oriented architecture with clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Job Runners   │───▶│ Parent Processor │───▶│ Email Service   │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Qualification   │
                       │                  │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     Content      │
                       │   Generation     │           
                       └──────────────────┘
```

### Core Services

#### 1. **Parent Processor** (`services/listingsParentProcessor.ts`)

The orchestrator that coordinates the entire workflow:

```typescript
export async function listingsParentProcessor(
  searchUrl: string,
  promptInput: ResponseInput,
  template: EmailTemplate = "hudson-valley",
): Promise<void>;
```

**Workflow:**

1. Calls `qualifyListings()` to get filtered property details
2. For each qualified listing, calls `generateDescriptionAndSelectImages()`
3. Sends the enhanced listings via email using `sendListingsEmail()`

#### 2. **Qualification Pipeline** (`services/qualifyListings.ts` + `services/qualifyListing.ts`)

**Multi-stage qualification process:**

1. **Fetch Listings** (`qualifyListings.ts`):
   - Uses Zillow API to get all listings from search URL
   - Fetches detailed property information for each listing
   - Processes listings sequentially to avoid rate limits

2. **AI Qualification** (`qualifyListing.ts`):
   - Uses OpenAI GPT-4 Vision to analyze property images
   - Applies region-specific criteria (Hudson Valley vs New England)
   - Returns structured qualification results with scores and explanations

**Qualification Criteria Example (Hudson Valley):**

- Historic, mid-century, or rustic architecture
- Soft, natural light and minimalist staging
- Surrounded by nature with peaceful settings
- Editorial-style photography quality
- Excludes generic suburban finishes and cluttered décor

#### 3. **Content Generation** (`services/generateDescription.ts`)

For qualified listings:

- Generates compelling property descriptions
- Selects and ranks the best photos with reasoning
- Creates enhanced content for email presentation

#### 4. **Email Service** (`services/sendListingsEmail.ts`)

- Uses Resend API for email delivery
- Supports multiple email templates (Hudson Valley, New England)
- Renders React-based email components with property details

### Job Runners

The system includes two main job runners:

- **Hudson Valley** (`jobs/hudsonValleyListings.ts`):
  ```bash
  npm run hv
  ```
- **New England Coastal** (`jobs/newEnglandCoastal.ts`):
  ```bash
  npm run nec
  ```

### Email Templates

Located in `emails/` directory:

- **Hudson Valley** (`hudson-valley.tsx`) - Clean, minimalist design for upstate properties
- **New England** (`new-england.tsx`) - Coastal-themed template

Each template includes:

- Property photos (AI-selected best images)
- Enhanced descriptions
- Key details (price, beds, baths)
- Direct links to Zillow listings
