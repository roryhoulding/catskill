import dotenv from "dotenv";

dotenv.config();

export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY!,
  from: "listings@castkills.roryhoulding.fyi",
  recipients: ["rohoulding@googlemail.com", "becky.hirsch@gmail.com"],
};

export const hudsonValleySearchUrl =
  "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-89.2545353125%2C%22east%22%3A-58.932269687499996%2C%22south%22%3A32.650280914252846%2C%22north%22%3A50.001941278332176%7D%2C%22mapZoom%22%3A5%2C%22usersSearchTerm%22%3A%22%22%2C%22customRegionId%22%3A%226327468838X1-CRow3wi1ata20h_12tnev%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22price%22%3A%7B%22min%22%3Anull%2C%22max%22%3A2000000%7D%2C%22mp%22%3A%7B%22min%22%3Anull%2C%22max%22%3A10091%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22doz%22%3A%7B%22value%22%3A%221%22%7D%7D%2C%22isListVisible%22%3Atrue%7D";

export const newEnglandCoastalSearchUrl =
  "https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22isMapVisible%22%3Atrue%2C%22mapBounds%22%3A%7B%22west%22%3A-81.29627849358432%2C%22east%22%3A-66.13514568108432%2C%22south%22%3A38.3348425260915%2C%22north%22%3A46.89931027761238%7D%2C%22usersSearchTerm%22%3A%22%22%2C%22customRegionId%22%3A%229a1e668af2X1-CR3last2r3kjfu_10vf0a%22%2C%22filterState%22%3A%7B%22sort%22%3A%7B%22value%22%3A%22days%22%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22price%22%3A%7B%22min%22%3A0%2C%22max%22%3A3000000%7D%2C%22mp%22%3A%7B%22min%22%3A0%2C%22max%22%3A15081%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%2C%22built%22%3A%7B%22min%22%3Anull%2C%22max%22%3A1960%7D%2C%2255plus%22%3A%7B%22value%22%3A%22e%22%7D%2C%22doz%22%3A%7B%22value%22%3A%221%22%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A6%7D";
