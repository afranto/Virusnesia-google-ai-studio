import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client with required header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for Dr. Vira - Virology Tutor
const SYSTEM_INSTRUCTION = `Anda adalah Dr. Vira, Asisten & Tutor Ahli Virologi VIRUSNESIA untuk peserta didik Biologi Kelas X SMA.
Karakter Anda:
- Ramah, antusias terhadap sains mikrobiologi, berbasis bukti ilmiah (scientific evidence-based), dan komunikatif.
- Mengedepankan prinsip Mindful, Meaningful, dan Joyful: jelaskan konsep rumit seperti siklus litik, siklus lisogenik, struktur bakteriofag, regulasi ekspresi gen profag (gen cI dan cro), serta terapi bakteriofag dengan bahasa yang mudah dipahami peserta didik SMA namun tetap akurat.
- Selalu cantumkan istilah biologi yang tepat (misal: adsorpsi, penetrasi, eklipase/sintesis, perakitan, lisis, profag, transduksi, genom dsDNA, protein kapsid gp23).
- Jika ada pertanyaan tentang riset terbaru atau aplikasi medis (seperti terapi fag terhadap bakteri resisten antibiotik, riset virologi mutakhir), gunakan informasi terkini dari Google Search grounding. Berikan penjelasan yang mendidik dan sertakan sumber terpercaya.
- Jawab dalam Bahasa Indonesia yang baik dan menarik. Format jawaban dengan markdown rapi, poin-poin yang mudah dibaca, dan highlight istilah kunci.`;

// API endpoint for Gemini chat with Google Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'Pesan pertanyaan wajib diisi.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY belum terkonfigurasi pada server.',
      });
    }

    // Prepare contents history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content || '' }],
        });
      }
    }

    if (userMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const replyText = response.text || candidate?.content?.parts?.[0]?.text || '';
    
    // Extract search grounding metadata if available
    const groundingMetadata = candidate?.groundingMetadata;
    const searchQueries = groundingMetadata?.webSearchQueries || [];
    const searchChunks = (groundingMetadata?.groundingChunks || []).map((chunk: any) => ({
      title: chunk.web?.title || 'Sumber Web',
      uri: chunk.web?.uri || '',
    })).filter((c: any) => c.uri);

    res.json({
      reply: replyText,
      searchQueries,
      groundingSources: searchChunks,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Gagal menghasilkan tanggapan dari Gemini API.',
    });
  }
});

// Bioscience reference data endpoint for offline or rapid lookup
app.get('/api/science/phage-data', (_req, res) => {
  res.json({
    organism: 'Bacteriophage T4 (Enterobacteria phage T4)',
    taxonomy: 'Viruses > Caudoviricetes > Straboviridae > Tequatrovirus > Tequatrovirus T4',
    ncbiRefSeq: 'NC_000866.4',
    genomeSizeBp: 168903,
    genomeType: 'Linear double-stranded DNA (dsDNA) with terminal redundancy and circular permutation',
    capsidStructure: {
      morphology: 'Prolate icosahedral head (elongated icosahedron)',
      triangulationNumber: 'T = 13 (laevo) for icosahedral end caps, Q = 21 for prolate midsection',
      majorCapsidProtein: 'gp23* (43 kDa, 960 copies forming hexameric lattice)',
      vertexProtein: 'gp24* (forming pentamers at 11 vertices)',
      portalProtein: 'gp20 (dodecameric channel at base for DNA packaging)',
    },
    tailContractileApparatus: {
      sheathProtein: 'gp18 (contractile helical sheath of 24 hexameric rings)',
      tailTube: 'gp19 (inner rigid hollow tube through which DNA passes)',
      baseplate: 'Multiprotein dome complex (gp27, gp5, gp6, gp7, gp8, gp9, gp10, gp11, gp12)',
      tailFibers: '6 long articulated tail fibers (gp34, gp35, gp36, gp37) sensing LPS and OmpC outer membrane proteins',
    },
    molecularSwitchLambda: {
      lysogenicState: 'cI repressor binds OR1 and OR2, repressing cro and PR promoter while maintaining its own transcription from PRM.',
      inductionMechanism: 'DNA damage activates host RecA -> triggers autocatalytic cleavage of cI repressor -> derepresses PR and PL -> transcription of Cro, replication proteins, and Q antiterminator initiates lytic cascade.',
    },
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VIRUSNESIA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
