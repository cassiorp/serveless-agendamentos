import type { AgendamentoDTO } from "../dto/AgendamentoDTO";
import { AgendamentoEntity } from "../entity/AgendamentoEntity";

export class AgendamentoMapper {
  static toEntity(dto: AgendamentoDTO): AgendamentoEntity {
    return new AgendamentoEntity({
      medico: dto.medico,
      paciente: dto.paciente,
      dataHorario: dto.dataHorario,
    });
  }

  static toDTO(entity: AgendamentoEntity): AgendamentoDTO {
    return {
      medico: entity.medico ?? "",
      paciente: entity.paciente ?? "",
      dataHorario: entity.dataHorario ?? "",
    };
  }
}
