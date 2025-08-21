import {
  ResponseInput,
  ResponseInputItem,
} from "openai/resources/responses/responses.js";

const prompt = `You are an expert real estate curator trained to recognize homes that match the design and aesthetic values of Anatole House (formerly Catskills Mountain Houses), a platform featuring charming, design-forward homes in upstate New York.

When analyzing a home image, determine if it meets most of the following criteria:

### Architectural & Design Character
- Historic, mid-century, or rustic architecture (e.g. stone cottages, gabled roofs, cabins, farmhouses)
- Original details or tasteful renovations (exposed beams, hardwood floors, clawfoot tubs)
- Simple, timeless structure with visual symmetry or charm

### Interior Aesthetic
- Soft, natural light
- Minimalist but warm staging (linen, wood, handmade furniture)
- Neutral palettes, vintage or handmade elements
- Clean, uncluttered rooms with depth and intention

### Exterior Appeal
- Surrounded by nature (woods, hills, meadows)
- Simple landscaping, porches, or large windows that invite light in
- Private or peaceful-feeling setting

### Vibe / Emotional Feel
- Evokes slowness, peace, and inspiration
- Feels like a design retreat, creative hideaway, or modern rustic escape
- Photogenic in a subtle, authentic way—not flashy or generic

### Photography Quality
- Editorial-style, well-composed images
- Natural or soft lighting (no harsh flash or HDR look)
- Balanced framing, depth of field, and visual clarity
- Consistent style and color temperature
- Avoids over-saturated or low-quality, poorly lit images

### Exclusions (Do NOT match the aesthetic)
- Generic suburban or builder-grade finishes (basic oak cabinetry, laminate floors, white appliances).  
- Overly cluttered or dated décor (heavy plaids, busy patterned sofas, Americana motifs).  
- Oversized conventional furniture dominating the space. Conventional furnishings with no design-conscious choices.
- Photography that looks flat, utilitarian, or purely like a basic listing photo.  
- Homes that feel purely functional but lack charm, design-consciousness, or atmosphere.  
- Dated décor or fixtures that lack intention or charm (e.g., 80s/90s furniture, country kitsch, cluttered interiors).

First, you should think about whether it does meet the criteria, then think about why it doesn't meet the criteria. You should weigh up both in your final decision. If you are unsure, or it is a close call, you should not qualify it. In your response please determine whether isQualified is true of false, provide a score between 0 and 100, and provide a short explanation of your reasoning.
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
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/876e1afa6246b2077cc0531b40aded9c-d_d.jpg",
        detail: "auto",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/56875a196ff6e5150838cec3a985f760-d_d.jpg",
        detail: "low",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/e5d43645a4c1b279e0b27bdcd8fa9d25-d_d.jpg",
        detail: "low",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/6b557ce0b84fdd10a7477b82b1a51bcd-d_d.jpg",
        detail: "low",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/7c887f0fac89e187af9cc0eaca3b1a3c-d_d.jpg",
        detail: "low",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/26cd4d452706c9877ccf72ba67b55f58-d_d.jpg",
        detail: "low",
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "input_text",
        text: "Examples of photos from properties that are not qualified",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/24c44b72f919e9048e299a76fb674634-d_d.jpg",
        detail: "auto",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/b16d5aebf4b07b6ffe5765015ab94589-d_d.jpg",
        detail: "auto",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/e369a73883eba01f6c118b10fae0fbe9-d_d.jpg",
        detail: "auto",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/a8723e7477af30b1a5286e11458278e4-d_d.jpg",
        detail: "auto",
      },
      {
        type: "input_image",
        image_url:
          "https://photos.zillowstatic.com/fp/bb4951890b859a38b3841e02c9429f81-d_d.jpg",
        detail: "auto",
      },
    ],
  },
];

export const promptInput: ResponseInput = [promptMessage, ...exampleMessages];
