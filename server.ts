import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { KLAYMAN_OFFICIAL_KNOWLEDGE_PROMPT, getLocalDeterministicAnswer } from './src/services/assistantEngine';
import { tenantVaultEngine, MASTER_READ_ONLY_TEMPLATES } from './src/server/tenantVault';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    portal: 'PROA - Plataforma de Gestión Operativa Multiempresa',
    multiTenantIsolation: 'active_server_enforced',
    timestamp: new Date().toISOString()
  });
});

// =========================================================================
// ENDPOINTS DE AISLAMIENTO MULTIEMPRESA (TENANT VAULT API)
// =========================================================================

// 1. Registro de Nueva Organización Privada
app.post('/api/tenant/register', (req, res) => {
  try {
    const { name, adminEmail, initialEstablishmentName } = req.body;
    if (!name || !adminEmail) {
      return res.status(400).json({ error: 'Nombre de empresa y email de administrador son obligatorios.' });
    }
    const result = tenantVaultEngine.registerOrganization(name, adminEmail, initialEstablishmentName);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error registrando organización.' });
  }
});

// 2. Inicio de Sesión / Validación de Token de Organización o Clave de Equipo
app.post('/api/tenant/login', (req, res) => {
  try {
    const { tokenOrKey } = req.body;
    if (!tokenOrKey) {
      return res.status(400).json({ error: 'Token de acceso o clave de equipo requerida.' });
    }
    const org = tenantVaultEngine.authenticateToken(tokenOrKey);
    if (!org) {
      return res.status(401).json({ error: 'Credencial no válida o no encontrada en el vault de organizaciones.' });
    }
    return res.json({
      org: {
        id: org.id,
        code: org.code,
        name: org.name,
        adminEmail: org.adminEmail,
        teamJoinKey: org.teamJoinKey,
        plan: org.plan,
        isDemoTenant: org.isDemoTenant
      },
      token: org.secretToken
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error en autenticación de tenant.' });
  }
});

// 3. Obtener Espacio de Trabajo Privado (Con Verificación de Aislamiento 403)
app.get('/api/tenant/workspace/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const authHeader = req.headers.authorization;

    const access = tenantVaultEngine.validateTenantAccess(authHeader, orgId);
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const workspace = tenantVaultEngine.getTenantWorkspace(orgId);
    if (!workspace) {
      return res.status(404).json({ error: 'Espacio de trabajo no encontrado para esta organización.' });
    }

    return res.json({ workspace, organization: access.org });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error consultando workspace.' });
  }
});

// 4. Guardar o Actualizar Datos del Espacio Privado (Verificación de Aislamiento)
app.post('/api/tenant/workspace/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const authHeader = req.headers.authorization;
    const { data } = req.body;

    const access = tenantVaultEngine.validateTenantAccess(authHeader, orgId);
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const updated = tenantVaultEngine.saveTenantWorkspace(orgId, data || {});
    return res.json({ success: true, workspace: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error actualizando workspace.' });
  }
});

// 4b. Obtener Configuración Operativa y Administrativa (Aislamiento 403)
app.get('/api/tenant/admin-config/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const authHeader = req.headers.authorization;

    const access = tenantVaultEngine.validateTenantAccess(authHeader, orgId);
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const adminConfig = tenantVaultEngine.getTenantAdminConfig(orgId);
    return res.json({ adminConfig, organizationId: orgId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error consultando configuración administrativa.' });
  }
});

// 4c. Guardar Configuración Operativa y Administrativa (Aislamiento 403 y persistencia)
app.post('/api/tenant/admin-config/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const authHeader = req.headers.authorization;
    const { config } = req.body;

    const access = tenantVaultEngine.validateTenantAccess(authHeader, orgId);
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const saved = tenantVaultEngine.saveTenantAdminConfig(orgId, config);
    return res.json({ success: true, adminConfig: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error guardando configuración administrativa.' });
  }
});

// 5. Clonar Plantilla Maestra a Espacio Privado (Inmutabilidad del Original)
app.post('/api/tenant/clone-template', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const { orgId, templateId, customName } = req.body;

    if (!orgId || !templateId) {
      return res.status(400).json({ error: 'orgId y templateId son requeridos.' });
    }

    const access = tenantVaultEngine.validateTenantAccess(authHeader, orgId);
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const result = tenantVaultEngine.cloneTemplateToTenant(orgId, templateId, customName);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error clonando plantilla.' });
  }
});

// 6. Listado de Plantillas Maestras Inmutables
app.get('/api/tenant/templates', (req, res) => {
  res.json({ templates: MASTER_READ_ONLY_TEMPLATES });
});

// 7. SUITE DE AUDITORÍA DE SEGURIDAD (8 TESTS CRUZADOS Y CERTIFICACIÓN OFICIAL)
app.post('/api/tenant/security-audit', (req, res) => {
  try {
    const report = tenantVaultEngine.runSecurityIsolationAudit();
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error ejecutando suite de seguridad.' });
  }
});

