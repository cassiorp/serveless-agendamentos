import { AgendamentoRepository } from "../repository/AgendamentoRepository";
import type { AgendamentoEntity } from "../entity/AgendamentoEntity";
import { promises as fs } from "fs";

jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const accessMock = fs.access as unknown as jest.Mock;
const readFileMock = fs.readFile as unknown as jest.Mock;
const writeFileMock = fs.writeFile as unknown as jest.Mock;

const seed: AgendamentoEntity[] = [
  { medico: "Dr. João Silva", paciente: "Carlos Almeida", dataHorario: "2024-10-05 09:00", id: 0 },
  { medico: "Dra. Maria Souza", paciente: "Ana Lima", dataHorario: "2024-10-06 14:00", id: 0 },
];

describe("AgendamentoRepository", () => {
  let repo: AgendamentoRepository;

  beforeAll(() => {
    process.env.IS_OFFLINE = "true";
  });

  beforeEach(() => {
    repo = new AgendamentoRepository();
    accessMock.mockResolvedValue(undefined);
    readFileMock.mockResolvedValue(JSON.stringify(seed));
    writeFileMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists retorna true quando há agendamento para médico e horário", async () => {
    const r = await repo.exists("Dr. João Silva", "2024-10-05 09:00");
    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(r).toBe(true);
  });

  it("exists retorna false quando não há agendamento correspondente", async () => {
    const r = await repo.exists("Dr. João Silva", "2024-10-05 15:00");
    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(r).toBe(false);
  });

  it("save adiciona o agendamento e persiste no arquivo", async () => {
    const novo: AgendamentoEntity = { medico: "Dr. João Silva", paciente: "Bruno", dataHorario: "2024-10-05 10:00", id: 0 };
    await repo.save(novo);

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(1);

    const jsonGravado = writeFileMock.mock.calls[0][1] as string;
    const gravado = JSON.parse(jsonGravado) as AgendamentoEntity[];
    expect(gravado).toHaveLength(seed.length + 1);
    expect(gravado.some(a => a.medico === novo.medico && a.paciente === novo.paciente && a.dataHorario === novo.dataHorario)).toBe(true);
  });

  it("save funciona quando o arquivo está vazio", async () => {
    readFileMock.mockResolvedValueOnce("[]");
    const novo: AgendamentoEntity = { medico: "Dr. X", paciente: "Y", dataHorario: "2024-12-01 09:00", id: 0 };
    await repo.save(novo);

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const gravado = JSON.parse(writeFileMock.mock.calls[0][1]) as AgendamentoEntity[];
    expect(gravado).toEqual([novo]);
  });
});
