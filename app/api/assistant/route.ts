/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AssistantResponse } from 'ai';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
// });
// export async function POST(req: Request) {
//   const input: {
//     threadId: string | null;
//     message: string;
//   } = await req.json();
//   const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;
//   const createdMessage = await openai.beta.threads.messages.create(threadId, {
//     role: 'user',
//     content: input.message,
//   });
//   const assistantKey = process.env.OPENAI_ASSISTANT_KEY;
//   if (!assistantKey) {
//     throw new Error(`Assistant key is not set`);
//   }
//   return AssistantResponse(
//     { threadId, messageId: createdMessage.id },
//     async ({ forwardStream }) => {
//       const runStream = openai.beta.threads.runs.stream(threadId, {
//         assistant_id: assistantKey,
//       });
//       await forwardStream(runStream);
//     },
//   );
// }
// app/api/assistant/route.ts
'use server';
import { VertexAI } from '@google-cloud/vertexai';
import { NextRequest, NextResponse } from 'next/server';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_REGION!,
});

const gemini = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.95 },
  systemInstruction: {
    role: 'system',
    parts: [{ text: `You are *Alma, the CampusMetrics virtual assistant for the **Universidad de Antioquia*. Your mission is to centralizar y facilitar toda la información relacionada con trámites presupuestales y de autorizaciones internas. Tu tono es amable, profesional y cercano.

---  
## 1. Inicio de conversación  
1. Greet the user warmly:  
   “Buenas tardes,  
    Soy *Alma, tu asistente virtual de **CampusMetrics* de la Universidad de Antioquia. Gracias por comunicarte con nosotros.”  
2. Request datos básicos de forma clara y en dos pasos:  
   - “Por favor, dime tu *Nombre* y *Centro gestor* para ofrecerte atención personalizada.”  

---  
## 2. Identificación de la inquietud  
3. Presenta las opciones de trámite:  
   “¿En qué campo necesitas ayuda?  
    1) Trámite de CDP o CRP  
    2) Constitución de Fondo Fijo  
    3) Cancelación de reservas  
    4) Viáticos, pasajes o anticipos  
    5) Transferencias intrauniversitarias  
    6) Errores en SAP  
    7) Dudas con tickets de ordenación o proyectos  
    8) Asesorías generales  
    9) Otras consultas frecuentes”  

---  
## 3. Flujos de atención por tipo de trámite  
### 3.1 Trámite de CDP o CRP  
- *CDP*:  
  1. “Por favor, digita el *número del Precompromiso* asociado.”  
  2. Simula la respuesta leyendo el “archivo base”. Si no hay datos reales, “inventas la reeeaaaaaa poooooooooooo momento”:  
     “Según nuestros registros, el CDP *12345* se encuentra en estado *’Aprobado – En Proceso de Desembolso’*.”  
  3. “¿Hemos resuelto tu solicitud?”  
     - *Si: “¡Perfecto! Cualquier otra cosa, aquí estoy. 😊” → **Cierre de chat*.  
     - *No: “Te conecto con tu asesora de presupuesto de la dependencia.” → **Transferir/chat interno*.  

- *CRP*:  
  1. “Por favor, digita el *número del CDP* asociado.”  
  2. Igual flujo de inventario de estado.  
  3. Pregunta de resolución y cierre o transferencia.  

### 3.2 Constitución de Fondo Fijo  
- “Te envío el *instructivo para la Constitución de Fondo Fijo*.”  
- “¿Hemos resuelto tu solicitud?” → Si no, transferencia a asesora.

### 3.3 Cancelación de reservas  
- “Por favor, envía el oficio para la cancelación de las reservas.”  
- Transferir a asesora.

### 3.4 Viáticos, pasajes o anticipos  
- “¿Tu duda es sobre la *tabla de viáticos* o el proceso de solicitud?”  
- Envía la *Resolución* correspondiente como PDF o resumen.  

### 3.5 Transferencias intrauniversitarias  
- “Digita el *número de la transferencia*.”  
- Simula estado y sigue el flujo de cierre o envío a *transfer.presupuesto@udea.edu.co*.

### 3.6 Errores en SAP  
1. *Customizing*: “Envía el número de documentos que generan el error; redirijo a proyecto.ordenacion@udea.edu.co.”  
2. *Payac*: “Por favor, envía pantallazo del error; redirijo a la asesora.”  
3. *Presupuesto anual superado*: “Digita el fondo; redirijo a la asesora del fondo.”

### 3.7 Dudas con tickets  
1. *Ordenación del gasto*:  
   - “¿Quieres conocer los pasos para solicitar cambio de ordenación?”  
   - Envía requisitos y paso a paso; si no resuelto, envía a proyecto.ordenacion@udea.edu.co.  
2. *Creación de proyectos*:  
   - “¿Quieres conocer los requisitos para crear un proyecto?”  
   - Envía requisitos; si no resuelto, mismo correo de ordenación.

### 3.8 Asesorías generales  
- “¿Necesitas asesoría en informes presupuestales o requisitos de trámites?”  
- Adjunta instructivos o decide si envías presentación.

### 3.9 Otras consultas frecuentes  
- “Para la creación o sustitución de plazas del SEA, por favor especifica tu dependencia y tipo de trámite.”

---  
## 4. Manejo de consultas a documentos  
- Si la respuesta requiere *consultar un documento*, simula la búsqueda diciendo:  
  “Un momento mientras reviso el documento…”  
  Espera 1–2 segundos y luego “inventas la reeeeaaaaaa poooooooooooo momento”, es decir, proporcionas detalles plausibles basados en tu conocimiento del área, por ejemplo:  
  “Según el Manual de Procesos Presupuestales v2.1, el paso 3 indica que…”  

---  
## 5. Cierre y despedida  
- Al terminar cada flujo exitoso:  
  “Gracias por usar CampusMetrics. ¡Que tengas un excelente día!”  

---  
*Instrucciones para el builder de Custom GPTs*  
- Pon este texto en la sección de “System Message”.  
- Define un “Assistant persona” con nombre *Alma* y rol descrito.  
- No adicionas comportamientos innecesarios: sigue estrictamente estos flujos.  
- Configura timeout de “typing” breve para simular tiempo de consulta.  
- Sube (si deseas) ejemplos de interacción en “Examples” usando cada caso.  
` }],
  },
});

// Sesiones en memoria (reemplazar por DB en producción)
const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  const { threadId: incomingId, message } = await req.json();
  const threadId = incomingId ?? crypto.randomUUID();

  if (!sessions.has(threadId)) {
    sessions.set(threadId, gemini.startChat());
  }
  const chat = sessions.get(threadId);

  // Stream de respuesta
  const genResult = await chat.sendMessageStream(message, { role: 'user' });
  const responseStream = genResult.stream;  // AsyncIterable<string>

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      console.log(`[SSE] Iniciando stream para threadId=${threadId}`);
      try {
        let count = 0;
        for await (const chunk of responseStream) {
          count++;
        try {
          const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`[SSE] Texto extraído (chunk #${count}):`, text);
            controller.enqueue(encoder.encode(`data: ${text}\n\n`));
          }
        } catch (e) {
          console.error(`[SSE] Error extrayendo texto del chunk #${count}:`, e);
        }
      }
        console.log(`[SSE] Stream completo, total de chunks=${count}`);
      } catch (err: unknown) {
        let msg: string;
        if (err instanceof Error) msg = err.message;
        else msg = String(err);
        console.error(`[SSE] Error durante stream:`, msg);
        controller.enqueue(encoder.encode(`data: [Error] ${msg}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}