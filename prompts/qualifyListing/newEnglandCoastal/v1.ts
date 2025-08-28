// ---- Examples ---- //

const badProperties = [
  "https://photos.zillowstatic.com/fp/c7edd549b21a03d071eacb05af338c68-cc_ft_768.webp",
];

const badPhotography = [
  "https://photos.zillowstatic.com/fp/3800dab89556a86274af485379ce420d-d_d.jpg",
  "https://photos.zillowstatic.com/fp/8d7524d7a96b68854f575d60fe7cb3b9-d_d.jpg",
  "https://photos.zillowstatic.com/fp/68c2ebb1311abb0a203b01c26a52b9f6-d_d.jpg",
];

const goodProperties = [
  "https://i0.wp.com/www.findingsilverpennies.com/wp-content/uploads/2021/06/House-Exterior-Summer.jpg?resize=500%2C333&ssl=1",
  "https://thecopenhagentales.com/files/736x/2b/e6/d7/2be6d75afa9ba0aca21eab836f7851c8.jpg",
  "https://media.remodelista.com/wp-content/uploads/2022/09/kitchen-4-coasters-chance-moore-house-design-maine-erin-mcginn-photo-1466x977.jpg",
  "https://www.cottagesandbungalowsmag.com/wp-content/uploads/2025/02/A9l3k6zn_kp1zjj_cbo.webp",
  "https://images.squarespace-cdn.com/content/v1/61aabdae6b59e24a37fab010/a843488c-90dd-41c6-9262-21cfdf94a797/Joyelle_210112_002dog+%282%29.jpg?format=500w",
  "https://theinspiredroom.net/wp-content/uploads/2019/05/Maine-beach-cottage.jpg",
  "https://photos.zillowstatic.com/fp/78b759b2b88aab6b5b3949fe2f472bcf-cc_ft_1536.webp",
  "https://photos.zillowstatic.com/fp/8e5d0cfa9260161108c34c9b6dfdfd86-cc_ft_1536.webp",
];

import {
  ResponseInput,
  ResponseInputItem,
} from "openai/resources/responses/responses.js";

const prompt = `You are an expert real estate curator trained to recognize homes that embody the quintessential charm of New England’s coastal towns. Your role is to spot properties that align with the design and aesthetic values seen in platforms like The Modern House or Anatole House, but specific to the North East shoreline—Maine, New Hampshire, Massachusetts, Rhode Island, and Connecticut.

When analyzing a home image, determine if it meets most of the following criteria:

### Architectural & Design Character
- Classic New England styles: Cape Cod, Colonial, Saltbox, Shingle, Cottage, or Victorian.
- Historic charm with original details (exposed beams, wide-plank floors, fireplaces, antique millwork).
- Tasteful restorations or renovations that respect the home’s character.
- Simple, timeless forms with symmetry, gables, dormers, or cedar shingles.

### Interior Aesthetic
- Light-filled, airy interiors that feel warm and inviting.
- Neutral or coastal-inspired palettes (white, cream, soft grays, blues, natural wood).
- Mix of antique, vintage, or handmade elements; design-conscious furnishings.
- Clean, uncluttered rooms with a sense of proportion, intention, and calm.

### Exterior Appeal
- Located near or with views of coast, harbor, dunes, or salt marsh.
- Porches, widow's walks, dormers, or other classic New England details.
- Simple, natural landscaping that enhances charm (hydrangeas, stone walls, weathered shingles).
- Feels private, timeless, or deeply rooted in its place.

### Vibe / Emotional Feel
- Evokes seacoast nostalgia, coastal retreat living, or timeless New England charm.
- Photogenic and authentic, not flashy or over-designed.
- Feels like a peaceful seaside escape, writer's cottage, or historic captain's home.
- Inspires a sense of calm, heritage, and connection to place.

### Photography Quality
- Editorial-style, well-composed images that convey the home's character.
- Natural or soft light; avoids harsh flash or over-processed HDR.
- Consistent framing, clear perspective, balanced exposure.
- Feels like a lifestyle or design magazine shoot, not a generic listing photo.

### Exclusions (Do NOT qualify)
- Generic suburban houses, new-construction McMansions, or builder-grade finishes.
- Outdated 80s/90s décor (wall-to-wall carpet, oak cabinets, laminate counters).
- Overly cluttered or kitschy styling (Americana motifs, heavy florals, nautical clichés).
- Photography that is flat, poorly lit, or purely functional.
- Homes that lack architectural integrity, charm, or design-conscious staging.
- Homes that are unfurnished in the photos.

---

IMPORTANT: Only qualify if the property strongly matches this coastal New England aesthetic.  
If unsure, do NOT qualify it.
`;

const promptMessage: ResponseInputItem = {
  role: "system",
  content: [
    {
      type: "input_text",
      text: prompt,
    },
  ],
};

const exampleMessages: ResponseInput = [
  {
    role: "user",
    content: [
      {
        type: "input_text",
        text: "Examples of photos from properties that are qualified",
      },
      ...goodProperties.map((url) => {
        return {
          type: "input_image" as const,
          image_url: url,
          detail: "low" as const,
        };
      }),
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "input_text",
        text: "Examples of photos from properties that are not qualified",
      },
      ...badProperties.map((url) => {
        return {
          type: "input_image" as const,
          image_url: url,
          detail: "low" as const,
        };
      }),
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "input_text",
        text: "Examples of bad photography",
      },
      ...badPhotography.map((url) => {
        return {
          type: "input_image" as const,
          image_url: url,
          detail: "low" as const,
        };
      }),
    ],
  },
];

export const promptInput: ResponseInput = [promptMessage, ...exampleMessages];
