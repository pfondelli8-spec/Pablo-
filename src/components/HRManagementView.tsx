import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  X, 
  AlertOctagon, 
  Building2, 
  Award, 
  Edit3, 
  FileCheck, 
  ChevronRight,
  Printer,
  Download,
  Filter,
  Check,
  Phone,
  Mail,
  UserCheck,
  UserX,
  BadgeAlert,
  Lock,
  Eye,
  EyeOff,
  Palette,
  UploadCloud,
  Bell,
  Sparkles
} from 'lucide-react';
import { HotelEmployee, EmployeeRequirementStatus, MandatoryRequirementDefinition } from '../types/hotelPortal';
import { MANDATORY_REQUIREMENTS, INITIAL_DIAMOND_EMPLOYEES } from '../data/hotelOperationsData';

interface HRManagementViewProps {
  hotelId: string;
  hotelName: string;
  onNavigateToDepartment?: (deptId: string) => void;
}

const LOCAL_STORAGE_KEY = 'klayman_employees_compliance_data';

// Fecha de referencia operativa del sistema
const REFERENCE_DATE = new Date(2026, 8, 23); // 23 de septiembre de 2026

// Helper para parsear fechas flexibles (DD/MM/YYYY o YYYY-MM-DD)
export function parseDateString(dateStr?: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// Helper para calcular el estado y alerta automática de caducidad
export function calculateCertificationAlert(cert: EmployeeRequirementStatus) {
  if (!cert.hasCertificate || cert.status === 'pendiente') {
    return {
      type: 'pendiente' as const,
      label: 'Pendiente de Obtener',
      badgeClass: 'bg-stone-850 text-stone-300 border-stone-700',
      iconColor: 'text-stone-400',
      daysRemaining: null,
      message: 'El empleado no dispone de la certificación obligatoria acreditada.'
    };
  }

  if (!cert.expiryDate) {
    return {
      type: 'vigente' as const,
      label: 'Obtenido (Sin caducidad)',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
      iconColor: 'text-emerald-400',
      daysRemaining: null,
      message: 'Acreditado sin fecha límite registrada.'
    };
  }

  const expDate = parseDateString(cert.expiryDate);
  if (!expDate) {
    return {
      type: 'vigente' as const,
      label: 'Obtenido',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
      iconColor: 'text-emerald-400',
      daysRemaining: null,
      message: 'Acreditado'
    };
  }

  const diffTime = expDate.getTime() - REFERENCE_DATE.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      type: 'caducado' as const,
      label: `Caducado (${daysAgo}d)`,
      badgeClass: 'bg-rose-950 text-rose-300 border-rose-700 font-bold animate-pulse',
      iconColor: 'text-rose-400',
      daysRemaining: diffDays,
      message: `¡ALERTA SANITARIA! Certificado vencido hace ${daysAgo} días (${cert.expiryDate}). Requiere renovación inmediata.`
    };
  } else if (diffDays <= 60) {
    return {
      type: 'proximo' as const,
      label: `Caduca en ${diffDays}d`,
      badgeClass: 'bg-amber-950 text-amber-300 border-amber-700 font-bold',
      iconColor: 'text-amber-400',
      daysRemaining: diffDays,
      message: `¡ATENCIÓN! Vence en ${diffDays} días (${cert.expiryDate}). Tramitar renovación.`
    };
  } else {
    return {
      type: 'vigente' as const,
      label: 'Vigente',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
      iconColor: 'text-emerald-400',
      daysRemaining: diffDays,
      message: `En regla. Válido hasta el ${cert.expiryDate}.`
    };
  }
}

