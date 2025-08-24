import type { AgendaEntity } from "../entity/AgendaEntity";
import type { IAgendaRepository } from "../interface/IAgendaRepository";
import { agendasMock } from "../mocks/agendas.mock";

export class AgendaRepository implements IAgendaRepository {
  async findAll(): Promise<AgendaEntity[]> {
    return agendasMock;
  }
}