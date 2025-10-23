// app/componentes/dashboards/DashboardMotorista.tsx
"use client";

import { IViagem } from "@/models/Viagem";
import { IVeiculo } from "@/models/Veiculo";
import { useEffect, useState, FormEvent } from "react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  nome: string;
  funcao: string;
}

export default function DashboardMotorista() {
  const [viagens, setViagens] = useState<IViagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motoristaId, setMotoristaId] = useState<string | null>(null);

  const [viagemSelecionada, setViagemSelecionada] = useState<IViagem | null>(
    null
  );
  const [kmAtualInput, setKmAtualInput] = useState("");
  const [kmError, setKmError] = useState("");
  const [veiculoDaViagem, setVeiculoDaViagem] = useState<IVeiculo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      setMotoristaId(decoded.id);
      fetchViagens(decoded.id);
    }
  }, []);

  const fetchViagens = async (idMotorista: string) => {
    try {
      setLoading(true);
      const resposta = await fetch("/api/viagens");
      const data = await resposta.json();
      if (data.success) {
        const minhasViagens = data.data.filter(
          (viagem: any) => viagem.idMotorista?._id === idMotorista
        );
        setViagens(minhasViagens);
      } else {
        setError(data.error || "Erro ao buscar viagens.");
      }
    } catch (error) {
      console.error(error);
      setError("Erro de conexão ao buscar viagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarViagem = async (viagemId: string) => {
    try {
      const res = await fetch(`/api/viagens/${viagemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Em Curso",
          dataInicio: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success && motoristaId) {
        fetchViagens(motoristaId);
      }
    } catch (error) {
      console.error("Erro ao iniciar viagem:", error);
    }
  };

  const handleAbrirModalFinalizar = async (viagem: IViagem) => {
    try {
      const res = await fetch(`/api/veiculos/${viagem.idVeiculo._id}`);
      const data = await res.json();
      if (data.success) {
        setVeiculoDaViagem(data.data);
        setKmAtualInput(data.data.kmAtual.toString());
        setViagemSelecionada(viagem);
        setKmError("");
      }
    } catch (error) {
      setKmError("Erro ao buscar dados do veículo.");
    }
  };

  const handleFinalizarViagemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!viagemSelecionada || !veiculoDaViagem) return;

    const novaKm = parseFloat(kmAtualInput);
    if (isNaN(novaKm) || novaKm < veiculoDaViagem.kmAtual) {
      setKmError(
        `KM inválido. Deve ser um número maior ou igual a ${veiculoDaViagem.kmAtual}.`
      );
      return;
    }

    try {
      const resVeiculo = await fetch(`/api/veiculos/${veiculoDaViagem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kmAtual: novaKm }),
      });
      const dataVeiculo = await resVeiculo.json();
      if (!dataVeiculo.success) throw new Error("Falha ao atualizar veículo.");

      const resViagem = await fetch(`/api/viagens/${viagemSelecionada._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Finalizada",
          dataFim: new Date().toISOString(),
        }),
      });
      const dataViagem = await resViagem.json();
      if (!dataViagem.success) throw new Error("Falha ao finalizar viagem.");

      setViagemSelecionada(null);
      if (motoristaId) fetchViagens(motoristaId);
    } catch (error: any) {
      console.error(error);
      setKmError(error.message || "Erro ao salvar dados.");
    }
  };

  if (loading) return <p>Carregando minhas viagens...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Minhas Viagens</h3>
      <table>
        <thead>
          <tr>
            <th>Origem</th>
            <th>Destino</th>
            <th>Veículo</th>
            <th>Status</th>
            <th>Agendada para</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {viagens.map((viagem: any) => (
            <tr key={viagem._id}>
              <td>{viagem.origem}</td>
              <td>{viagem.destino}</td>
              <td>
                {viagem.idVeiculo?.placa} ({viagem.idVeiculo?.modelo})
              </td>
              <td>{viagem.status}</td>
              <td>{new Date(viagem.dataAgendada).toLocaleString("pt-BR")}</td>
              <td>
                {viagem.status === "Agendada" && (
                  <button onClick={() => handleIniciarViagem(viagem._id)}>
                    Iniciar Viagem
                  </button>
                )}
                {viagem.status === "Em Curso" && (
                  <button onClick={() => handleAbrirModalFinalizar(viagem)}>
                    Finalizar Viagem
                  </button>
                )}
                {viagem.status === "Finalizada" && <span>Concluída</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viagemSelecionada && veiculoDaViagem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <form onSubmit={handleFinalizarViagemSubmit}>
              <h4>
                Finalizar Viagem: {viagemSelecionada.origem} p/{" "}
                {viagemSelecionada.destino}
              </h4>
              <p>
                Veículo: {veiculoDaViagem.placa} ({veiculoDaViagem.modelo})
              </p>
              <p>KM anterior: {veiculoDaViagem.kmAtual} km</p>
              <div>
                <label htmlFor="kmAtual">KM Atualizado (no painel):</label>
                <input
                  type="number"
                  id="kmAtual"
                  value={kmAtualInput}
                  onChange={(e) => setKmAtualInput(e.target.value)}
                  min={veiculoDaViagem.kmAtual}
                  required
                />
              </div>
              {kmError && <p style={{ color: "red" }}>{kmError}</p>}
              <div style={{ marginTop: "10px" }}>
                <button type="button" onClick={() => setViagemSelecionada(null)}>
                  Cancelar
                </button>
                <button type="submit" style={{ marginLeft: "10px" }}>
                  Confirmar Finalização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}