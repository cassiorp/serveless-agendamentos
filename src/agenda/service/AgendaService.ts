import type { AgendaDTO } from "../dto/AgendaDTO";
import type { IAgendaService } from "../interface/IAgendaService";
import { AgendaRepository } from "../repository/AgendaRepository";
import { AgendaMapper } from "../mapper/AgendaMapper";
import type { IAgendaRepository } from "../interface/IAgendaRepository";

export class AgendaService implements IAgendaService {
  private repository: IAgendaRepository;

  constructor() {
    this.repository = new AgendaRepository();
  }

  async excluirHorario(id: number, horario: string): Promise<void> {
    return this.repository.deleteHorario(id, horario);
  }
  
  async buscarPorId(id: number): Promise<AgendaDTO | null> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      return null;
    }
    return AgendaMapper.toDTO(entity);
  }

  async buscarAgendas(): Promise<AgendaDTO[]> {
    const agendas = await this.repository.findAll();
    return AgendaMapper.toDTOList(agendas);
  }
}
