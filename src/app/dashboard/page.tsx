"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardMotorista from "../componentes/dashboards/DashboardMotorista";
import DashboardGestor from "../componentes/dashboards/DashboardGestor";

export default function DashboardPage() {
  const route = useRouter();
  const [funcao, setFuncao] = useState<string | null>(null);

  useEffect(() => {
    const storedFuncao = localStorage.getItem("funcao");
    if (!storedFuncao) {
      route.push("/login");
    } else {
      setFuncao(storedFuncao);
    }
  }, []);
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("funcao");
    route.push("/login");
  };

  const renderDashboard = () => {
    if (funcao?.toLowerCase() === "gestor") {
      return <DashboardGestor />;
    } else if (funcao?.toLowerCase() === "motorista") {
      return <DashboardMotorista />;
    }
    return null;
  };

  return (
    <div>
      <header>
        <h1>LogiMax Transportes</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>{renderDashboard()}</main>
    </div>
  );
}