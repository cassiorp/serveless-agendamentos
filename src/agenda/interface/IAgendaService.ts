import type { AgendaDTO } from "../dto/AgendaDTO";

export interface IAgendaService {
  buscarAgendas(): Promise<AgendaDTO[]>;
  buscarPorId(id: number): Promise<AgendaDTO | null>;
  excluirHorario(id: number, horario: string): Promise<void>;
}
