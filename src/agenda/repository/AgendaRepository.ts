import { promises as fs } from "fs";
import * as path from "path";
import type { AgendaDTO } from "../dto/AgendaDTO";
import type { IAgendaRepository } from "../interface/IAgendaRepository";

const FILE = path.resolve(process.cwd(), "src/agenda/mock/agendas.json");

export class AgendaRepository implements IAgendaRepository {
  
  private async readFile(): Promise<AgendaDTO[]> {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data) as AgendaDTO[];
  }

  private async writeFile(agendas: AgendaDTO[]): Promise<void> {
    await fs.writeFile(FILE, JSON.stringify(agendas, null, 2), "utf-8");
  }

  async findAll(): Promise<AgendaDTO[]> { return this.readFile(); }
  
  async findById(id: number): Promise<AgendaDTO | null> {
    const agendas = await this.readFile();
    return agendas.find(a => a.id === Number(id)) ?? null;
  }

  async deleteHorario(id: number, horario: string): Promise<void> {
    const agendas = await this.readFile();
    const agenda = agendas.find(a => a.id === Number(id));
    if (!agenda) return;
    const alvo = (horario ?? "").trim();
    agenda.horariosDisponiveis = (agenda.horariosDisponiveis ?? [])
      .map(h => h.trim())
      .filter(h => h !== alvo);
    await this.writeFile(agendas);
  }

}
