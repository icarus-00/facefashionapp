// Help page constants for use with HelpPageTemplate
// Type HelpSection is not exported, so we define it here for type safety

type HelpSection =
  | { type: 'text'; text: string; image?: string }
  | { type: 'steps'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'callout'; text: string };

export const helpPagesContent: {
  [key: string]: { header: string; sections: HelpSection[] };
} = {
  help1: {
    header: "Generation Kickstart",
    sections: [
      { type: "text", text: "Welcome to Generation Kickstart! This page will guide you through the basics of generating your first image or video." },
      { type: "steps", text: "1. Choose an actor 2. Select an outfit 3. Enter your prompt 4. Tap Generate" },
      { type: "callout", text: "Tip: You can always go back and edit your choices before generating." },
    ],
  },
  help2: {
    header: "Prompting",
    sections: [
      { type: "text", text: "Prompting is how you tell the AI what you want to see. Be clear and descriptive for best results." },
      { type: "bullet", text: "- Use simple language - Be specific about details - Try different phrasings if needed" },
      { type: "callout", text: "Example: 'A person wearing a red jacket in a city at night.'" },
    ],
  },
  help3: {
    header: "Actors and Outfits",
    sections: [
      { type: "text", text: "Actors are the main subjects in your generations. Outfits let you customize their appearance." },
      { type: "steps", text: "1. Browse actors 2. Tap to select 3. Pick an outfit from the list" },
      { type: "bullet", text: "- Mix and match actors and outfits - Use filters to find what you need" },
    ],
  },
  help4: {
    header: "Image Generation",
    sections: [
      { type: "text", text: "Image generation creates a single picture based on your selections and prompt." },
      { type: "steps", text: "1. Set up your actor and outfit 2. Enter a prompt 3. Tap Generate Image" },
      { type: "callout", text: "Generated images are saved to your gallery for easy access." },
    ],
  },
  help5: {
    header: "Video Generation",
    sections: [
      { type: "text", text: "Video generation creates a short animation using your chosen actor, outfit, and prompt." },
      { type: "steps", text: "1. Select actor and outfit 2. Enter a video prompt 3. Tap Generate Video" },
      { type: "bullet", text: "- Videos may take longer to generate - Try different prompts for creative results" },
    ],
  },
};
