import type { AgendamentoDTO } from "../dto/AgendamentoDTO";

export interface IAgendamentoService {
  marcarAgendamento(dto: AgendamentoDTO): Promise<AgendamentoDTO>;
}
