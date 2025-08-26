import type { AgendaEntity } from "../entity/AgendaEntity";

export interface IAgendaRepository {
  findAll(): Promise<AgendaEntity[]>;
  findById(id: number): Promise<AgendaEntity | null>;
  deleteHorario(id: number, horario: string): Promise<void>;
}
