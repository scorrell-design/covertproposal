import { PCRData } from "./types";
import { DEMO_DATA } from "./demoData";

/**
 * Simulates PCR file parsing with a loading delay.
 *
 * In production this reads the uploaded PCR PDF and extracts the figures it
 * needs — the PCR already contains every computed number the proposal shows
 * (risk tiers, prescriber/pharmacy counts, projected savings, etc.), so there
 * are no calculators to build on our end. Input is a single PDF only.
 *
 * For now, returns demo data after a realistic delay to demonstrate the flow.
 */
export async function parsePCRFile(_file: File): Promise<PCRData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: PCRData = {
        ...DEMO_DATA,
        clientName: _file.name.replace(/\.pdf$/i, ""),
      };
      resolve(data);
    }, 2500);
  });
}
