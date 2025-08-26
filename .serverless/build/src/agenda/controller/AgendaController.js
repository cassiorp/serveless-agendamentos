// src/agenda/repository/AgendaRepository.ts
import { promises as fs } from "fs";
import * as path from "path";
var FILE = path.resolve(process.cwd(), "src/agenda/mock/agendas.json");
var AgendaRepository = class {
  async readFile() {
    const data = await fs.readFile(FILE, "utf-8");
    return JSON.parse(data);
  }
  async writeFile(agendas) {
    await fs.writeFile(FILE, JSON.stringify(agendas, null, 2), "utf-8");
  }
  async findAll() {
    return this.readFile();
  }
  async findById(id) {
    const agendas = await this.readFile();
    return agendas.find((a) => a.id === Number(id)) ?? null;
  }
  async deleteHorario(id, horario) {
    const agendas = await this.readFile();
    const agenda = agendas.find((a) => a.id === Number(id));
    if (!agenda) return;
    const alvo = (horario ?? "").trim();
    agenda.horariosDisponiveis = (agenda.horariosDisponiveis ?? []).map((h) => h.trim()).filter((h) => h !== alvo);
    await this.writeFile(agendas);
  }
};

// src/agenda/entity/AgendaEntity.ts
var AgendaEntity = class {
};

// src/agenda/mapper/AgendaMapper.ts
var AgendaMapper = class {
  static toEntity(dto) {
    const entity = new AgendaEntity();
    entity.id = dto.id;
    entity.nome = dto.nome;
    entity.especialidade = dto.especialidade;
    entity.horariosDisponiveis = dto.horariosDisponiveis;
    return entity;
  }
  static toDTO(entity) {
    return {
      id: entity.id ?? 0,
      nome: entity.nome ?? "",
      especialidade: entity.especialidade ?? "",
      horariosDisponiveis: entity.horariosDisponiveis ?? []
    };
  }
  static toEntityList(dtos) {
    return dtos.map((dto) => this.toEntity(dto));
  }
  static toDTOList(entities) {
    return entities.map((entity) => this.toDTO(entity));
  }
};

// src/agenda/service/AgendaService.ts
var AgendaService = class {
  constructor() {
    this.repository = new AgendaRepository();
  }
  async excluirHorario(id, horario) {
    return this.repository.deleteHorario(id, horario);
  }
  async buscarPorId(id) {
    const entity = await this.repository.findById(id);
    if (!entity) {
      return null;
    }
    return AgendaMapper.toDTO(entity);
  }
  async buscarAgendas() {
    const agendas = await this.repository.findAll();
    return AgendaMapper.toDTOList(agendas);
  }
};

// src/agenda/controller/AgendaController.ts
var service = new AgendaService();
var buscarAgendas = async () => {
  try {
    const result = await service.buscarAgendas();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("Erro ao buscar agendas", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno ao buscar agendas" })
    };
  }
};
export {
  buscarAgendas
};
//# sourceMappingURL=AgendaController.js.map
