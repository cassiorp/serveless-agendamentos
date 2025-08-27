import { AgendamentoService } from "../service/AgendamentoService";
import type { IAgendamentoRepository } from "../interface/IAgendamentoRepository";
import type { IAgendaService } from "../../agenda/interface/IAgendaService";
import type { AgendamentoDTO } from "../dto/AgendamentoDTO";
import type { AgendaDTO } from "../../agenda/dto/AgendaDTO";

class RepoMock implements IAgendamentoRepository {
	saved: any[] = [];
	save = jest.fn(async (entity: any) => {
		this.saved.push(entity);
		return entity;
	});
	exists = jest.fn(async (_m: string, _d: string) => false);
}

class AgendaSvcMock implements IAgendaService {
	buscarAgendas = jest.fn(async () => []);
	buscarPorId = jest.fn(async (_id: number): Promise<AgendaDTO | null> => null);
	excluirHorario = jest.fn(async (_id: number, _h: string) => { });
}

describe("AgendamentoService", () => {
	it("marca agendamento quando payload é válido e horário existe", async () => {
		const repo = new RepoMock();
		const agenda = new AgendaSvcMock();
		agenda.buscarPorId.mockResolvedValue({
			id: 1,
			nome: "Dr. João Silva",
			especialidade: "Cardiologista",
			horariosDisponiveis: ["2024-10-05 09:00", "2024-10-05 10:00"],
		});
		const svc = new AgendamentoService(repo, agenda);
		const dto: AgendamentoDTO = {
			id: 1,
			medico: "Dr. João Silva",
			paciente: "Carlos Almeida",
			dataHorario: "2024-10-05 09:00",
		};
	
		const result = await svc.marcarAgendamento(dto);
		
		expect(result).toEqual(dto);
		expect(repo.save).toHaveBeenCalledTimes(1);
		expect(agenda.excluirHorario).toHaveBeenCalledWith(1, "2024-10-05 09:00");
	});

	it("lança erro quando payload é inválido", async () => {
		const svc = new AgendamentoService(new RepoMock(), new AgendaSvcMock());
		await expect(svc.marcarAgendamento({} as any)).rejects.toThrow(
			"Payload inválido: id, medico, paciente e data_horario são obrigatórios."
		);
	});

	it("lança erro quando médico não é encontrado", async () => {
		const repo = new RepoMock();
		const agenda = new AgendaSvcMock();
		agenda.buscarPorId.mockResolvedValue(null);
		const svc = new AgendamentoService(repo, agenda);
		const dto: AgendamentoDTO = {
			id: 999,
			medico: "N/A",
			paciente: "A",
			dataHorario: "2024-10-05 09:00",
		};
		await expect(svc.marcarAgendamento(dto)).rejects.toThrow("Médico não encontrado.");
		expect(repo.save).not.toHaveBeenCalled();
		expect(agenda.excluirHorario).not.toHaveBeenCalled();
	});

	it("lança erro quando horário é indisponível", async () => {
		const repo = new RepoMock();
		const agenda = new AgendaSvcMock();
		agenda.buscarPorId.mockResolvedValue({
			id: 1,
			nome: "Dr. João Silva",
			especialidade: "Cardiologista",
			horariosDisponiveis: ["2024-10-05 10:00"],
		});
		const svc = new AgendamentoService(repo, agenda);
		const dto: AgendamentoDTO = {
			id: 1,
			medico: "Dr. João Silva",
			paciente: "A",
			dataHorario: "2024-10-05 09:00",
		};
		await expect(svc.marcarAgendamento(dto)).rejects.toThrow("Horário indisponível para este médico.");
		expect(repo.save).not.toHaveBeenCalled();
		expect(agenda.excluirHorario).not.toHaveBeenCalled();
	});
});
