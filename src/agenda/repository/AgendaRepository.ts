import { promises as fs } from "fs";
import { resolveDataPath, ensureTmpSeed } from "../../shared/fileStore";
import type { AgendaDTO } from "../dto/AgendaDTO";
import type { IAgendaRepository } from "../interface/IAgendaRepository";

const SEED_REL = "src/agenda/mock/agendas.json";
const RUNTIME_FILE = resolveDataPath(SEED_REL);

export class AgendaRepository implements IAgendaRepository {
  private async ensureReady() {
    await ensureTmpSeed(RUNTIME_FILE, SEED_REL);
  }

  private async readFile(): Promise<AgendaDTO[]> {
    await this.ensureReady();
    const data = await fs.readFile(RUNTIME_FILE, "utf-8");
    return JSON.parse(data) as AgendaDTO[];
  }

  private async writeFile(items: AgendaDTO[]) {
    await this.ensureReady();
    await fs.writeFile(RUNTIME_FILE, JSON.stringify(items, null, 2), "utf-8");
  }

  async findAll(): Promise<AgendaDTO[]> {
    return this.readFile();
  }

  async findById(id: number): Promise<AgendaDTO | null> {
    const items = await this.readFile();
    return items.find(a => a.id === Number(id)) ?? null;
  }

  async deleteHorario(id: number, horario: string): Promise<void> {
    const items = await this.readFile();
    const agenda = items.find(a => a.id === Number(id));
    if (!agenda) return;
    const alvo = (horario ?? "").trim();
    agenda.horariosDisponiveis = (agenda.horariosDisponiveis ?? [])
      .map(h => h.trim())
      .filter(h => h !== alvo);
    await this.writeFile(items);
  }
}
