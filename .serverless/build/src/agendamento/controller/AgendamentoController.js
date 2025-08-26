// src/agendamento/mock/agendamento.mock.ts
var agendamentosMock = [];

// src/agendamento/repository/AgendamentoRepository.ts
var AgendamentoRepository = class {
  async save(entity) {
    agendamentosMock.push(entity);
    return entity;
  }
  async exists(medico, dataHorario) {
    return agendamentosMock.some(
      (a) => a.medico === medico && a.dataHorario === dataHorario
    );
  }
};

// src/agendamento/entity/AgendamentoEntity.ts
var AgendamentoEntity = class {
  constructor(init) {
    Object.assign(this, init);
  }
};

// src/agendamento/mapper/AgendamentoMapper.ts
var AgendamentoMapper = class {
  static toEntity(dto) {
    return new AgendamentoEntity({
      medico: dto.medico,
      paciente: dto.paciente,
      dataHorario: dto.dataHorario
    });
  }
  static toDTO(entity) {
    return {
      medico: entity.medico ?? "",
      paciente: entity.paciente ?? "",
      dataHorario: entity.dataHorario ?? ""
    };
  }
};

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

// src/agendamento/service/AgendamentoService.ts
var AgendamentoService = class {
  constructor(repository, agendaService) {
    this.repository = repository ?? new AgendamentoRepository();
    this.agendaService = agendaService ?? new AgendaService();
  }
  async marcarAgendamento(dto) {
    if (!dto?.id || !dto?.medico || !dto?.paciente || !dto?.dataHorario) {
      throw new Error("Payload inv\xE1lido: id, medico, paciente e data_horario s\xE3o obrigat\xF3rios.");
    }
    const medicoAgenda = await this.agendaService.buscarPorId(dto.id);
    if (!medicoAgenda) {
      throw new Error("M\xE9dico n\xE3o encontrado.");
    }
    const horarioExiste = medicoAgenda.horariosDisponiveis.includes(dto.dataHorario);
    if (!horarioExiste) {
      throw new Error("Hor\xE1rio indispon\xEDvel para este m\xE9dico.");
    }
    const entity = AgendamentoMapper.toEntity(dto);
    const salvo = await this.repository.save(entity);
    await this.agendaService.excluirHorario(dto.id, dto.dataHorario);
    return AgendamentoMapper.toDTO(salvo);
  }
};

// src/agendamento/controller/AgendamentoController.ts
var service = new AgendamentoService();
var marcarAgendamento = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const dto = body?.agendamento;
    const agendamento = await service.marcarAgendamento(dto);
    return {
      statusCode: 201,
      body: JSON.stringify({
        mensagem: "Agendamento realizado com sucesso",
        agendamento
      })
    };
  } catch (err) {
    console.error("Erro ao marcar agendamento:", err?.message || err);
    const msg = String(err?.message || "Erro interno");
    const statusCode = msg.includes("inv\xE1lido") ? 400 : msg.includes("Hor\xE1rio indispon\xEDvel") ? 422 : msg.includes("j\xE1 reservado") ? 409 : msg.includes("M\xE9dico n\xE3o encontrado") ? 404 : 500;
    return {
      statusCode,
      body: JSON.stringify({ mensagem: msg })
    };
  }
};
export {
  marcarAgendamento
};
//# sourceMappingURL=AgendamentoController.js.map
