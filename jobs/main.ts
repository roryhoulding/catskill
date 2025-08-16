import { qualifyListings } from "../services/qualifyListings";

async function main(): Promise<void> {
  try {
    await qualifyListings();
  } catch (error) {
    console.error(error);
  }
}

main();
