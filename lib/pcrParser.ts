import { PCRData } from "./types";
import { DEMO_DATA } from "./demoData";

/**
 * Simulates PCR file parsing with a loading delay.
 * In production, this would use pdf-parse, papaparse, or xlsx
 * depending on file type. For now, returns demo data after
 * a realistic delay to demonstrate the upload flow.
 */
export async function parsePCRFile(_file: File): Promise<PCRData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: PCRData = {
        ...DEMO_DATA,
        clientName: _file.name.replace(/\.(pdf|csv|xlsx?)$/i, ""),
      };
      resolve(data);
    }, 2500);
  });
}
