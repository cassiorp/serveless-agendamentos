import type { AgendaDTO } from "../dto/AgendaDTO";
import { AgendaEntity } from "../entity/AgendaEntity";

export class AgendaMapper {
  static toEntity(dto: AgendaDTO): AgendaEntity {
    const entity = new AgendaEntity();
    entity.id = dto.id;
    entity.nome = dto.nome;
    entity.especialidade = dto.especialidade;
    entity.horariosDisponiveis = dto.horariosDisponiveis;
    return entity;
  }

  static toDTO(entity: AgendaEntity): AgendaDTO {
    return {
      id: entity.id ?? 0,
      nome: entity.nome ?? "",
      especialidade: entity.especialidade ?? "",
      horariosDisponiveis: entity.horariosDisponiveis ?? [],
    };
  }

  static toEntityList(dtos: AgendaDTO[]): AgendaEntity[] {
    return dtos.map((dto) => this.toEntity(dto));
  }

  static toDTOList(entities: AgendaEntity[]): AgendaDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
