import type { AgendaDTO } from "../dto/AgendaDTO";

export interface IAgendaService {
  buscarAgendas(): Promise<AgendaDTO[]>;
}
