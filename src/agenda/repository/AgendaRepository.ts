import type { AgendaDTO } from "../dto/AgendaDTO";
import type { IAgendaRepository } from "../interface/IAgendaRepository";
import { FileJsonStore } from "../../shared/FileJsonStore";

export class AgendaRepository implements IAgendaRepository {
  private store = new FileJsonStore<AgendaDTO>({ seedRelativePath: "src/agenda/mock/agendas.json" });

  async findAll(): Promise<AgendaDTO[]> {
    return this.store.readAll();
  }

  async findById(id: number): Promise<AgendaDTO | null> {
    const items = await this.store.readAll();
    return items.find(a => a.id === Number(id)) ?? null;
  }

  async deleteHorario(id: number, horario: string): Promise<void> {
    const alvo = (horario ?? "").trim();
    await this.store.update(items => {
      const agenda = items.find(a => a.id === Number(id));
      if (!agenda) return;
      agenda.horariosDisponiveis = (agenda.horariosDisponiveis ?? [])
        .map(h => h.trim())
        .filter(h => h !== alvo);
    });
  }
}
