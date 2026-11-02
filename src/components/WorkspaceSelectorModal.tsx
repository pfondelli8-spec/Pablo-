import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Plus,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  X,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { tenantIsolationService, ActiveTenantSession } from '../services/tenantIsolationService';

interface WorkspaceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceChanged: (session: ActiveTenantSession) => void;
}

export const WorkspaceSelectorModal: React.FC<WorkspaceSelectorModalProps> = ({
  isOpen,
  onClose,
  onWorkspaceChanged
}) => {
  const [tab, setTab] = useState<'create' | 'join' | 'demo'>('create');
  const [orgName, setOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [estName, setEstName] = useState('');
  const [joinKey, setJoinKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSession, setCreatedSession] = useState<ActiveTenantSession | null>(null);

  if (!isOpen) return null;

  const currentTenant = tenantIsolationService.getActiveTenant();

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !adminEmail.trim()) {
      setError('Por favor complete el nombre de la organización y el email del administrador.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await tenantIsolationService.registerNewOrganization(
        orgName.trim(),
        adminEmail.trim(),
        estName.trim() || orgName.trim()
      );
      setCreatedSession(result.org);
      onWorkspaceChanged(result.org);
    } catch (err: any) {
      setError(err.message || 'Error registrando organización privada');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinKey.trim()) {
      setError('Introduzca la clave de equipo o token de organización.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const session = await tenantIsolationService.loginWithKeyOrToken(joinKey.trim());
      onWorkspaceChanged(session);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Clave de invitación o token no válido');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (hotel: 'bitacora' | 'vulcano') => {
    const session = tenantIsolationService.switchToDemoEnvironment(hotel);
    onWorkspaceChanged(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in border border-[#E2E8F0]">
        {/* Cabecera */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A2530] text-[#C5A880] flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#1A2530]">
                Gestión de Espacios de Trabajo Privados
              </h3>
              <p className="text-xs text-[#2C3E50]/70">
                Aislamiento estricto de datos entre empresas y organizaciones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Espacio Activo Actual */}
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-500">
              Espacio de Trabajo Activo
            </span>
            <div className="font-extrabold text-[#1A2530] flex items-center gap-1.5">
              <span>{currentTenant.name}</span>
              {currentTenant.isDemoTenant ? (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                  Demo
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Privado
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              ID: {currentTenant.orgId} · Código: {currentTenant.code}
            </div>
          </div>

          <button
            onClick={() => {
              tenantIsolationService.logoutAndPurge();
              const freshDemo = tenantIsolationService.switchToDemoEnvironment('bitacora');
              onWorkspaceChanged(freshDemo);
              onClose();
            }}
            title="Cerrar sesión activa y purgar caché y datos en memoria"
            className="px-2.5 py-1.5 rounded-lg border border-gray-300 hover:border-rose-400 hover:bg-rose-50 text-[11px] font-semibold text-gray-600 hover:text-rose-700 transition cursor-pointer shrink-0"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Pestañas de Selección */}
        <div className="flex items-center bg-[#F8F9FA] p-1 rounded-xl border border-gray-200 text-xs font-bold">
          <button
            onClick={() => {
              setTab('create');
              setCreatedSession(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'create'
                ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            + Crear Mi Empresa
          </button>
          <button
            onClick={() => {
              setTab('join');
              setCreatedSession(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'join'
                ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            Unirse con Clave
          </button>
          <button
            onClick={() => {
              setTab('demo');
              setCreatedSession(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'demo'
                ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            Plantillas Demo
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: CREAR NUEVA EMPRESA / ESPACIO PRIVADO */}
        {tab === 'create' && (
          <div>
            {!createdSession ? (
              <form onSubmit={handleCreateOrg} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Nombre de la Empresa u Organización:
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="Ej. Grupo Costa Adeje Hotels, Restaurante El Mirador..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Email del Administrador de la Organización:
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder="director.operaciones@tuempresa.com"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Nombre del Primer Establecimiento (Opcional):
                  </label>
                  <input
                    type="text"
                    value={estName}
                    onChange={e => setEstName(e.target.value)}
                    placeholder="Ej. Hotel Principal Playa Blanca"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Garantía de Aislamiento Inmediato</span>
                  </div>
                  <p>
                    Se generará un espacio de trabajo único en el servidor con partición encriptada. Ninguna otra empresa podrá ver sus recetas, registros ni documentos.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? 'Creando espacio privado...' : 'Crear Espacio de Trabajo Privado'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                  <div className="font-black text-sm flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>¡Organización Creada Exitosamente!</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Su espacio privado <strong>{createdSession.name}</strong> está listo y aislado en el servidor.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="font-bold text-gray-700 block">
                    Clave de Invitación de Equipo:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdSession.teamJoinKey || ''}
                      className="w-full font-mono font-bold text-base p-2 rounded-lg bg-white border border-gray-300 text-[#1A2530]"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdSession.teamJoinKey || '');
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="px-3 py-2 rounded-lg bg-[#1A2530] text-white hover:bg-black font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey ? 'Copiada' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Comparta esta clave con los trabajadores y jefes de partida de su hotel para que accedan al espacio privado de su empresa.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs"
                >
                  Comenzar a operar en mi espacio privado
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UNIRSE CON CLAVE DE EQUIPO */}
        {tab === 'join' && (
          <form onSubmit={handleJoinOrg} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Clave de Equipo o Token de la Organización:
              </label>
              <input
                type="text"
                required
                value={joinKey}
                onChange={e => setJoinKey(e.target.value)}
                placeholder="Ej. BITA-4920 o sec_tok_..."
                className="w-full p-2.5 font-mono text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Facilitada por el administrador de operaciones de su establecimiento.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Verificando credencial...' : 'Acceder al Espacio de mi Empresa'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: PLANTILLAS DE DEMOSTRACIÓN */}
        {tab === 'demo' && (
          <div className="space-y-3 text-xs">
            <p className="text-[#2C3E50]/70">
              Espacios de demostración precargados (solo lectura). Ideales para explorar la plataforma antes de crear su empresa:
            </p>

            <div
              onClick={() => handleSelectDemo('bitacora')}
              className="p-3.5 rounded-xl border border-gray-200 hover:border-[#C5A880] bg-white cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-[#1A2530]">
                  Demo: Spring Hotels · Hotel Bitácora 4★
                </div>
                <div className="text-[11px] text-gray-500">
                  Chef Antonio González · Gran volumen & Buffet Showcooking
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>

            <div
              onClick={() => handleSelectDemo('vulcano')}
              className="p-3.5 rounded-xl border border-gray-200 hover:border-[#C5A880] bg-white cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-[#1A2530]">
                  Demo: Vulcano Luxury Hotels · Hotel Vulcano 5★
                </div>
                <div className="text-[11px] text-gray-500">
                  Chef Giacomo Longo · Alta cocina de autor & Sous-vide
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Pie de modal */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#C5A880]" />
            <span>Aislamiento Criptográfico Multi-Tenant</span>
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