// 8. LOGS DE EVENTOS DE AUDITORÍA Y ALERTAS DE SEGURIDAD
app.get('/api/tenant/security-logs', (req, res) => {
  try {
    const logs = tenantVaultEngine.getSecurityAlertLogs();
    res.json({ logs, count: logs.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error consultando logs de seguridad.' });
  }
});

// 9. OBTENER DOCUMENTO O ARCHIVO PRIVADO (CON VALIDACIÓN DE TOKEN Y PERTENENCIA 403)
app.get('/api/tenant/documents/:orgId/:docId', (req, res) => {
  try {
    const { orgId, docId } = req.params;
    const authHeader = req.headers.authorization;

    const access = tenantVaultEngine.validateTenantAccess(
      authHeader,
      orgId,
      `/api/tenant/documents/${orgId}/${docId}`
    );
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const doc = tenantVaultEngine.getTenantDocumentFile(orgId, docId);
    if (!doc) {
      return res.status(404).json({ error: 'Documento privado no encontrado en la partición de la organización.' });
    }

    return res.json(doc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error recuperando archivo privado.' });
  }
});

// 10. SUBIR DOCUMENTO PRIVADO A PARTICIÓN AISLADA
app.post('/api/tenant/documents/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const authHeader = req.headers.authorization;
    const { docId, filename, mimeType, content } = req.body;

    if (!docId || !filename || !content) {
      return res.status(400).json({ error: 'docId, filename y content son obligatorios.' });
    }

    const access = tenantVaultEngine.validateTenantAccess(
      authHeader,
      orgId,
      `/api/tenant/documents/${orgId}`
    );
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const saved = tenantVaultEngine.saveTenantDocumentFile(orgId, docId, filename, mimeType || 'application/json', content);
    return res.status(201).json({ success: true, document: saved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error guardando archivo privado.' });
  }
});

// 11. ELIMINAR DOCUMENTO PRIVADO
app.delete('/api/tenant/documents/:orgId/:docId', (req, res) => {
  try {
    const { orgId, docId } = req.params;
    const authHeader = req.headers.authorization;

    const access = tenantVaultEngine.validateTenantAccess(
      authHeader,
      orgId,
      `/api/tenant/documents/${orgId}/${docId}`
    );
    if (!access.authorized) {
      return res.status(403).json({ error: access.error });
    }

    const deleted = tenantVaultEngine.deleteTenantDocumentFile(orgId, docId);
    return res.json({ success: deleted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error eliminando archivo privado.' });
  }
});

// Asistente Operativo Oficial KLAYMAN · AYUDA
app.post('/api/assistant/query', async (req, res) => {
  const { query, history } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'La consulta no puede estar vacía' });
  }

  const cleanQuery = query.trim();

  // Si tenemos API Key disponible en el servidor, usamos Gemini 3.8 Flash con grounding oficial
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `Eres el ASISTENTE OPERATIVO KLAYMAN (marca: KLAYMAN · AYUDA), la herramienta oficial de soporte en turno para los empleados de Klayman Diamond Aparthotel.
Tu función es: Encontrar → Explicar → Indicar dónde está la información en el portal → Guiar al empleado con precisión técnica.

REGLA DE ORO ESTRICTA:
Debes responder basándote EXCLUSIVAMENTE en la documentación oficial provista a continuación.
Si la consulta del usuario NO está contemplada en la documentación oficial cargada en el portal, DEBES responder exactamente:
"No dispongo de información suficiente en la documentación oficial cargada en el portal. Consulta con tu supervisor o jefe de departamento."
NUNCA inventes procedimientos, números de teléfono, extensiones, ingredientes, dosificaciones ni precios.

ESTILO Y FORMATO:
- Tono profesional, directo, operativo y claro (apto para servicio rápido en sala y barra).
- Usa viñetas o pasos numerados si explicas un procedimiento o receta.
- Incluye siempre al final de la respuesta la indicación clara:
  "📍 Dónde encontrarlo en el portal: [Nombre del departamento → Pestaña → Sección]"

DOCUMENTACIÓN OFICIAL AUTORIZADA:
${KLAYMAN_OFFICIAL_KNOWLEDGE_PROMPT}
`;

      let promptContents = cleanQuery;
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-4).map(h => `${h.role === 'user' ? 'Empleado' : 'Asistente'}: ${h.text}`).join('\n');
        promptContents = `Historial reciente:\n${recentHistory}\n\nNueva consulta del empleado:\n${cleanQuery}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents,
        config: {
          systemInstruction,
          temperature: 0.2, // Baja temperatura para máxima adherencia a hechos
        }
      });

      const generatedText = response.text || '';
      if (generatedText.trim()) {
        return res.json({
          answer: generatedText.trim(),
          source: 'ai_grounded'
        });
      }
    } catch (aiErr) {
      console.warn('Advertencia en llamada Gemini API, activando motor determinista:', aiErr);
    }
  }

  // Fallback determinista inmediato basado en la documentación oficial
  const fallback = getLocalDeterministicAnswer(cleanQuery);
  return res.json({
    answer: fallback.answer,
    location: fallback.location,
    category: fallback.category,
    suggestedAction: fallback.suggestedAction,
    source: 'local_official_docs'
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grupo Clima Portal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
