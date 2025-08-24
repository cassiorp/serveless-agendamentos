"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/agenda/controller/AgendaController.ts
var AgendaController_exports = {};
__export(AgendaController_exports, {
  buscarAgendas: () => buscarAgendas
});
module.exports = __toCommonJS(AgendaController_exports);

// src/agenda/mocks/agendas.mock.ts
var agendasMock = [
  {
    id: 1,
    nome: "Dr. Jo\xE3o Silva",
    especialidade: "Cardiologista",
    horariosDisponiveis: [
      "2024-10-05 09:00",
      "2024-10-05 10:00",
      "2024-10-05 11:00"
    ]
  },
  {
    id: 2,
    nome: "Dra. Maria Souza",
    especialidade: "Dermatologista",
    horariosDisponiveis: [
      "2024-10-06 14:00",
      "2024-10-06 15:00"
    ]
  }
];

// src/agenda/repository/AgendaRepository.ts
var AgendaRepository = class {
  async findAll() {
    return agendasMock;
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
    entity.horariosDisponiveis = dto.horarios_disponiveis;
    return entity;
  }
  static toDTO(entity) {
    return {
      id: entity.id ?? 0,
      nome: entity.nome ?? "",
      especialidade: entity.especialidade ?? "",
      horarios_disponiveis: entity.horariosDisponiveis ?? []
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buscarAgendas
});
//# sourceMappingURL=AgendaController.js.map
