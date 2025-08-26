import { AgendamentoEntity } from "../entity/AgendamentoEntity";

export interface IAgendamentoRepository {
  save(entity: AgendamentoEntity): Promise<AgendamentoEntity>;
  exists(medico: string, dataHorario: string): Promise<boolean>;
}
