// src/shared/FileJsonStore.ts
import { promises as fs } from "fs";
import path from "path";

function resolveDataPath(relPathFromSrc: string) {
  return process.env.IS_OFFLINE
    ? path.resolve(process.cwd(), relPathFromSrc)
    : `/tmp/${path.basename(relPathFromSrc)}`;
}

async function ensureTmpSeed(runtimePath: string, seedRelPathFromSrc: string) {
  if (process.env.IS_OFFLINE) return;
  try {
    await fs.access(runtimePath);
  } catch {
    const seedAbs = path.resolve(process.cwd(), seedRelPathFromSrc);
    const data = await fs.readFile(seedAbs, "utf-8");
    await fs.writeFile(runtimePath, data, "utf-8");
  }
}

export class FileJsonStore<T = unknown> {
  private readonly seedRel: string;
  private readonly runtimePath: string;

  constructor(opts: { seedRelativePath: string }) {
    this.seedRel = opts.seedRelativePath;
    this.runtimePath = resolveDataPath(this.seedRel);
  }

  private async ensureReady() {
    await ensureTmpSeed(this.runtimePath, this.seedRel);
  }

  async readAll(): Promise<T[]> {
    await this.ensureReady();
    const raw = await fs.readFile(this.runtimePath, "utf-8");
    return JSON.parse(raw) as T[];
  }

  async writeAll(items: T[]): Promise<void> {
    await this.ensureReady();
    await fs.writeFile(this.runtimePath, JSON.stringify(items, null, 2), "utf-8");
  }

  async update(mutator: (items: T[]) => T[] | void): Promise<void> {
    const items = await this.readAll();
    const next = mutator(items);
    await this.writeAll((next as T[] | undefined) ?? items);
  }
}
