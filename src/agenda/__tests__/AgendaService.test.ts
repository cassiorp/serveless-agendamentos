import { AgendaService } from "../service/AgendaService";
import { AgendaRepository } from "../repository/AgendaRepository";
import type { AgendaDTO } from "../dto/AgendaDTO";

const seed: AgendaDTO[] = [
  {
    id: 1,
    nome: "Dr. João Silva",
    especialidade: "Cardiologista",
    horariosDisponiveis: ["2024-10-05 09:00", "2024-10-05 10:00", "2024-10-05 11:00"],
  },
  {
    id: 2,
    nome: "Dra. Maria Souza",
    especialidade: "Dermatologista",
    horariosDisponiveis: ["2024-10-06 14:00", "2024-10-06 15:00"],
  },
];

describe("AgendaService", () => {
  let service: AgendaService;

  beforeEach(() => {
    service = new AgendaService();
    jest.clearAllMocks();
  });

  it("buscarAgendas retorna a lista do repositório", async () => {
    jest.spyOn(AgendaRepository.prototype, "findAll").mockResolvedValueOnce(seed as any);
    const result = await service.buscarAgendas();
    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe("Dr. João Silva");
    expect(AgendaRepository.prototype.findAll).toHaveBeenCalledTimes(1);
  });

  it("buscarPorId retorna o item quando existir", async () => {
    jest.spyOn(AgendaRepository.prototype, "findById").mockResolvedValueOnce(seed[0] as any);
    const result = await service.buscarPorId(1);
    expect(result?.id).toBe(1);
    expect(AgendaRepository.prototype.findById).toHaveBeenCalledWith(1);
  });

  it("buscarPorId retorna null quando não existir", async () => {
    jest.spyOn(AgendaRepository.prototype, "findById").mockResolvedValueOnce(null as any);
    const result = await service.buscarPorId(999);
    expect(result).toBeNull();
    expect(AgendaRepository.prototype.findById).toHaveBeenCalledWith(999);
  });

  it("excluirHorario delega para o repositório", async () => {
    const spy = jest.spyOn(AgendaRepository.prototype, "deleteHorario").mockResolvedValueOnce();
    await service.excluirHorario(1, "2024-10-05 10:00");
    expect(spy).toHaveBeenCalledWith(1, "2024-10-05 10:00");
  });
});
