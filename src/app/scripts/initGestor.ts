import mongoose from "mongoose";
// ESTÁ CORRETO (para CommonJS)
import Usuario from "../../models/Usuario";
import connectMongo from "../../services/mongodb";

const GESTOR_NOME = "Gestor Administrador";
const GESTOR_EMAIL = "gestor@logimax.com";
const GESTOR_SENHA = "admin123";

const criarGestor = async () => {

  try {
    await connectMongo();
    console.log("Conectado ao MongoDB.");

    const gestorExiste = await Usuario.findOne({ email: GESTOR_EMAIL });

    if (!gestorExiste) {
      console.log("Criando novo usuário Gestor...");
      const gestor = new Usuario({
        nome: GESTOR_NOME,
        email: GESTOR_EMAIL,
        senha: GESTOR_SENHA,
        funcao: "Gestor",
      });
      await gestor.save();
      console.log("Usuário Gestor criado com sucesso!");
    } else {
      console.log("O usuário Gestor com este email já existe.");
    }
  } catch (error) {
    console.error("Erro ao executar o script:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexão com o MongoDB fechada.");
  }
};

criarGestor();
