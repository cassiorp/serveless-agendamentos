import { promises as fs } from "fs";
import path from "path";

export function resolveDataPath(relPathFromSrc: string) {
  return process.env.IS_OFFLINE
    ? path.resolve(process.cwd(), relPathFromSrc)            
    : `/tmp/${path.basename(relPathFromSrc)}`;             
}

export async function ensureTmpSeed(runtimePath: string, seedRelPathFromSrc: string) {
  if (process.env.IS_OFFLINE) return;
  try {
    await fs.access(runtimePath);
  } catch {
    const seedAbs = path.resolve(process.cwd(), seedRelPathFromSrc);
    const data = await fs.readFile(seedAbs, "utf-8");
    await fs.writeFile(runtimePath, data, "utf-8");
  }
}
