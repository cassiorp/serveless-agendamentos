import { promises as fs } from "fs";
import * as path from "path";
import type { IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import type { AgendamentoEntity } from "../entity/AgendamentoEntity";

const FILE = path.resolve(process.cwd(), "src/agendamento/mock/agendamentos.json");

export class AgendamentoRepository implements IAgendamentoRepository {

  private async readFile(): Promise<AgendamentoEntity[]> {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data) as AgendamentoEntity[];
  }

  private async writeFile(items: AgendamentoEntity[]): Promise<void> {
    await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
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
