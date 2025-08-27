import { promises as fs } from "fs";
import { resolveDataPath, ensureTmpSeed } from "../../shared/fileStore";
import type { IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import type { AgendamentoEntity } from "../entity/AgendamentoEntity";

const SEED_REL = "src/agendamento/mock/agendamentos.json";
const RUNTIME_FILE = resolveDataPath(SEED_REL);

export class AgendamentoRepository implements IAgendamentoRepository {
  private async ensureReady() {
    await ensureTmpSeed(RUNTIME_FILE, SEED_REL);
  }

  private async readFile(): Promise<AgendamentoEntity[]> {
    await this.ensureReady();
    const data = await fs.readFile(RUNTIME_FILE, "utf-8");
    return JSON.parse(data) as AgendamentoEntity[];
  }

  private async writeFile(items: AgendamentoEntity[]) {
    await this.ensureReady();
    await fs.writeFile(RUNTIME_FILE, JSON.stringify(items, null, 2), "utf-8");
  }

  async save(entity: AgendamentoEntity): Promise<AgendamentoEntity> {
    const items = await this.readFile();
    items.push(entity);
    await this.writeFile(items);
    return entity;
  }

  async exists(medico: string, dataHorario: string): Promise<boolean> {
    const items = await this.readFile();
    return items.some(a => a.medico === medico && a.dataHorario === dataHorario);
  }
}
