import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CustomUser } from '@/pages/models/UserModel';
import { FormularioChecklist } from '@/pages/models/FormularioChecklist';
import { RespuestaChecklist } from '@/pages/models/RespuestaChecklist';
import { RevisionChecklist } from '@/pages/models/RevisionChecklist';
import CapatazLayout from '@/pages/components/CapatazLayout';

const RespuestasTable: React.FC = () => {
    const [respuestas, setRespuestas] = useState<RespuestaChecklist[]>([]);
    const [revisiones, setRevisiones] = useState<RevisionChecklist[]>([]);
    const [usuarios, setUsuarios] = useState<CustomUser[]>([]);
    const [formularios, setFormularios] = useState<FormularioChecklist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsuario, setSelectedUsuario] = useState<string | null>(null);
    const [selectedRevisor, setSelectedRevisor] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todas las respuestas
                const [respuestasRes, revisionesRes, usuariosRes, formulariosRes] = await Promise.all([
                    axios.get<RespuestaChecklist[]>('http://localhost:8000/api/respuestas/'),
                    axios.get<RevisionChecklist[]>('http://localhost:8000/api/revisiones/'),
                    axios.get<CustomUser[]>('http://localhost:8000/api/usuarios/'),
                    axios.get<FormularioChecklist[]>('http://localhost:8000/api/formularios/')
                ]);

                setRespuestas(respuestasRes.data);
                setRevisiones(revisionesRes.data);
                setUsuarios(usuariosRes.data);
                setFormularios(formulariosRes.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos');
                setLoading(false);
                console.error(err);
            }
        };

        fetchData();
    }, []);

    // Función para obtener datos del usuario por ID
    const getUsuarioById = (id: number): CustomUser | undefined => {
        return usuarios.find(u => u.id === id);
    };

    // Función para obtener datos del formulario por ID
    const getFormularioById = (id: number): FormularioChecklist | undefined => {
        return formularios.find(f => f.id === id);
    };

    // Función para obtener la revisión de una respuesta
    const getRevisionForRespuesta = (respuestaId: number): RevisionChecklist | undefined => {
        return revisiones.find(r => r.respuesta === respuestaId);
    };

    // Filtrar respuestas según selección
    const filteredRespuestas = respuestas.filter(respuesta => {
        const matchesUsuario = selectedUsuario ?
            respuesta.usuario_username === selectedUsuario ||
            respuesta.usuario.toString() === selectedUsuario : true;

        const revision = getRevisionForRespuesta(respuesta.id);
        const matchesRevisor = selectedRevisor ?
            revision?.usuario_username === selectedRevisor ||
            revision?.usuario?.toString() === selectedRevisor : true;

        return matchesUsuario && matchesRevisor;
    });

    if (loading) return <div className="text-center py-8">Cargando...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (respuestas.length === 0) return <div className="text-center py-8">No hay respuestas disponibles</div>;

    return (
        <CapatazLayout>
            <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Reporte de Respuestas</h1>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                    <label className="block mb-2 font-medium">Filtrar por usuario:</label>
                    <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSelectedUsuario(e.target.value || null)}
                        value={selectedUsuario || ''}
                    >
                        <option value="">Todos los usuarios</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.username}>
                                {user.first_name} {user.last_name} ({user.username})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block mb-2 font-medium">Filtrar por revisor:</label>
                    <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSelectedRevisor(e.target.value || null)}
                        value={selectedRevisor || ''}
                    >
                        <option value="">Todos los revisores</option>
                        {Array.from(new Set(revisiones
                            .filter(r => r.usuario !== null)
                            .map(r => r.usuario_username || r.usuario?.toString() || '')))
                            .filter(username => username)
                            .map(username => {
                                const user = usuarios.find(u =>
                                    u.username === username || u.id.toString() === username
                                );
                                return (
                                    <option key={username} value={username}>
                                        {user ? `${user.first_name} ${user.last_name}` : username}
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>
            </div>

            {/* Tabla principal */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border font-semibold text-left">Código</th>
                            <th className="py-3 px-4 border font-semibold text-left">Formulario</th>
                            <th className="py-3 px-4 border font-semibold text-left">Fecha/Hora</th>
                            <th className="py-3 px-4 border font-semibold text-left">Responsable</th>
                            <th className="py-3 px-4 border font-semibold text-left">Grupo/Turno</th>
                            <th className="py-3 px-4 border font-semibold text-left">Revisión</th>
                            <th className="py-3 px-4 border font-semibold text-left">Revisor</th>
                            <th className="py-3 px-4 border font-semibold text-left">Observaciones</th>
                            <th className="py-3 px-4 border font-semibold text-left">Problemas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRespuestas.map(respuesta => {
                            const usuario = getUsuarioById(respuesta.usuario);
                            const formulario = getFormularioById(respuesta.formulario);
                            const revision = getRevisionForRespuesta(respuesta.id);
                            const revisor = revision?.usuario ? getUsuarioById(revision.usuario) : null;
                            const tareasConProblemas = respuesta.respuestas_tareas.filter(t => t.estado_malo);

                            return (
                                <tr key={respuesta.id} className="hover:bg-gray-50 border-b">
                                    <td className="py-3 px-4 border">{respuesta.id}</td>
                                    <td className="py-3 px-4 border">
                                        {formulario ? (
                                            <div>
                                                <p className="font-medium">{formulario.titulo}</p>
                                                <p className="text-sm text-gray-600">Código: {formulario.codigo}</p>
                                            </div>
                                        ) : `Formulario ${respuesta.formulario}`}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {new Date(respuesta.fecha_respuesta).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {usuario ? `${usuario.first_name} ${usuario.last_name}` : respuesta.usuario_username}
                                            </span>
                                            {usuario && (
                                                <span className="text-sm text-gray-600">
                                                    {usuario.role === 'jefe_area' ? 'Jefe' :
                                                        usuario.role === 'capataz' ? 'Capataz' : 'Operador'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {usuario ? (
                                            <div>
                                                <p>Grupo {usuario.shift_group}</p>
                                                <p className="text-sm">{usuario.shift_type}</p>
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {revision ? (
                                            <div className={`inline-block px-2 py-1 rounded text-sm ${revision.estado === 'revisado' ? 'bg-green-100 text-green-800' :
                                                    revision.estado === 'observado' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {revision.estado}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">No revisado</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {revision ? (
                                            <div>
                                                {revisor ? (
                                                    <div className="flex flex-col">
                                                        <span>{revisor.first_name} {revisor.last_name}</span>
                                                        <span className="text-sm text-gray-600">
                                                            {revisor.role === 'jefe_area' ? 'Jefe' :
                                                                revisor.role === 'capataz' ? 'Capataz' : 'Operador'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>{revision.usuario_username || 'Usuario desconocido'}</span>
                                                )}
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {revision?.observaciones || respuesta.comentario_general || 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border">
                                        {tareasConProblemas.length > 0 ? (
                                            <div className="space-y-2">
                                                {tareasConProblemas.map(tarea => (
                                                    <div key={tarea.id} className="bg-red-50 p-2 rounded border-l-4 border-red-500">
                                                        <p className="font-medium">Tarea #{tarea.tarea}</p>
                                                        {tarea.comentario && (
                                                            <p className="text-sm mt-1">"{tarea.comentario}"</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-green-600">✓ Sin problemas</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        </CapatazLayout>
    );
};

export default RespuestasTable;