import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  FileCheck, 
  Upload, 
  X, 
  Calendar,
  AlertCircle,
  Building2,
  FileText,
  BadgeCheck,
  ShieldCheck
} from 'lucide-react';
import { 
  HotelEmployee, 
  EmployeeRequirementStatus, 
  MandatoryRequirementDefinition 
} from '../types/hotelPortal';
import { 
  INITIAL_DIAMOND_EMPLOYEES, 
  MANDATORY_REQUIREMENTS 
} from '../data/hotelOperationsData';
import { calculateCertificationAlert } from './HRManagementView';

interface EmployeeComplianceViewProps {
  hotelId: string;
  hotelName: string;
  departmentName?: string;
}

const LOCAL_STORAGE_KEY = 'klayman_employees_compliance_data';

export const EmployeeComplianceView: React.FC<EmployeeComplianceViewProps> = ({
  hotelId,
  hotelName,
  departmentName = 'F&B'
}) => {
  // Inicialización con persistencia en localStorage
  const [employees, setEmployees] = useState<HotelEmployee[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading employees from localStorage', e);
    }
    return INITIAL_DIAMOND_EMPLOYEES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'al_dia' | 'con_pendientes'>('todos');
  const [selectedRequirementFilter, setSelectedRequirementFilter] = useState<string>('todos');

  // Estado para el modal de validación de un requisito específico
  const [editingCert, setEditingCert] = useState<{
    employeeId: string;
    employeeName: string;
    req: EmployeeRequirementStatus;
  } | null>(null);

  // Formulario del modal de acreditación
  const [certHasIt, setCertHasIt] = useState<boolean>(true);
  const [certStatus, setCertStatus] = useState<'en_regla' | 'pendiente' | 'en_tramite' | 'caducado'>('en_regla');
  const [certNumber, setCertNumber] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certExpiryDate, setCertExpiryDate] = useState('');
  const [certNotes, setCertNotes] = useState('');
  const [certDocUrl, setCertDocUrl] = useState('');
  const [certVerifiedBy, setCertVerifiedBy] = useState('Dirección F&B');

  // Modal para añadir nuevo trabajador
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('Camarero / Barman');
  const [newShift, setNewShift] = useState('Tarde / Noche (15:00 - 22:30)');
  const [newDni, setNewDni] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Sincronizar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving employees to localStorage', e);
    }
  }, [employees]);

  // Al abrir edición de requisito
  const handleOpenEditCert = (emp: HotelEmployee, req: EmployeeRequirementStatus) => {
    setEditingCert({
      employeeId: emp.id,
      employeeName: emp.fullName,
      req
    });
    setCertHasIt(req.hasCertificate);
    setCertStatus(req.status);
    setCertNumber(req.certificateNumber || '');
    setCertIssueDate(req.issueDate || new Date().toLocaleDateString('es-ES'));
    setCertExpiryDate(req.expiryDate || '');
    setCertNotes(req.notes || '');
    setCertDocUrl(req.documentUrl || '');
    setCertVerifiedBy(req.verifiedBy || 'Dirección F&B');
  };

  // Guardar validación del requisito
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setEmployees(prev => prev.map(emp => {
      if (emp.id !== editingCert.employeeId) return emp;

      const updatedReqs = emp.requirements.map(r => {
        if (r.requirementId !== editingCert.req.requirementId) return r;
        return {
          ...r,
          hasCertificate: certHasIt,
          status: certHasIt ? (certStatus === 'pendiente' ? 'en_regla' : certStatus) : 'pendiente',
          certificateNumber: certNumber.trim() || undefined,
          issueDate: certIssueDate.trim() || undefined,
          expiryDate: certExpiryDate.trim() || undefined,
          notes: certNotes.trim() || undefined,
          documentUrl: certDocUrl.trim() || undefined,
          verifiedBy: certVerifiedBy.trim() || 'Dirección F&B'
        };
      });

      return {
        ...emp,
        requirements: updatedReqs
      };
    }));

    setEditingCert(null);
  };

  // Toggle rápido de "Marcar como que lo tiene"
  const handleQuickToggleHasCert = (employeeId: string, requirementId: string, currentHasIt: boolean) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp;
      const updatedReqs = emp.requirements.map(r => {
        if (r.requirementId !== requirementId) return r;
        const newHasIt = !currentHasIt;
        return {
          ...r,
          hasCertificate: newHasIt,
          status: newHasIt ? 'en_regla' : 'pendiente',
          issueDate: newHasIt ? (r.issueDate || new Date().toLocaleDateString('es-ES')) : undefined,
          verifiedBy: newHasIt ? 'Dirección F&B' : undefined,
          notes: newHasIt 
            ? (r.notes ? `${r.notes} · Validado por responsable.` : 'Marcado como acreditado por el responsable.')
            : 'Marcado como pendiente.'
        };
      });
      return { ...emp, requirements: updatedReqs };
    }));
  };

  // Crear nuevo empleado
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    // Crear requisitos base obligatorios por defecto
    const baseReqs: EmployeeRequirementStatus[] = MANDATORY_REQUIREMENTS.map(def => ({
      requirementId: def.id,
      requirementName: def.name,
      hasCertificate: false,
      status: 'pendiente',
      notes: 'Pendiente de acreditación inicial.'
    }));

    const newEmp: HotelEmployee = {
      id: `emp-dia-${Date.now()}`,
      hotelId,
      fullName: newFullName.trim(),
      role: newRole.trim(),
      shift: newShift.trim(),
      dniNie: newDni.trim() || undefined,
      phone: newPhone.trim() || undefined,
      email: newEmail.trim() || undefined,
      department: 'food-and-beverage',
      departmentLabel: `${departmentName} / Bar Terraza`,
      startDate: new Date().toLocaleDateString('es-ES'),
      status: 'activo',
      requirements: baseReqs
    };

    setEmployees(prev => [newEmp, ...prev]);
    setIsAddEmployeeOpen(false);
    setNewFullName('');
    setNewDni('');
    setNewPhone('');
    setNewEmail('');
  };

  // Manejo de subida de archivo para el certificado (foto o documento)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCertDocUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Cálculos y Métricas de cumplimiento
  const totalEmployees = employees.length;
  
  const employeesWithAllClear = useMemo(() => {
    return employees.filter(emp => 
      emp.requirements.every(r => r.hasCertificate && r.status === 'en_regla')
    ).length;
  }, [employees]);

  const employeesWithPending = totalEmployees - employeesWithAllClear;
  
  // Total manipuladores acreditados
  const totalManipuladoresOk = useMemo(() => {
    return employees.filter(emp => {
      const manip = emp.requirements.find(r => r.requirementId === 'req-manipulador');
      return manip && manip.hasCertificate;
    }).length;
  }, [employees]);

  // Filtrado de empleados
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Búsqueda por nombre o DNI
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.dniNie && emp.dniNie.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Filtro de estado general
      if (filterStatus === 'al_dia') {
        const isAllClear = emp.requirements.every(r => r.hasCertificate && r.status === 'en_regla');
        if (!isAllClear) return false;
      } else if (filterStatus === 'con_pendientes') {
        const hasPending = emp.requirements.some(r => !r.hasCertificate || r.status !== 'en_regla');
        if (!hasPending) return false;
      }

      // Filtro de requisito específico
      if (selectedRequirementFilter !== 'todos') {
        const req = emp.requirements.find(r => r.requirementId === selectedRequirementFilter);
        if (!req || !req.hasCertificate) return false;
      }

      return true;
    });
  }, [employees, searchTerm, filterStatus, selectedRequirementFilter]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[#2C3E50]">
      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#C5A880]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880] font-bold">
                CUMPLIMIENTO NORMATIVO & SANIDAD
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
              Personal & Requisitos Obligatorios
            </h2>
            <p className="text-xs sm:text-sm text-[#2C3E50]/80 max-w-3xl font-sans">
              Registro y validación de acreditaciones legales obligatorias por trabajador (Carnet de Manipulador de Alimentos, Alérgenos APPCC, PRL). Permite marcar el estado de cada persona, registrar números de registro y almacenar justificantes para auditorías sanitarias de Sanidad del Gobierno de Canarias.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Trabajador</span>
            </button>
          </div>
        </div>

        {/* TARJETAS RESUMEN / KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase block font-semibold">Plantilla Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#2C3E50]">{totalEmployees}</span>
              <span className="text-xs font-mono text-[#2C3E50]/60">trabajadores</span>
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/50 block">F&B {hotelName}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase block font-semibold">Manipulador de Alimentos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1A2530]">{totalManipuladoresOk}</span>
              <span className="text-xs font-mono text-[#2C3E50]/60">/ {totalEmployees} en regla</span>
            </div>
            <span className="text-[10px] font-mono text-[#C5A880] block font-semibold">
              {Math.round((totalManipuladoresOk / (totalEmployees || 1)) * 100)}% de cobertura sanitaria
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase block font-semibold">Todo al Día (100%)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1A2530]">{employeesWithAllClear}</span>
              <span className="text-xs font-mono text-[#2C3E50]/60">empleados</span>
            </div>
            <span className="text-[10px] font-mono text-[#1A2530] block font-semibold">✓ Sin requisitos pendientes</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase block font-semibold">Pendientes de Acreditar</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#C5A880]">{employeesWithPending}</span>
              <span className="text-xs font-mono text-[#2C3E50]/60">requieren gestión</span>
            </div>
            <span className="text-[10px] font-mono text-[#C5A880] block font-semibold">⚠️ Carnet o curso pendiente</span>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS & BÚSQUEDA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, puesto o DNI..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono shrink-0">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'todos' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              Todos ({employees.length})
            </button>
            <button
              onClick={() => setFilterStatus('al_dia')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'al_dia' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              100% en Regla ({employeesWithAllClear})
            </button>
            <button
              onClick={() => setFilterStatus('con_pendientes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'con_pendientes' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              Con Pendientes ({employeesWithPending})
            </button>
          </div>
        </div>
      </div>

      {/* LISTADO DE TRABAJADORES CON REQUISITOS OBLIGATORIOS */}
      <div className="space-y-4">
        {filteredEmployees.map(emp => {
          const allOk = emp.requirements.every(r => r.hasCertificate && r.status === 'en_regla');

          return (
            <div 
              key={emp.id} 
              className="p-5 rounded-xl transition-colors space-y-4 border bg-white border-[#E2E8F0] hover:border-[#C5A880]"
            >
              {/* CABECERA DEL TRABAJADOR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base border shrink-0 ${
                    allOk 
                      ? 'bg-[#C5A880]/15 border-[#C5A880]/40 text-[#1A2530]' 
                      : 'bg-[#F8F9FA] border-[#E2E8F0] text-[#2C3E50]'
                  }`}>
                    {emp.fullName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-[#2C3E50]">
                        {emp.fullName}
                      </h3>
                      {allOk ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-[#C5A880]" />
                          <span>100% En Regla</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3 h-3 text-[#C5A880]" />
                          <span>Requisitos Pendientes</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-[#2C3E50]/70 mt-0.5 flex-wrap">
                      <span className="text-[#1A2530] font-bold">{emp.role}</span>
                      <span>·</span>
                      <span>Turno: {emp.shift || 'Rotativo'}</span>
                      {emp.dniNie && (
                        <>
                          <span>·</span>
                          <span className="text-[#2C3E50]/60">DNI: {emp.dniNie}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] font-mono text-[#2C3E50]/60 block">
                    Alta: {emp.startDate}
                  </span>
                </div>
              </div>

              {/* REJILLA DE REQUISITOS OBLIGATORIOS POR TRABAJADOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {emp.requirements.map(req => {
                  const hasIt = req.hasCertificate;
                  const isManipulador = req.requirementId === 'req-manipulador';

                  return (
                    <div 
                      key={req.requirementId}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                        hasIt
                          ? 'bg-stone-950/70 border-emerald-900/40 hover:border-emerald-700/60'
                          : 'bg-amber-950/20 border-amber-900/60 hover:border-amber-600/70'
                      }`}
                    >
                      <div className="space-y-1.5">
                        {(() => {
                          const alert = calculateCertificationAlert(req);
                          return (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-stone-200 leading-tight">
                                  {req.requirementName}
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold shrink-0 border ${alert.badgeClass}`}>
                                  {alert.label}
                                </span>
                              </div>

                              {/* Mensaje de alerta si está caducado o próximo */}
                              {(alert.type === 'caducado' || alert.type === 'proximo') && (
                                <p className={`text-[10px] font-mono p-1.5 rounded-lg border leading-tight ${
                                  alert.type === 'caducado' 
                                    ? 'bg-rose-950/50 text-rose-300 border-rose-800' 
                                    : 'bg-amber-950/50 text-amber-300 border-amber-800'
                                }`}>
                                  {alert.message}
                                </p>
                              )}
                            </>
                          );
                        })()}

                        {/* Detalles de la acreditación si la tiene */}
                        {hasIt && (
                          <div className="text-[11px] font-mono text-stone-400 space-y-0.5 bg-stone-900/60 p-2 rounded-xl border border-stone-800/80">
                            {req.certificateNumber && (
                              <div className="text-stone-300 font-semibold">
                                Nº: <span className="text-emerald-400">{req.certificateNumber}</span>
                              </div>
                            )}
                            {req.expiryDate && (
                              <div className="text-[10px] text-stone-400">
                                Caduca: <span className="text-stone-200 font-semibold">{req.expiryDate}</span>
                              </div>
                            )}
                            {req.verifiedBy && (
                              <div className="text-[10px] text-stone-500">
                                Validado por: {req.verifiedBy}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Observaciones o notas si está pendiente */}
                        {!hasIt && req.notes && (
                          <p className="text-[11px] text-amber-300/80 italic font-mono bg-amber-950/30 p-2 rounded-xl border border-amber-900/30">
                            {req.notes}
                          </p>
                        )}
                      </div>

                      {/* BOTONES DE ACCIÓN PARA EL USUARIO: MARCAR RÁPIDO O DETALLAR */}
                      <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between gap-2">
                        {/* Botón directo que pide el usuario: "yo marcar como que lo tienen" */}
                        <button
                          type="button"
                          onClick={() => handleQuickToggleHasCert(emp.id, req.requirementId, hasIt)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                            hasIt
                              ? 'bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md shadow-emerald-950'
                          }`}
                          title={hasIt ? 'Marcar como pendiente' : 'Marcar como que lo tiene'}
                        >
                          {hasIt ? (
                            <span>Desmarcar</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Marcar que lo tiene</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditCert(emp, req)}
                          className="text-[11px] font-mono text-stone-400 hover:text-emerald-400 transition-colors"
                        >
                          Ver / Editar datos →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
          <div className="p-10 rounded-3xl bg-stone-900/60 border border-stone-800 text-center space-y-3 max-w-xl mx-auto">
            <Users className="w-10 h-10 text-stone-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-lg font-display font-bold text-stone-200">
                No hay trabajadores registrados en la plantilla
              </h4>
              <p className="text-xs text-stone-400 font-mono">
                Añada a los miembros de su equipo para gestionar los certificados obligatorios (Manipulador de Alimentos, APPCC y PRL) con alertas de caducidad.
              </p>
            </div>
            <button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Trabajador a la Plantilla</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL DETALLADO DE ACREDITACIÓN / CARGA DE FOTO DE CERTIFICADO */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Validación de Requisito Obligatorio
                </span>
                <h3 className="text-lg font-display font-bold text-stone-100">
                  {editingCert.employeeName}
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  {editingCert.req.requirementName}
                </p>
              </div>
              <button
                onClick={() => setEditingCert(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              {/* Selector de estado: ¿Lo tiene acreditado? */}
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <label className="text-xs font-mono text-stone-300 font-bold block">
                  ¿Tiene en posesión este requisito obligatorio?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCertHasIt(true);
                      setCertStatus('en_regla');
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                      certHasIt
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                        : 'bg-stone-900 text-stone-400 border-stone-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SÍ, LO TIENE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCertHasIt(false);
                      setCertStatus('pendiente');
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                      !certHasIt
                        ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-stone-900 text-stone-400 border-stone-800'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>PENDIENTE / NO</span>
                  </button>
                </div>
              </div>

              {/* Si lo tiene o está en trámite, permitir datos oficiales */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Nº Carnet / Registro Oficial:
                  </label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="Ej. CMA-884210"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Fecha de Caducidad / Renovación:
                  </label>
                  <input
                    type="text"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                    placeholder="Ej. 15/05/2028"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subir foto o justificante del carnet */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <label className="text-[11px] font-mono text-stone-400 uppercase flex items-center justify-between">
                  <span>Foto o Justificante del Carnet / Título:</span>
                  <span className="text-[10px] text-emerald-400">Archivo o Cámara</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
                    {certDocUrl ? (
                      <img src={certDocUrl} alt="Certificado" className="w-full h-full object-cover" />
                    ) : (
                      <FileCheck className="w-6 h-6 text-stone-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono cursor-pointer transition-colors border border-stone-700">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Subir foto del carnet...</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {certDocUrl && (
                      <button
                        type="button"
                        onClick={() => setCertDocUrl('')}
                        className="text-[11px] font-mono text-rose-400 hover:underline block"
                      >
                        Eliminar foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notas u observaciones */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400 uppercase">
                  Observaciones / Cómo se verificó:
                </label>
                <textarea
                  rows={2}
                  value={certNotes}
                  onChange={(e) => setCertNotes(e.target.value)}
                  placeholder="Ej. Entregado carnet original expedido por academia... o enviado por WhatsApp."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-mono text-xs hover:bg-stone-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs transition-colors shadow-lg"
                >
                  Guardar Acreditación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA AÑADIR NUEVO TRABAJADOR */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Gestión de Personal {hotelName}
                </span>
                <h3 className="text-lg font-display font-bold text-stone-100">
                  Alta de Nuevo Trabajador
                </h3>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400 uppercase">
                  Nombre Completo: *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej. Roberto González Santana"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Puesto / Cargo:
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Ej. Bartender / Camarero"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    DNI / NIE:
                  </label>
                  <input
                    type="text"
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                    placeholder="Ej. 78451290K"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400 uppercase">
                  Turno habitual / Horario:
                </label>
                <input
                  type="text"
                  value={newShift}
                  onChange={(e) => setNewShift(e.target.value)}
                  placeholder="Ej. Tarde / Noche (15:00 - 22:30)"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-400">
                ℹ️ Al dar de alta al trabajador, el sistema creará automáticamente la ficha de requisitos obligatorios con el <span className="text-emerald-400 font-bold">Carnet de Manipulador de Alimentos</span>, <span className="text-emerald-400 font-bold">Alérgenos APPCC</span> y <span className="text-emerald-400 font-bold">PRL</span> listos para validar.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-mono text-xs hover:bg-stone-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs transition-colors shadow-lg"
                >
                  Guardar Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
