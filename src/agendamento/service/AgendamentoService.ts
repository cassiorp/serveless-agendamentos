import type { IAgendamentoService } from "../interface/IAgendamentoService";
import type { AgendamentoDTO } from "../dto/AgendamentoDTO";
import type{ IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import{ AgendamentoRepository } from "../repository/AgendamentoRepository";
import { AgendamentoMapper } from "../mapper/AgendamentoMapper";
import type { IAgendaService } from "../../agenda/interface/IAgendaService";
import type { AgendaDTO } from "../../agenda/dto/AgendaDTO";
import { AgendaService } from "../../agenda/service/AgendaService";


export class AgendamentoService implements IAgendamentoService {
  private repository: IAgendamentoRepository;
  private agendaService: IAgendaService;
  
  constructor(repository?: IAgendamentoRepository, agendaService?: IAgendaService) {
    this.repository = repository ?? new AgendamentoRepository();
    this.agendaService = agendaService ?? new AgendaService();
  }
  

  async marcarAgendamento(dto: AgendamentoDTO): Promise<AgendamentoDTO> {
    
    if (!dto?.id || !dto?.medico || !dto?.paciente || !dto?.dataHorario) {
      throw new Error("Payload inválido: id, medico, paciente e data_horario são obrigatórios.");
    }

    const medicoAgenda: AgendaDTO | null = await this.agendaService.buscarPorId(dto.id);
    if (!medicoAgenda) {
      throw new Error("Médico não encontrado.");
    }

    const horarioExiste = medicoAgenda.horariosDisponiveis.includes(dto.dataHorario);
    if (!horarioExiste) {
      throw new Error("Horário indisponível para este médico.");
    }

    const entity = AgendamentoMapper.toEntity(dto);
    const salvo = await this.repository.save(entity);
    await this.agendaService.excluirHorario(dto.id, dto.dataHorario);

    return AgendamentoMapper.toDTO(salvo);
  }
}
