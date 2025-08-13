import { helloWorld } from "../services/helloWorld";

function main() {
  try {
    helloWorld();
  } catch (error) {
    console.error(error);
  }
}

main();
