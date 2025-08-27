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
    horariosDisponiveis: ["2024-10-05 09:00", "2024-10-05 10:00", "2024-10-05 11:00"]
  },
  {
    id: 2,
    nome: "Dra. Maria Souza",
    especialidade: "Dermatologista",
    horariosDisponiveis: ["2024-10-06 14:00", "2024-10-06 15:00"]
  }
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

  it("findAll deve ler o arquivo e retornar a lista", async () => {
    const result = await repo.findAll();

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe("Dr. João Silva");
  });

  it("findById deve retornar o item correto", async () => {
    const a1 = await repo.findById(1);
    const a2 = await repo.findById(2);
    const a3 = await repo.findById(999);

    expect(readFileMock).toHaveBeenCalledTimes(3);
    expect(a1?.id).toBe(1);
    expect(a2?.id).toBe(2);
    expect(a3).toBeNull();
  });

  it("deleteHorario deve remover o slot e salvar arquivo", async () => {

    const local = JSON.parse(JSON.stringify(seed)) as AgendaDTO[];
    readFileMock.mockResolvedValueOnce(JSON.stringify(local)) 
                 .mockResolvedValueOnce(JSON.stringify(local)); 

    await repo.deleteHorario(1, "2024-10-05 10:00");

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const [_, jsonGravado] = writeFileMock.mock.calls[0];
    const gravado = JSON.parse(jsonGravado) as AgendaDTO[];

    const agenda1 = gravado.find(a => a.id === 1)!;
    expect(agenda1.horariosDisponiveis).toEqual([
      "2024-10-05 09:00",
      "2024-10-05 11:00",
    ]);
  });

  it("deleteHorario deve normalizar espaços e não falhar quando agenda não existe", async () => {
    const local = JSON.parse(JSON.stringify(seed)) as AgendaDTO[];
    readFileMock.mockResolvedValue(JSON.stringify(local));

    
    await repo.deleteHorario(999, " 2024-10-05 09:00 ");
    expect(writeFileMock).not.toHaveBeenCalled();

    readFileMock.mockResolvedValue(JSON.stringify(local));
    await repo.deleteHorario(1, " 2024-10-05 09:00 ");
    expect(writeFileMock).toHaveBeenCalledTimes(1);

    const gravado = JSON.parse(writeFileMock.mock.calls[0][1]) as AgendaDTO[];
    const agenda1 = gravado.find(a => a.id === 1)!;
    expect(agenda1.horariosDisponiveis).toEqual([
      "2024-10-05 10:00",
      "2024-10-05 11:00",
    ]);
  });
});
