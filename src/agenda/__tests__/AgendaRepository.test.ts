import { AgendaRepository } from "../repository/AgendaRepository";
import type { AgendaDTO } from "../dto/AgendaDTO";
import { promises as fs } from "fs";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const readFileMock = fs.readFile as unknown as jest.Mock;
const writeFileMock = fs.writeFile as unknown as jest.Mock;

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

describe("AgendaRepository", () => {
  let repo: AgendaRepository;

  beforeEach(() => {
    repo = new AgendaRepository();
    readFileMock.mockResolvedValue(JSON.stringify(seed));
    writeFileMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("findAll deve retornar a lista lida do arquivo", async () => {
    const result = await repo.findAll();
    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe("Dr. João Silva");
  });

  it("findById deve retornar o registro correto ou null", async () => {
    const r1 = await repo.findById(1);
    const r2 = await repo.findById(2);
    const r3 = await repo.findById(999);
    expect(readFileMock).toHaveBeenCalledTimes(3);
    expect(r1?.id).toBe(1);
    expect(r2?.id).toBe(2);
    expect(r3).toBeNull();
  });

  it("deleteHorario deve remover o horário e persistir alteração", async () => {
    const local: AgendaDTO[] = JSON.parse(JSON.stringify(seed));
    readFileMock.mockResolvedValueOnce(JSON.stringify(local));
    await repo.deleteHorario(1, "2024-10-05 10:00");
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const gravado = JSON.parse(writeFileMock.mock.calls[0][1]) as AgendaDTO[];
    const agenda1 = gravado.find(a => a.id === 1)!;
    expect(agenda1.horariosDisponiveis).toEqual(["2024-10-05 09:00", "2024-10-05 11:00"]);
  });

  it("deleteHorario não persiste quando a agenda não existe", async () => {
    await repo.deleteHorario(999, "2024-10-05 09:00");
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it("deleteHorario deve normalizar espaços ao comparar horários", async () => {
    const local: AgendaDTO[] = JSON.parse(JSON.stringify(seed));
    readFileMock.mockResolvedValueOnce(JSON.stringify(local));
    await repo.deleteHorario(1, " 2024-10-05 09:00 ");
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const gravado = JSON.parse(writeFileMock.mock.calls[0][1]) as AgendaDTO[];
    const agenda1 = gravado.find(a => a.id === 1)!;
    expect(agenda1.horariosDisponiveis).toEqual(["2024-10-05 10:00", "2024-10-05 11:00"]);
  });
});
