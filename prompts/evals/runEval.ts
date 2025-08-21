import { Evaluator } from "./evaluator";
import { promptInput } from "../qualifyListing/v3";

async function main(): Promise<void> {
  // Create a dynamic evaluator with the original prompt and model
  const evaluator = new Evaluator({
    promptInput: promptInput,
    model: "gpt-4.1-mini",
  });

  console.log("Starting dynamic evaluation...\n");

  // Run evaluation with current configuration
  const results = await evaluator.evaluate();

  console.log(
    `\nEvaluation completed! Success rate: ${results.successRate.toFixed(1)}%`,
  );
}

main().catch(console.error);
