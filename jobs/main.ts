import { qualifyListings } from "../services/qualifyListings";

function main() {
  try {
    qualifyListings();
  } catch (error) {
    console.error(error);
  }
}

main();
