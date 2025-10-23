import Usuario, { IUsuario } from "@/models/Usuario";
import connectMongo from "@/services/mongodb";

export const getAllUsuarios = async () => {
  await connectMongo();
  const usuarios = await Usuario.find([]);
  console.log(usuarios);

  return usuarios;
};

export const getOneUsuario = async (id: string) => {
  await connectMongo();
  const usuario = await Usuario.findById(id);
  return usuario;
};

export const createUsuario = async (data: Partial<IUsuario>) => {
  await connectMongo();
  const novoUsuario = new Usuario(data);
  const novoUsuarioId = novoUsuario.save();
  return novoUsuarioId;
};

export const updateUsuario = async (id: string, data: Partial<IUsuario>) => {
  await connectMongo();
  const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, data, {
    new: true,
  });
  return usuarioAtualizado;
};

export const deleteUsuario = async (id: string) => {
  await connectMongo();
  await Usuario.findByIdAndDelete(id);
};

export const autenticaUsuario = async (email: string, senha: string) => {
  await connectMongo();
  const usuario = await Usuario.find({ email }).select("+senha");
  if (!usuario || usuario.length == 0) return null;
  const senhaCorreta = await usuario[0].compareSenha(senha);
  if (!senhaCorreta) return null;
  
  return usuario[0];
};