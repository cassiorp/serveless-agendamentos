// src/agendamento/repository/AgendamentoRepository.ts
import type { IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import type { AgendamentoEntity } from "../entity/AgendamentoEntity";
import { FileJsonStore } from "../../shared/FileJsonStore";

export class AgendamentoRepository implements IAgendamentoRepository {
  private store = new FileJsonStore<AgendamentoEntity>({ seedRelativePath: "src/agendamento/mock/agendamentos.json" });

  async save(entity: AgendamentoEntity): Promise<AgendamentoEntity> {
    await this.store.update(items => { items.push(entity); });
    return entity;
  }

  async exists(medico: string, dataHorario: string): Promise<boolean> {
    const items = await this.store.readAll();
    return items.some(a => a.medico === medico && a.dataHorario === dataHorario);
  }
}