export const HRManagementView: React.FC<HRManagementViewProps> = ({
  hotelId,
  hotelName,
  onNavigateToDepartment
}) => {
  // Estado de empleados con sincronización en localStorage
  const [employees, setEmployees] = useState<HotelEmployee[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading employees from localStorage', e);
    }
    return INITIAL_DIAMOND_EMPLOYEES;
  });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    } catch (e) {
      console.error('Error saving employees to localStorage', e);
    }
  }, [employees]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('todos');
  const [alertFilter, setAlertFilter] = useState<'todos' | 'caducados' | 'proximos' | 'pendientes' | 'vigentes'>('todos');
  const [reqFilter, setReqFilter] = useState<string>('todos');

  // Modales y Vistas de Rol
  const [viewRole, setViewRole] = useState<'admin_rrhh' | 'empleado_privado'>('admin_rrhh');
  const [selectedEmployeeSessionId, setSelectedEmployeeSessionId] = useState<string>('emp-dia-03'); // Alejandro Suárez por defecto
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [employeeUploadedFile, setEmployeeUploadedFile] = useState<string>('');
  const [employeeUploadNotes, setEmployeeUploadNotes] = useState<string>('');
  const [employeeUploadSuccessMessage, setEmployeeUploadSuccessMessage] = useState<string>('');

  const [editingCertEmployee, setEditingCertEmployee] = useState<{ employee: HotelEmployee; cert: EmployeeRequirementStatus } | null>(null);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [isSanitaryReportOpen, setIsSanitaryReportOpen] = useState(false);

  // Campos para edición de certificación
  const [editStatus, setEditStatus] = useState<'obtenido' | 'pendiente'>('obtenido');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editCertNumber, setEditCertNumber] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Sincronizar formulario al abrir modal de edición
  useEffect(() => {
    if (editingCertEmployee) {
      const c = editingCertEmployee.cert;
      setEditStatus(c.hasCertificate && c.status !== 'pendiente' ? 'obtenido' : 'pendiente');
      setEditIssueDate(c.issueDate || '');
      setEditExpiryDate(c.expiryDate || '');
      setEditCertNumber(c.certificateNumber || '');
      setEditNotes(c.notes || '');
    }
  }, [editingCertEmployee]);

  // Campos de alta de nuevo empleado
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState('food-and-beverage');
  const [newShift, setNewShift] = useState('Mañana (08:00 - 16:00)');
  const [newDni, setNewDni] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newHasManipulador, setNewHasManipulador] = useState(false);
  const [newManipuladorExpiry, setNewManipuladorExpiry] = useState('2028-09-23');

  // Toggle rápido de estado (Pendiente <-> Obtenido) con un solo clic
  const handleQuickToggleCert = (employeeId: string, reqId: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employeeId) return emp;
      const updatedReqs = emp.requirements.map(req => {
        if (req.requirementId !== reqId) return req;
        const newHasCert = !req.hasCertificate;
        return {
          ...req,
          hasCertificate: newHasCert,
          status: newHasCert ? ('en_regla' as const) : ('pendiente' as const),
          issueDate: newHasCert && !req.issueDate ? '23/09/2026' : req.issueDate,
          expiryDate: newHasCert && !req.expiryDate ? '23/09/2030' : req.expiryDate,
          verifiedBy: newHasCert ? 'RRHH & Dirección Operativa' : undefined
        };
      });
      return { ...emp, requirements: updatedReqs };
    }));
  };

  // Guardar edición detallada de certificación
  const handleSaveCertEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertEmployee) return;

    const { employee, cert } = editingCertEmployee;
    const isObtained = editStatus === 'obtenido';

    setEmployees(prev => prev.map(emp => {
      if (emp.id !== employee.id) return emp;
      const updatedReqs = emp.requirements.map(req => {
        if (req.requirementId !== cert.requirementId) return req;
        return {
          ...req,
          hasCertificate: isObtained,
          status: isObtained ? ('en_regla' as const) : ('pendiente' as const),
          issueDate: isObtained ? editIssueDate : undefined,
          expiryDate: isObtained ? editExpiryDate : undefined,
          certificateNumber: isObtained ? editCertNumber : undefined,
          notes: editNotes.trim(),
          verifiedBy: isObtained ? 'RRHH & Dirección Operativa' : undefined
        };
      });
      return { ...emp, requirements: updatedReqs };
    }));

    setEditingCertEmployee(null);
  };

  // Envío del certificado por parte del propio empleado desde su Portal Privado
  const handleEmployeeSubmitCertificate = (reqId: string) => {
    if (!selectedEmployeeSessionId) return;

    setEmployees(prev => prev.map(emp => {
      if (emp.id !== selectedEmployeeSessionId) return emp;
      const updatedReqs = emp.requirements.map(req => {
        if (req.requirementId !== reqId) return req;
        return {
          ...req,
          hasCertificate: true,
          status: 'en_tramite' as const,
          issueDate: '23/09/2026',
          expiryDate: '23/09/2030',
          documentUrl: employeeUploadedFile || undefined,
          notes: employeeUploadNotes.trim() 
            ? `Aportado por el trabajador: "${employeeUploadNotes.trim()}" (Pendiente de validación Dirección/RRHH)`
            : 'Certificado y justificante aportado por el trabajador desde su portal personal. Pendiente de validación oficial por RRHH.'
        };
      });
      return { ...emp, requirements: updatedReqs };
    }));

    setEmployeeUploadSuccessMessage('¡Documento enviado a Dirección & RRHH! El responsable revisará tu certificado y marcará tu estado como validado.');
    setTimeout(() => setEmployeeUploadSuccessMessage(''), 7000);
    setEmployeeUploadedFile('');
    setEmployeeUploadNotes('');
  };

  // Guardar nuevo empleado
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newRole.trim()) return;

    const deptLabels: Record<string, string> = {
      'food-and-beverage': 'F&B',
      'cocina': 'Cocina & Producción',
      'recepcion': 'Recepción & Front Desk',
      'pisos': 'Pisos & Housekeeping',
      'mantenimiento': 'Mantenimiento Técnico'
    };

    const newEmp: HotelEmployee = {
      id: `emp-dia-${Date.now()}`,
      hotelId,
      fullName: newFullName.trim(),
      role: newRole.trim(),
      department: newDepartment,
      departmentLabel: deptLabels[newDepartment] || newDepartment,
      shift: newShift,
      dniNie: newDni.trim() || 'Pendiente DNI',
      phone: newPhone.trim(),
      email: newEmail.trim(),
      startDate: new Date().toISOString().split('T')[0],
      status: 'activo',
      requirements: [
        {
          requirementId: 'req-manipulador',
          requirementName: 'Carnet de Manipulador de Alimentos',
          hasCertificate: newHasManipulador,
          status: newHasManipulador ? 'en_regla' : 'pendiente',
          expiryDate: newHasManipulador ? newManipuladorExpiry : undefined,
          notes: newHasManipulador ? 'Acreditado en el momento de alta.' : 'Pendiente de entrega de carnet oficial.'
        },
        {
          requirementId: 'req-alergenos',
          requirementName: 'Gestión de Alérgenos & APPCC (Reglamento UE 1169/2011)',
          hasCertificate: false,
          status: 'pendiente'
        },
        {
          requirementId: 'req-prl',
          requirementName: 'Prevención de Riesgos Laborales (PRL Hostelería)',
          hasCertificate: false,
          status: 'pendiente'
        }
      ]
    };

    setEmployees(prev => [newEmp, ...prev]);
    setIsNewEmployeeModalOpen(false);

    // Resetear campos
    setNewFullName('');
    setNewRole('');
    setNewDni('');
    setNewPhone('');
    setNewEmail('');
    setNewHasManipulador(false);
  };

  // Métricas y auditoría global
  const metrics = useMemo(() => {
    let totalCerts = 0;
    let vigentes = 0;
    let proximos = 0;
    let caducados = 0;
    let pendientes = 0;

    let manipuladorVigentes = 0;
    let manipuladorTotal = 0;

    employees.forEach(emp => {
      emp.requirements.forEach(req => {
        totalCerts++;
        const alert = calculateCertificationAlert(req);
        if (alert.type === 'caducado') caducados++;
        else if (alert.type === 'proximo') proximos++;
        else if (alert.type === 'vigente') vigentes++;
        else if (alert.type === 'pendiente') pendientes++;

        if (req.requirementId === 'req-manipulador') {
          manipuladorTotal++;
          if (alert.type === 'vigente' || alert.type === 'proximo') {
            manipuladorVigentes++;
          }
        }
      });
    });

    const percentManipulador = manipuladorTotal > 0 ? Math.round((manipuladorVigentes / manipuladorTotal) * 100) : 0;

    return {
      totalEmployees: employees.length,
      totalCerts,
      vigentes,
      proximos,
      caducados,
      pendientes,
      percentManipulador,
      hasCriticalAlerts: caducados > 0 || proximos > 0
    };
  }, [employees]);

  // Filtrado de empleados
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Búsqueda
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(search) ||
        emp.role.toLowerCase().includes(search) ||
        (emp.dniNie && emp.dniNie.toLowerCase().includes(search));

      if (!matchesSearch) return false;

      // Filtro departamento
      if (deptFilter !== 'todos' && emp.department !== deptFilter) return false;

      // Filtro por alerta
      if (alertFilter !== 'todos') {
        const hasMatchingAlert = emp.requirements.some(r => {
          const alert = calculateCertificationAlert(r);
          return alert.type === alertFilter;
        });
        if (!hasMatchingAlert) return false;
      }

      // Filtro por requisito
      if (reqFilter !== 'todos') {
        const hasReq = emp.requirements.some(r => r.requirementId === reqFilter);
        if (!hasReq) return false;
      }

      return true;
    });
  }, [employees, searchTerm, deptFilter, alertFilter, reqFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================================== */}
      {/* BARRA SUPERIOR DE PRIVACIDAD & ROL (RGPD: DIRECCIÓN VS EMPLEADO) */}
      {/* ============================================================== */}
      <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-950 border border-purple-800 text-purple-300 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-stone-100 uppercase tracking-wide">
                Control de Privacidad & Protección de Datos (RGPD)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                Ley Orgánica LOPD-GDD
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Alterna entre la visión global de <strong>Dirección/RRHH</strong> y el <strong>Portal Privado del Trabajador</strong> para verificar que los compañeros nunca ven los datos de otros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setViewRole('admin_rrhh')}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewRole === 'admin_rrhh'
                ? 'bg-purple-500 text-stone-950 shadow-lg shadow-purple-950/60'
                : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>🏢 Vista Dirección / RRHH</span>
          </button>

          <button
            onClick={() => setViewRole('empleado_privado')}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewRole === 'empleado_privado'
                ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-950/60'
                : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>🔒 Portal del Empleado (Privado RGPD)</span>
          </button>

          <button
            onClick={() => setIsBrandingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-850 text-amber-300 border border-stone-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Ver colores corporativos de cada apartahotel"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Colores de Marca</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VISTA A: PORTAL PRIVADO DEL EMPLEADO (ESTRICTO CUMPLIMIENTO RGPD) */}
      {/* ============================================================== */}
      {viewRole === 'empleado_privado' && (() => {
        const sessionEmp = employees.find(e => e.id === selectedEmployeeSessionId) || employees[0];
        if (!sessionEmp) {
          return (
            <div className="p-12 text-center rounded-3xl bg-stone-900/40 border border-stone-800 space-y-4 max-w-xl mx-auto animate-fadeIn">
              <Users className="w-12 h-12 text-stone-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-stone-200">
                  No hay trabajadores registrados en la plantilla
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Para utilizar el espacio confidencial de empleado, dé de alta al menos un trabajador desde el panel de Dirección RRHH.
                </p>
              </div>
              <button
                onClick={() => setViewRole('admin_rrhh')}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs font-mono transition-colors shadow-md"
              >
                Volver a Panel de Dirección RRHH
              </button>
            </div>
          );
        }

        const manipReq = sessionEmp?.requirements.find(r => r.requirementId === 'req-manipulador');
        const manipAlert = manipReq ? calculateCertificationAlert(manipReq) : null;

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* BANNER INFORMATIVO RGPD / PRIVACIDAD */}
            <div className="p-5 rounded-3xl bg-emerald-950/30 border border-emerald-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-mono font-bold text-emerald-200 uppercase">
                    Espacio Confidencial del Empleado · Privacidad Garantizada
                  </h3>
                </div>

                {/* SELECTOR PARA SIMULAR LA SESIÓN DE CUALQUIER EMPLEADO */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-stone-400">Simular como:</span>
                  <select
                    value={selectedEmployeeSessionId}
                    onChange={(e) => setSelectedEmployeeSessionId(e.target.value)}
                    className="bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                🔒 <strong>Protección de Datos & RGPD:</strong> En este portal personal, tú como trabajador únicamente tienes acceso a <strong>tus propias notas, carnets de formación y avisos</strong>. El resto de la plantilla del hotel <strong>NO PUEDE VER</strong> tus certificados ni tú los suyos. Cualquier carnet que adjuntes aquí solo será visible y validado por la Dirección de Recursos Humanos.
              </p>
            </div>

            {/* MENSAJE DE ÉXITO AL SUBIR CARNET */}
            {employeeUploadSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{employeeUploadSuccessMessage}</span>
              </div>
            )}

            {/* FICHA PERSONAL DEL TRABAJADOR */}
            <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300 font-bold font-display text-lg">
                    {sessionEmp.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-stone-100">
                      {sessionEmp.fullName}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <span className="text-stone-300 font-semibold">{sessionEmp.role}</span>
                      <span>·</span>
                      <span>{sessionEmp.departmentLabel}</span>
                      <span>·</span>
                      <span>DNI: {sessionEmp.dniNie}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-stone-950 text-stone-300 border border-stone-800">
                    Turno: {sessionEmp.shift || 'Estándar'}
                  </span>
                </div>
              </div>

              {/* SECCIÓN 1: CARNET DE MANIPULADOR DE ALIMENTOS (SUBIDA Y COMPROBACIÓN) */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">
                      Acreditación Obligatoria Sanitaria
                    </span>
                    <h3 className="text-base font-display font-bold text-stone-100 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>Carnet de Manipulador de Alimentos</span>
                    </h3>
                  </div>

                  {manipAlert && (
                    <span className={`text-xs font-mono px-3 py-1 rounded-xl border ${manipAlert.badgeClass}`}>
                      {manipAlert.label}
                    </span>
                  )}
                </div>

                {/* Si ya lo tiene validado en regla */}
                {manipReq?.hasCertificate && manipReq.status === 'en_regla' && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Tu carnet está acreditado y validado oficialmente por la empresa!</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-stone-300 pt-1">
                      <div>Nº Carnet: <strong className="text-emerald-400">{manipReq.certificateNumber || 'Acreditado'}</strong></div>
                      <div>Fecha Caducidad: <strong className="text-stone-100">{manipReq.expiryDate || 'Vigente'}</strong></div>
                      <div>Validado por: <span className="text-stone-400">{manipReq.verifiedBy || 'Dirección F&B'}</span></div>
                    </div>
                    {manipReq.notes && (
                      <p className="text-[11px] font-sans text-stone-400 pt-1 border-t border-emerald-900/40">
                        Nota de Dirección: {manipReq.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Si está en trámite tras haberlo subido el empleado */}
                {manipReq?.status === 'en_tramite' && (
                  <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800 text-sky-200 text-xs font-mono space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>En revisión por Dirección / Recursos Humanos</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Has remitido tu justificante. En cuanto Dirección lo examine, tu estado pasará automáticamente a "Obtenido / En Regla".
                    </p>
                  </div>
                )}

                {/* Si está pendiente o caducado: FORMULARIO PARA QUE EL EMPLEADO LO SUBA */}
                {(!manipReq?.hasCertificate || manipReq.status === 'pendiente' || manipAlert?.type === 'caducado') && (
                  <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/60 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">
                          {manipAlert?.type === 'caducado' ? 'Carnet Caducado · Se Requiere Justificante' : 'Certificado Pendiente de Acreditación'}
                        </h4>
                        <p className="text-xs text-stone-300 mt-0.5">
                          Para cumplir la normativa sanitaria, debes acreditar que estás en posesión del carnet de manipulador de alimentos. Sube aquí tu justificante o foto:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-stone-300 uppercase block">
                          Adjuntar Foto del Carnet o Justificante del Curso:
                        </label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setEmployeeUploadedFile(ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs font-mono text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-purple-500 file:text-stone-950 hover:file:bg-purple-400 cursor-pointer"
                        />
                      </div>

                      {employeeUploadedFile && (
                        <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3">
                          <img src={employeeUploadedFile} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-stone-700" />
                          <span className="text-xs font-mono text-emerald-400 font-semibold">
                            ✓ Imagen cargada correctamente lista para enviar.
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-stone-300 uppercase block">
                          Comentario para el Responsable de RRHH:
                        </label>
                        <input
                          type="text"
                          value={employeeUploadNotes}
                          onChange={(e) => setEmployeeUploadNotes(e.target.value)}
                          placeholder="Ej: He aprobado el examen online de manipulador con la academia oficial..."
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => handleEmployeeSubmitCertificate('req-manipulador')}
                        className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs font-mono transition-colors flex items-center gap-2 shadow-md shadow-purple-950/40"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Enviar Carnet a Dirección para Validación</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: OTRAS FORMACIONES OBLIGATORIAS (ALÉRGENOS Y PRL) */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase text-stone-400 font-bold block">
                  Otras Acreditaciones & Cursos Obligatorios del Empleado:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sessionEmp.requirements.filter(r => r.requirementId !== 'req-manipulador').map(req => {
                    const alert = calculateCertificationAlert(req);
                    const isObtained = req.hasCertificate && req.status !== 'pendiente';

                    return (
                      <div key={req.requirementId} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-stone-200">
                            {req.requirementName}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${alert.badgeClass}`}>
                            {alert.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                          {alert.message}
                        </p>

                        {isObtained && req.expiryDate && (
                          <div className="text-[11px] font-mono text-emerald-400 pt-1 border-t border-stone-850">
                            Válido hasta: {req.expiryDate}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECCIÓN 3: NOTIFICACIONES PRIVADAS DE FORMACIÓN */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-stone-200 uppercase">
                    Tus Notificaciones & Avisos de Formación
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-sans text-stone-300">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    📌 <strong>Normativa Sanitaria:</strong> La empresa garantiza la renovación de los carnets de manipulador con academias oficiales homologadas de Canarias.
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    🛡️ <strong>PRL Hostelería:</strong> Los cursos de Prevención de Riesgos Laborales son impartidos periódicamente junto a la mutua laboral concertada.
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN PARA VOLVER A VISTA DE ADMINISTRACIÓN */}
            <div className="text-center pt-2">
              <button
                onClick={() => setViewRole('admin_rrhh')}
                className="px-5 py-2.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 font-mono text-xs border border-stone-700 transition-colors inline-flex items-center gap-2"
              >
                <span>← Volver a la Vista de Dirección / RRHH (Toda la Plantilla)</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* VISTA B: GESTIÓN CONSOLIDADA DIRECCIÓN / RRHH */}
      {/* ============================================================== */}
      {viewRole === 'admin_rrhh' && (
        <div className="space-y-6 animate-fadeIn">
      {/* 1. CABECERA PRINCIPAL DE RECURSOS HUMANOS */}
      <div className="p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                DIRECCIÓN DE OPERACIONES · CONTROL DE EQUIPO F&B
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-100">
              Gestión de Empleados & Certificaciones Obligatorias
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-3xl font-sans">
              Sistema integral de control de personal y cumplimiento normativo. Supervisa el estado de acreditaciones críticas (Manipulador de Alimentos, APPCC y PRL), gestiona fechas de caducidad y activa alertas tempranas automáticas para evitar infracciones sanitarias y laborales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSanitaryReportOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Reporte Inspección Sanidad</span>
            </button>

            <button
              onClick={() => setIsNewEmployeeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Empleado</span>
            </button>
          </div>
        </div>

        {/* 2. KPIS Y RESUMEN DE COBERTURA SANITARIA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] font-mono text-stone-400 uppercase flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Plantilla Activa</span>
            </span>
            <div className="text-2xl font-bold font-display text-stone-100">
              {metrics.totalEmployees} <span className="text-xs font-mono font-normal text-stone-500">empleados</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400 block">
              Unidad Operativa Principal
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] font-mono text-stone-400 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certificados Vigentes</span>
            </span>
            <div className="text-2xl font-bold font-display text-emerald-400">
              {metrics.vigentes}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 block">
              En regla y acreditados
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-900/40 space-y-1">
            <span className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Próximos a Caducar</span>
            </span>
            <div className="text-2xl font-bold font-display text-amber-300">
              {metrics.proximos}
            </div>
            <span className="text-[10px] font-mono text-amber-400 block">
              Vencen en ≤ 60 días
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/80 border border-rose-900/50 space-y-1">
            <span className="text-[11px] font-mono text-rose-400 uppercase flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Caducados (Alerta)</span>
            </span>
            <div className="text-2xl font-bold font-display text-rose-400">
              {metrics.caducados}
            </div>
            <span className="text-[10px] font-mono text-rose-400 block">
              ¡Renovación urgente!
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
            <span className="text-[11px] font-mono text-stone-400 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Manipuladores</span>
            </span>
            <div className="text-2xl font-bold font-display text-sky-300">
              {metrics.percentManipulador}%
            </div>
            <span className="text-[10px] font-mono text-stone-400 block">
              {metrics.pendientes} pendientes totales
            </span>
          </div>
        </div>

        {/* 3. BANNER DE ALERTAS AUTOMÁTICAS ACTIVAS */}
        {metrics.hasCriticalAlerts && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-900/60 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-mono font-bold text-amber-200 uppercase">
                  Alertas Automáticas de Caducidad Detectadas
                </h4>
                <p className="text-xs text-stone-300">
                  Hay <strong>{metrics.caducados} certificaciones vencidas</strong> y <strong>{metrics.proximos} próximas a caducar</strong> en los próximos 60 días.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAlertFilter('caducados')}
                className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-bold hover:bg-rose-900 transition-colors"
              >
                Ver Caducados ({metrics.caducados})
              </button>
              <button
                onClick={() => setAlertFilter('proximos')}
                className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold hover:bg-amber-900 transition-colors"
              >
                Ver Por Caducar ({metrics.proximos})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. BARRA DE HERRAMIENTAS Y FILTROS */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empleado, DNI o puesto..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Filtro Departamento */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-purple-500 focus:outline-none"
            >
              <option value="todos">Todos los Departamentos</option>
              <option value="food-and-beverage">F&B</option>
              <option value="cocina">Cocina & Producción</option>
              <option value="recepcion">Recepción & Front Desk</option>
              <option value="pisos">Pisos & Housekeeping</option>
              <option value="mantenimiento">Mantenimiento Técnico</option>
            </select>
          </div>

          {/* Filtro Alertas */}
          <div>
            <select
              value={alertFilter}
              onChange={(e) => setAlertFilter(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-purple-500 focus:outline-none"
            >
              <option value="todos">Todas las Alertas / Estados</option>
              <option value="caducados">🔴 Solo Caducados (Vencidos)</option>
              <option value="proximos">🟡 Próximos a Caducar (≤ 60 días)</option>
              <option value="pendientes">⚪ Pendientes de Obtener</option>
              <option value="vigentes">🟢 Solo Vigentes en Regla</option>
            </select>
          </div>

          {/* Filtro Certificación Específica */}
          <div>
            <select
              value={reqFilter}
              onChange={(e) => setReqFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-purple-500 focus:outline-none"
            >
              <option value="todos">Todas las Certificaciones</option>
              <option value="req-manipulador">Manipulador de Alimentos</option>
              <option value="req-alergenos">Alérgenos & APPCC</option>
              <option value="req-prl">PRL Hostelería</option>
              <option value="req-emergencias">Primeros Auxilios</option>
            </select>
          </div>
        </div>

        {/* Resumen de filtro activo */}
        {(searchTerm || deptFilter !== 'todos' || alertFilter !== 'todos' || reqFilter !== 'todos') && (
          <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[11px] font-mono text-stone-400">
            <span>
              Mostrando {filteredEmployees.length} de {employees.length} empleados con filtros activos.
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setDeptFilter('todos');
                setAlertFilter('todos');
                setReqFilter('todos');
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* 5. LISTADO DE EMPLEADOS Y SUS CERTIFICACIONES */}
      <div className="space-y-4">
        {filteredEmployees.map(emp => {
          return (
            <div 
              key={emp.id}
              className="p-5 sm:p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4 hover:border-stone-700 transition-all shadow-md"
            >
              {/* CABECERA DEL EMPLEADO */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-display font-bold text-stone-100">
                      {emp.fullName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                      DNI/NIE: {emp.dniNie || 'Pendiente'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800">
                      {emp.departmentLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-stone-400 flex-wrap">
                    <span className="text-stone-200 font-semibold">{emp.role}</span>
                    <span>·</span>
                    <span>{emp.shift || 'Turno estándar'}</span>
                    <span>·</span>
                    <span>Alta: {emp.startDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {emp.phone && (
                    <a 
                      href={`tel:${emp.phone}`}
                      title={emp.phone}
                      className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {emp.email && (
                    <a 
                      href={`mailto:${emp.email}`}
                      title={emp.email}
                      className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* REGISTRO DE CERTIFICACIONES OBLIGATORIAS DEL EMPLEADO */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-stone-400 uppercase font-semibold block">
                  Certificaciones Oficiales & Fechas de Caducidad:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {emp.requirements.map(req => {
                    const alert = calculateCertificationAlert(req);
                    const isObtained = req.hasCertificate && req.status !== 'pendiente';

                    return (
                      <div 
                        key={req.requirementId}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          alert.type === 'caducado'
                            ? 'bg-rose-950/25 border-rose-800/80 shadow-sm shadow-rose-950/40'
                            : alert.type === 'proximo'
                            ? 'bg-amber-950/20 border-amber-800/70'
                            : isObtained
                            ? 'bg-stone-950/80 border-stone-800'
                            : 'bg-stone-950/50 border-stone-850 opacity-90'
                        }`}
                      >
                        {/* Nombre del requisito y badge de alerta automática */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-stone-200 leading-snug">
                              {req.requirementName}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border shrink-0 ${alert.badgeClass}`}>
                              {alert.label}
                            </span>
                          </div>

                          {/* Mensaje de alerta descriptivo */}
                          <p className={`text-[11px] leading-relaxed font-sans ${
                            alert.type === 'caducado' 
                              ? 'text-rose-300 font-semibold' 
                              : alert.type === 'proximo' 
                              ? 'text-amber-300 font-semibold' 
                              : 'text-stone-400'
                          }`}>
                            {alert.message}
                          </p>

                          {/* Datos de fechas y carnet */}
                          {isObtained && (
                            <div className="pt-1 text-[11px] font-mono text-stone-300 space-y-0.5 border-t border-stone-850">
                              {req.expiryDate && (
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Caducidad:</span>
                                  <strong className={alert.type === 'caducado' ? 'text-rose-400' : alert.type === 'proximo' ? 'text-amber-400' : 'text-emerald-400'}>
                                    {req.expiryDate}
                                  </strong>
                                </div>
                              )}
                              {req.issueDate && (
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Expedición:</span>
                                  <span>{req.issueDate}</span>
                                </div>
                              )}
                              {req.certificateNumber && (
                                <div className="flex items-center justify-between">
                                  <span className="text-stone-500">Nº Registro:</span>
                                  <span className="text-stone-300">{req.certificateNumber}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* ACCIONES: TOGGLE RÁPIDO DE ESTADO (PENDIENTE / OBTENIDO) Y EDICIÓN DE FECHAS */}
                        <div className="pt-2 border-t border-stone-850 flex items-center justify-between gap-2">
                          {/* Si el empleado adjuntó un justificante desde su portal personal */}
                          {req.documentUrl && (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1 font-semibold">
                                <FileCheck className="w-3 h-3 text-sky-400" />
                                <span>Justificante Aportado por el Trabajador</span>
                              </span>
                            </div>
                          )}

                          <button
                            onClick={() => handleQuickToggleCert(emp.id, req.requirementId)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all font-semibold ${
                              isObtained
                                ? 'bg-emerald-950/80 hover:bg-stone-800 text-emerald-300 border border-emerald-700/60'
                                : 'bg-stone-800 hover:bg-emerald-600 hover:text-stone-950 text-stone-300 border border-stone-700'
                            }`}
                            title={isObtained ? 'Pulsar para marcar como pendiente' : 'Pulsar para marcar como obtenido'}
                          >
                            {isObtained ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Obtenido</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                <span>Marcar Obtenido</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setEditingCertEmployee({ employee: emp, cert: req })}
                            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-purple-400" />
                            <span>Editar Fechas</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-800 space-y-3">
            <Users className="w-8 h-8 text-stone-600 mx-auto" />
            <h4 className="text-lg font-display font-bold text-stone-300">
              No se encontraron empleados coincidentes
            </h4>
            <p className="text-xs text-stone-500 font-mono">
              Prueba a restablecer los filtros de búsqueda o da de alta un nuevo trabajador.
            </p>
          </div>
        )}
      </div>
      </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: EDITAR CERTIFICACIÓN, ESTADO (PENDIENTE/OBTENIDO) Y FECHAS DE CADUCIDAD */}
      {/* ============================================================== */}
      {editingCertEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                  RRHH · Registro de Certificaciones
                </span>
                <h3 className="text-lg font-display font-bold text-stone-100">
                  {editingCertEmployee.cert.requirementName}
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  Empleado: <strong className="text-stone-200">{editingCertEmployee.employee.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingCertEmployee(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertEdit} className="space-y-4 text-xs font-mono">
              {/* ESTADO DE LA CERTIFICACIÓN: PENDIENTE / OBTENIDO */}
              <div className="space-y-1">
                <label className="text-stone-300 block font-semibold">
                  Estado de la Certificación: *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('obtenido')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      editStatus === 'obtenido'
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-md'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Obtenido / Acreditado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatus('pendiente')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      editStatus === 'pendiente'
                        ? 'bg-rose-500 text-stone-950 border-rose-400 shadow-md'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pendiente de Obtener</span>
                  </button>
                </div>
              </div>

              {/* CAMPOS DE FECHAS SI ESTÁ OBTENIDO */}
              {editStatus === 'obtenido' && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block">
                    Vigencia y Control de Caducidad:
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400 uppercase">
                        Fecha de Expedición:
                      </label>
                      <input
                        type="text"
                        value={editIssueDate}
                        onChange={(e) => setEditIssueDate(e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-amber-400 uppercase font-bold">
                        Fecha de Caducidad: *
                      </label>
                      <input
                        type="text"
                        required
                        value={editExpiryDate}
                        onChange={(e) => setEditExpiryDate(e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="w-full bg-stone-900 border border-amber-600 rounded-xl px-3 py-2 text-stone-100 font-bold focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase">
                      Nº de Carnet / Registro Oficial:
                    </label>
                    <input
                      type="text"
                      value={editCertNumber}
                      onChange={(e) => setEditCertNumber(e.target.value)}
                      placeholder="Ej. CMA-CAN-884210"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* OBSERVACIONES */}
              <div className="space-y-1">
                <label className="text-stone-300 block">
                  Observaciones / Entidad Emisora / Mutua:
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Detalles sobre renovación, academia que expidió el carnet, justificante aportado..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingCertEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ALTA DE NUEVO EMPLEADO EN PLANTILLA */}
      {/* ============================================================== */}
      {isNewEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                  RRHH · Plantilla Operativa F&B
                </span>
                <h3 className="text-lg font-display font-bold text-stone-100">
                  Alta de Nuevo Empleado
                </h3>
              </div>
              <button
                onClick={() => setIsNewEmployeeModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-stone-300 block">Nombre Completo y Apellidos: *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej. Roberto Sánchez Cabrera"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 block">DNI / NIE: *</label>
                  <input
                    type="text"
                    required
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                    placeholder="Ej. 42198033M"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 block">Departamento: *</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="food-and-beverage">F&B</option>
                    <option value="cocina">Cocina & Producción</option>
                    <option value="recepcion">Recepción & Front Desk</option>
                    <option value="pisos">Pisos & Housekeeping</option>
                    <option value="mantenimiento">Mantenimiento Técnico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 block">Puesto / Categoría: *</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Ej. Camarero de Sala o Barman"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 block">Turno Asignado:</label>
                  <input
                    type="text"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    placeholder="Ej. Tarde / Noche (15:00 - 22:30)"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 block">Teléfono Móvil:</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+34 600 00 00 00"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 block">Email Corporativo / Personal:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nombre@operations.fnhub-portal.internal"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ASIGNACIÓN INICIAL DE MANIPULADOR DE ALIMENTOS */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-stone-200 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>¿Posee Carnet de Manipulador de Alimentos?</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={newHasManipulador}
                    onChange={(e) => setNewHasManipulador(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                </div>

                {newHasManipulador && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] text-amber-400 uppercase font-bold">
                      Fecha de Caducidad del Carnet:
                    </label>
                    <input
                      type="date"
                      value={newManipuladorExpiry}
                      onChange={(e) => setNewManipuladorExpiry(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsNewEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold"
                >
                  Guardar y Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REPORTE OFICIAL DE INSPECCIÓN SANITARIA Y TRABAJO */}
      {/* ============================================================== */}
      {isSanitaryReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Auditoría Legal de Recursos Humanos
                </span>
                <h3 className="text-xl font-display font-bold text-stone-100">
                  Informe Oficial de Cumplimiento Sanitario & PRL
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  Centro de Trabajo: {hotelName} · Fecha de Emisión: 23/09/2026
                </p>
              </div>
              <button
                onClick={() => setIsSanitaryReportOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-[11px] uppercase font-bold text-stone-300 block">
                  Resumen de Acreditación ante Sanidad:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Total Plantilla:</span>
                    <strong className="text-stone-100 text-sm">{metrics.totalEmployees}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Manipuladores en Regla:</span>
                    <strong className="text-emerald-400 text-sm">{metrics.percentManipulador}%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Certificados Caducados:</span>
                    <strong className="text-rose-400 text-sm">{metrics.caducados}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Por Caducar (≤ 60d):</span>
                    <strong className="text-amber-400 text-sm">{metrics.proximos}</strong>
                  </div>
                </div>
              </div>

              {/* TABLA RESUMEN */}
              <div className="overflow-x-auto rounded-2xl border border-stone-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-950 text-stone-400 border-b border-stone-800 text-[10px] uppercase">
                      <th className="p-3">Trabajador</th>
                      <th className="p-3">DNI / Puesto</th>
                      <th className="p-3">Manipulador</th>
                      <th className="p-3">Caducidad</th>
                      <th className="p-3">Alérgenos / PRL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850">
                    {employees.map(emp => {
                      const manip = emp.requirements.find(r => r.requirementId === 'req-manipulador');
                      const manipAlert = manip ? calculateCertificationAlert(manip) : null;

                      return (
                        <tr key={emp.id} className="hover:bg-stone-850/50">
                          <td className="p-3 font-bold text-stone-200">{emp.fullName}</td>
                          <td className="p-3 text-stone-400">
                            <div>{emp.dniNie}</div>
                            <div className="text-[10px] text-stone-500">{emp.role}</div>
                          </td>
                          <td className="p-3">
                            {manipAlert ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] border ${manipAlert.badgeClass}`}>
                                {manipAlert.label}
                              </span>
                            ) : (
                              <span className="text-stone-500">N/A</span>
                            )}
                          </td>
                          <td className="p-3 font-mono">
                            {manip?.expiryDate || '—'}
                          </td>
                          <td className="p-3 text-[10px] text-stone-400">
                            {emp.requirements.filter(r => r.requirementId !== 'req-manipulador').map(r => r.hasCertificate ? '✓ ' + r.requirementName.substring(0, 10) : '').filter(Boolean).join(', ') || 'Pendiente'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 font-mono text-xs hover:bg-stone-750 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-purple-400" />
                <span>Imprimir Reporte</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSanitaryReportOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-500 text-stone-950 font-bold font-mono text-xs hover:bg-purple-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: IDENTIDAD VISUAL, TEMÁTICA Y COLORES CORPORATIVOS */}
      {/* ============================================================== */}
      {isBrandingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-2xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    OPERATIONAL BRAND SYSTEM · IDENTIDAD VISUAL
                  </span>
                  <h3 className="text-xl font-display font-bold text-stone-100">
                    Temática & Colores Operativos por Unidad F&B
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsBrandingModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              En la plataforma <strong>Operations Hub</strong>, cada unidad operativa dispone de una identidad cromática propia ajustada a su área de servicio, manteniendo al mismo tiempo una estructura de navegación y rigor operativo uniforme.
            </p>

            <div className="space-y-4">
              {/* UNIDAD PRINCIPAL */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <h4 className="text-sm font-display font-bold text-stone-100">
                      Unidad Operativa Principal (F&B / Central)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Área: Coctelería de Autor & Gastronomía
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-emerald-900/60 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500/50"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Esmeralda Principal</div>
                      <div className="text-emerald-400 font-bold">#10B981</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-amber-900/60 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-amber-500 shrink-0 shadow-sm shadow-amber-500/50"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Ámbar F&B</div>
                      <div className="text-amber-400 font-bold">#F59E0B</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-stone-950 border border-stone-700 shrink-0"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Basalto</div>
                      <div className="text-stone-300 font-bold">#0C0A09</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* UNIDAD SATÉLITE 2 */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <h4 className="text-sm font-display font-bold text-stone-100">
                      Unidad Operativa 2 (Punto de Venta Satélite)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                    Área: Servicio Rápido & Terraza
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-orange-900/60 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-orange-600 shrink-0 shadow-sm shadow-orange-600/50"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Terracota</div>
                      <div className="text-orange-400 font-bold">#EA580C</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-amber-900/60 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Ámbar</div>
                      <div className="text-amber-300 font-bold">#FBBF24</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-stone-900 border border-stone-700 shrink-0"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Carbón</div>
                      <div className="text-stone-300 font-bold">#1C1917</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIRECCIÓN CENTRAL */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <h4 className="text-sm font-display font-bold text-stone-100">
                      Dirección de Operaciones / Central
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Área: Estándares & Auditoría
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-blue-900/60 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-blue-500 shrink-0 shadow-sm shadow-blue-500/50"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Azul Corporativo</div>
                      <div className="text-blue-400 font-bold">#3B82F6</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-400 shrink-0"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Platino</div>
                      <div className="text-slate-300 font-bold">#94A3B8</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-950 border border-slate-700 shrink-0"></span>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Pizarra</div>
                      <div className="text-slate-300 font-bold">#0F172A</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-purple-900/40 text-xs font-sans text-stone-300 space-y-1">
              <strong className="text-purple-300 font-mono block">💡 Personalización Operativa:</strong>
              <p>
                Cada unidad mantiene su jerarquía independiente de departamentos, áreas, cartas y procedimientos sin alterar el funcionamiento global ni los datos de la plantilla.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsBrandingModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-purple-500 text-stone-950 font-bold font-mono text-xs hover:bg-purple-400 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
