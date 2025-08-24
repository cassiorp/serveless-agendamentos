import type { AgendaDTO } from "../dto/AgendaDTO";
import type { IAgendaService } from "../interface/IAgendaService";
import { AgendaRepository } from "../repository/AgendaRepository";
import { AgendaMapper } from "../mapper/AgendaMapper";

export class AgendaService implements IAgendaService {
  private repository: AgendaRepository;

  constructor() {
    this.repository = new AgendaRepository();
  }

  async buscarAgendas(): Promise<AgendaDTO[]> {
    const agendas = await this.repository.findAll();
    return AgendaMapper.toDTOList(agendas);
  }
}
