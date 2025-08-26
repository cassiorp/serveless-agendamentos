import type { IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import { AgendamentoEntity } from "../entity/AgendamentoEntity";
import { agendamentosMock } from "../mock/agendamento.mock";

export class AgendamentoRepository implements IAgendamentoRepository {
    async save(entity: AgendamentoEntity): Promise<AgendamentoEntity> {
        agendamentosMock.push(entity);
        return entity;
    }

    async exists(medico: string, dataHorario: string): Promise<boolean> {
        return agendamentosMock.some(
            (a: { medico: string; dataHorario: string; }) => a.medico === medico && a.dataHorario === dataHorario
        );
    }
}
