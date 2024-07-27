import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuarioId, setNuevoUsuarioId] = useState('');
  const [nuevoUsuarioNombre, setNuevoUsuarioNombre] = useState('');
  const [nuevoUsuarioActivo, setNuevoUsuarioActivo] = useState(false);
  const [nuevoUsuarioComentario, setNuevoUsuarioComentario] = useState('');
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [mensaje, setMensaje] = useState(''); // Estado para mensajes
  const [tipoMensaje, setTipoMensaje] = useState(''); // Tipo de mensaje (success, error)

  const handleNuevoUsuarioId = (e) => {
    setNuevoUsuarioId(e.target.value);
  };

  const handleNuevoNombre = (e) => {
    setNuevoUsuarioNombre(e.target.value);
  };

  const handleNuevoActivo = (e) => {
    setNuevoUsuarioActivo(e.target.checked);
  };

  const handleNuevoComentario = (e) => {
    setNuevoUsuarioComentario(e.target.value);
  };

  const mostrarMensaje = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje('');
    }, 3000); // Mensaje desaparece después de 3 segundos
  };

  const handleAgregarUsuario = () => {
    if (usuarios.some(u => u.id === nuevoUsuarioId)) {
      mostrarMensaje('El ID del usuario ya existe.', 'danger');
      return;
    }
    const nuevoUsuario = {
      id: nuevoUsuarioId,
      nombre: nuevoUsuarioNombre,
      activo: nuevoUsuarioActivo,
      comentario: nuevoUsuarioComentario
    };
    setUsuarios(prev => {
      const nuevoArreglo = [...prev, nuevoUsuario];
      localStorage.setItem("usuarios", JSON.stringify(nuevoArreglo));
      mostrarMensaje('Usuario añadido exitosamente.', 'success');
      return nuevoArreglo;
    });
    setNuevoUsuarioId('');
    setNuevoUsuarioNombre('');
    setNuevoUsuarioActivo(false);
    setNuevoUsuarioComentario('');
  };

  const handleEliminarUsuario = (idUsuario) => {
    setUsuarios(prev => {
      const resultadosEliminados = prev.filter(objeto => objeto.id !== idUsuario);
      localStorage.setItem("usuarios", JSON.stringify(resultadosEliminados));
      mostrarMensaje('Usuario eliminado exitosamente.', 'success');
      return resultadosEliminados;
    });
  };

  const handleEditarUsuario = (usuario) => {
    setEditandoUsuario(usuario);
    setNuevoUsuarioId(usuario.id);
    setNuevoUsuarioNombre(usuario.nombre);
    setNuevoUsuarioActivo(usuario.activo);
    setNuevoUsuarioComentario(usuario.comentario);
  };

  const handleGuardarEdicion = () => {
    if (usuarios.some(u => u.id === nuevoUsuarioId && u.id !== editandoUsuario.id)) {
      mostrarMensaje('El ID del usuario ya existe.', 'danger');
      return;
    }
    setUsuarios(prev => {
      const usuariosActualizados = prev.map(u =>
        u.id === editandoUsuario.id ? {
          ...u,
          id: nuevoUsuarioId,
          nombre: nuevoUsuarioNombre,
          activo: nuevoUsuarioActivo,
          comentario: nuevoUsuarioComentario
        } : u
      );
      localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
      mostrarMensaje('Usuario actualizado exitosamente.', 'success');
      return usuariosActualizados;
    });
    setEditandoUsuario(null);
    setNuevoUsuarioId('');
    setNuevoUsuarioNombre('');
    setNuevoUsuarioActivo(false);
    setNuevoUsuarioComentario('');
  };

  const handleCancelarEdicion = () => {
    setEditandoUsuario(null);
    setNuevoUsuarioId('');
    setNuevoUsuarioNombre('');
    setNuevoUsuarioActivo(false);
    setNuevoUsuarioComentario('');
  };

  useEffect(() => {
    const usuariosAlmacenados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(usuariosAlmacenados);
  }, []);

  return (
    <div className="container mt-5">
      {mensaje && (
        <div className={`alert alert-${tipoMensaje} alert-dismissible fade show`} role="alert">
          {mensaje}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <div className="card mb-4">
        <div className="card-header">
          <h4>{editandoUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group mb-3">
              <label htmlFor="id_usuario">ID Usuario</label>
              <input
                type="number"
                className="form-control"
                value={nuevoUsuarioId}
                onChange={handleNuevoUsuarioId}
                id="id_usuario"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="nombre_usuario">Nombre Usuario</label>
              <input
                type="text"
                className="form-control"
                value={nuevoUsuarioNombre}
                onChange={handleNuevoNombre}
                id="nombre_usuario"
                placeholder="Ingrese un usuario"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="activo_usuario">Activo</label>
              <input
                type="checkbox"
                className="form-check-input"
                checked={nuevoUsuarioActivo}
                onChange={handleNuevoActivo}
                id="activo_usuario"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="comentario_usuario">Comentario</label>
              <textarea
                className="form-control"
                value={nuevoUsuarioComentario}
                onChange={handleNuevoComentario}
                id="comentario_usuario"
                placeholder="Ingrese un comentario"
              ></textarea>
            </div>
            {editandoUsuario ? (
              <div>
                <button type="button" className="btn btn-primary me-2" onClick={handleGuardarEdicion}>Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelarEdicion}>Cancelar</button>
              </div>
            ) : (
              <button type="button" className="btn btn-success" onClick={handleAgregarUsuario}>Añadir Usuario</button>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Lista de Usuarios</h4>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {usuarios.map((usu) => (
              <li key={usu.id} className="list-group-item d-flex justify-content-between align-items-center">
                ID: {usu.id}, NOMBRE: {usu.nombre}, ACTIVO: {usu.activo ? 'Sí' : 'No'}, COMENTARIO: {usu.comentario}
                <div>
                  <button type="button" className="btn btn-warning btn-sm me-2" onClick={() => handleEditarUsuario(usu)}>Editar</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleEliminarUsuario(usu.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

