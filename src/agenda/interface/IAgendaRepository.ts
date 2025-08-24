import type { AgendaEntity } from "../entity/AgendaEntity";

export interface IAgendaRepository {
  findAll(): Promise<AgendaEntity[]>;
}
