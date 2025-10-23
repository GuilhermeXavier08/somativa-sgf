// app/componentes/dashboards/DashboardGestor.tsx
"use client";

import { IUsuario } from "@/models/Usuario";
import { IVeiculo } from "@/models/Veiculo";
import { IViagem } from "@/models/Viagem";
import { useEffect, useState, FormEvent } from "react";

type View = "VIAGENS" | "VEICULOS" | "MOTORISTAS" | "ALERTAS";

export default function DashboardGestor() {
  const [view, setView] = useState<View>("VIAGENS");

  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [veiculos, setVeiculos] = useState<IVeiculo[]>([]);
  const [viagens, setViagens] = useState<IViagem[]>([]);
  const [alertas, setAlertas] = useState<IVeiculo[]>([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [funcao, setFuncao] = useState("Motorista");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear());
  const [kmAtual, setKmAtual] = useState(0);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [idMotorista, setIdMotorista] = useState("");
  const [idVeiculo, setIdVeiculo] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchUsuarios();
    fetchVeiculos();
    fetchViagens();
  }, []);

  useEffect(() => {
    const veiculosEmAlerta = veiculos.filter(
      (v) => v.kmAtual - v.kmUltimaManutencao >= 10000
    );
    setAlertas(veiculosEmAlerta);
  }, [veiculos]);

  const fetchUsuarios = async () => {
    try {
      const resposta = await fetch("/api/usuarios");
      const data = await resposta.json();
      if (data.success) setUsuarios(data.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };
  const fetchVeiculos = async () => {
    try {
      const resposta = await fetch("/api/veiculos");
      const data = await resposta.json();
      if (data.success) setVeiculos(data.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };
  const fetchViagens = async () => {
    try {
      const resposta = await fetch("/api/viagens");
      const data = await resposta.json();
      if (data.success) setViagens(data.data);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
    }
  };

  const handleCadastroMotoristaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const resposta = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, funcao }),
      });
      const data = await resposta.json();
      if (data.success) {
        setFormSuccess("Motorista cadastrado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
        fetchUsuarios();
      } else {
        setFormError(data.error || "Erro ao cadastrar motorista.");
      }
    } catch (error) {
      setFormError("Ocorreu um erro no servidor.");
    }
  };

  const handleCadastroVeiculoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const resposta = await fetch("/api/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placa,
          modelo,
          ano,
          kmAtual,
          kmUltimaManutencao: kmAtual,
        }),
      });
      const data = await resposta.json();
      if (data.success) {
        setFormSuccess("Veículo cadastrado com sucesso!");
        setPlaca("");
        setModelo("");
        setAno(new Date().getFullYear());
        setKmAtual(0);
        fetchVeiculos();
      } else {
        setFormError(data.error || "Erro ao cadastrar veículo.");
      }
    } catch (error) {
      setFormError("Ocorreu um erro no servidor.");
    }
  };

  const handleAgendarViagemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const resposta = await fetch("/api/viagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origem,
          destino,
          idMotorista,
          idVeiculo,
          status: "Agendada",
          dataAgendada: new Date().toISOString(),
        }),
      });
      const data = await resposta.json();
      if (data.success) {
        setFormSuccess("Viagem agendada com sucesso!");
        setOrigem("");
        setDestino("");
        setIdMotorista("");
        setIdVeiculo("");
        fetchViagens();
      } else {
        setFormError(data.error || "Erro ao agendar viagem.");
      }
    } catch (error) {
      setFormError("Ocorreu um erro no servidor.");
    }
  };

  const handleRegistrarManutencao = async (veiculo: IVeiculo) => {
    if (
      !confirm(
        `Confirmar manutenção do veículo ${veiculo.placa}? \nO KM da última manutenção será atualizado para ${veiculo.kmAtual} km.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/veiculos/${veiculo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kmUltimaManutencao: veiculo.kmAtual }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Manutenção registrada!");
        fetchVeiculos();
      } else {
        alert("Erro ao registrar manutenção.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de servidor ao registrar manutenção.");
    }
  };

  const renderView = () => {
    switch (view) {
      case "ALERTAS":
        return (
          <div>
            <h3>Alertas de Manutenção (Diferencial)</h3>
            <p>Veículos que precisam de manutenção (a cada 10.000 km).</p>
            {alertas.length === 0 ? (
              <p>Nenhum veículo precisa de manutenção.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>KM Atual</th>
                    <th>KM Últ. Manutenção</th>
                    <th>KM desde Manut.</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((v) => (
                    <tr key={v._id} style={{ backgroundColor: "#ffcccc" }}>
                      <td>{v.placa}</td>
                      <td>{v.modelo}</td>
                      <td>{v.kmAtual} km</td>
                      <td>{v.kmUltimaManutencao} km</td>
                      <td>{v.kmAtual - v.kmUltimaManutencao} km</td>
                      <td>
                        <button
                          onClick={() => handleRegistrarManutencao(v)}
                        >
                          Registrar Manutenção
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "VIAGENS":
        return (
          <div>
            <h3>Agendar Nova Viagem</h3>
            <form onSubmit={handleAgendarViagemSubmit} style={formStyle}>
              <input
                type="text"
                placeholder="Origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                required
              />
              <select
                value={idMotorista}
                onChange={(e) => setIdMotorista(e.target.value)}
                required
              >
                <option value="">Selecione um Motorista</option>
                {usuarios
                  .filter((u) => u.funcao === "Motorista")
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.nome}
                    </option>
                  ))}
              </select>
              <select
                value={idVeiculo}
                onChange={(e) => setIdVeiculo(e.target.value)}
                required
              >
                <option value="">Selecione um Veículo</option>
                {veiculos.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.placa} ({v.modelo})
                  </option>
                ))}
              </select>
              <button type="submit">Agendar Viagem</button>
            </form>

            <hr style={hrStyle} />
            <h3>Viagens Agendadas/Em Curso</h3>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Origem</th>
                  <th>Destino</th>
                  <th>Motorista</th>
                  <th>Veículo</th>
                </tr>
              </thead>
              <tbody>
                {viagens.map((v: any) => (
                  <tr key={v._id}>
                    <td>{v.status}</td>
                    <td>{v.origem}</td>
                    <td>{v.destino}</td>
                    <td>{v.idMotorista?.nome || "N/A"}</td>
                    <td>{v.idVeiculo?.placa || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "VEICULOS":
        return (
          <div>
            <h3>Cadastrar Novo Veículo</h3>
            <form onSubmit={handleCadastroVeiculoSubmit} style={formStyle}>
              <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Ano"
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value))}
                required
              />
              <input
                type="number"
                placeholder="KM Atual"
                value={kmAtual}
                onChange={(e) => setKmAtual(parseFloat(e.target.value))}
                required
              />
              <button type="submit">Cadastrar Veículo</button>
            </form>

            <hr style={hrStyle} />
            <h3>Frota de Veículos</h3>
            <table>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>KM Atual</th>
                  <th>KM Últ. Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v._id}>
                    <td>{v.placa}</td>
                    <td>{v.modelo}</td>
                    <td>{v.ano}</td>
                    <td>{v.kmAtual}</td>
                    <td>{v.kmUltimaManutencao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "MOTORISTAS":
        return (
          <div>
            <h3>Cadastrar Novo Motorista</h3>
            <form onSubmit={handleCadastroMotoristaSubmit} style={formStyle}>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <select
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
              >
                <option value="Motorista">Motorista</option>
                <option value="Gestor">Gestor</option>
              </select>
              <button type="submit">Cadastrar</button>
            </form>

            <hr style={hrStyle} />
            <h3>Usuários do Sistema</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.funcao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setView("ALERTAS")}
          style={view === "ALERTAS" ? activeTabStyle : tabStyle}
        >
          Alertas de Manutenção {alertas.length > 0 && `(${alertas.length})`}
        </button>
        <button
          onClick={() => setView("VIAGENS")}
          style={view === "VIAGENS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Viagens
        </button>
        <button
          onClick={() => setView("VEICULOS")}
          style={view === "VEICULOS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Veículos
        </button>
        <button
          onClick={() => setView("MOTORISTAS")}
          style={view === "MOTORISTAS" ? activeTabStyle : tabStyle}
        >
          Gerenciar Motoristas
        </button>
      </nav>

      {(formSuccess && <p style={{ color: "green" }}>{formSuccess}</p>) ||
        (formError && <p style={{ color: "red" }}>{formError}</p>)}

      {renderView()}
    </div>
  );
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "400px",
  marginBottom: "20px",
};

const hrStyle: React.CSSProperties = {
  margin: "40px 0",
};

const tabStyle: React.CSSProperties = {
  padding: "10px",
  cursor: "pointer",
  border: "1px solid #ccc",
  background: "#f0f0f0",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: "#fff",
  borderBottom: "1px solid #fff",
};