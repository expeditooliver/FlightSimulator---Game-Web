# ✈️ FlightSimulator — Game Web

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-0.170-000000?logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/License-MIT-brightgreen" alt="License" />
</p>

<span style="color:#4ade80">Bem‑vindo(a)!</span> Este é um simulador de voo 3D para web, construído com React + Three.js, rodando sobre Vite e servido por um backend em Express. Foi pensado para ser leve, divertido e fácil de rodar localmente. 🚀🛩️

## 🌟 Visão Geral
- Renderização 3D com `@react-three/fiber` e `three`.
- UI moderna com TailwindCSS e Radix UI.
- Sons, texturas e geometria otimizados no diretório `client/public`.
- Servidor Express que integra o Vite em desenvolvimento e serve estáticos em produção.
- Estado e dados com `zustand` e `@tanstack/react-query`.

> Objetivo: proporcionar uma experiência de voo suave, com HUD, câmera dinâmica, ambiente e controles intuitivos.

## 🎮 Controles
Os controles básicos de voo (presentes nos componentes `App.tsx` e `Aircraft.tsx`):
- ⏫ Acelerar: `W` ou `ArrowUp`
- ⏬ Desacelerar: `S` ou `ArrowDown`
- ↩️ Rolagem à esquerda: `A` ou `ArrowLeft`
- ↪️ Rolagem à direita: `D` ou `ArrowRight`
- ↔️ Guinada (Yaw): `Q` (esquerda) / `E` (direita)

Dica: mantenha aceleração suave para estabilidade e use rolarem leves em curvas fechadas. ✨

## 🧩 Principais Tecnologias
- `React 18` + `Vite 5` + `TypeScript`
- `@react-three/fiber`, `@react-three/drei`, `postprocessing`, `vite-plugin-glsl`
- `TailwindCSS` + Radix UI + utilitários (cmdk, framer-motion, lucide-react)
- `Express 4` para backend (integração com Vite em dev, estáticos em prod)
- `zustand` (estado) e `@tanstack/react-query` (dados)
- Áudio com `howler`, físicas/geométricas de apoio com `gl-matrix`, `matter-js` e `ogl` (quando necessário)

## 🗂️ Estrutura do Projeto
```
FlightSimulator---Game-Web/
├─ client/
│  ├─ index.html
│  └─ src/
│     ├─ components/        # Aircraft, Environment, FlightCamera, HUD, UI
│     ├─ lib/               # stores, query client, utils
│     ├─ pages/             # páginas/rotas
│     ├─ index.css          # estilos Tailwind
│     └─ main.tsx           # bootstrap do app
├─ server/
│  ├─ index.ts              # Express + integração com Vite
│  ├─ vite.ts               # middleware Vite e HTML transform
│  ├─ routes.ts             # rotas de API
│  └─ storage.ts            # utilitários de storage (quando aplicável)
├─ shared/                  # schemas/contratos compartilhados
├─ vite.config.ts           # build do client
├─ tailwind.config.ts       # tema e utilitários
└─ package.json             # scripts e dependências
```

## ⚙️ Como Rodar Localmente
Pré‑requisitos:
- Node.js `>= 18`
- npm (ou pnpm/yarn)

Passos:
1. Instale dependências:
   ```bash
   npm install
   ```
2. Ambiente de desenvolvimento (server + client via Vite):
   ```bash
   npm run dev
   # abre em http://localhost:5000
   ```

## 📦 Build e Produção
- Gerar build de produção do client e backend:
  ```bash
  npm run build
  ```
- Iniciar em modo produção:
  ```bash
  npm start
  # Servidor Express ouvindo em http://localhost:5000
  ```

## 🖼️ HUD, Câmera e Ambiente
- `HUD`: indicações visuais de voo, status e informações.
- `FlightCamera`: acompanha a aeronave com suaves transições.
- `Environment`: céu/luz/efeitos para imersão.

> Tudo é pensado para manter performance alta e sensação de controle. 🌤️

## 📸 Screenshots
As imagens abaixo ilustram a experiência do simulador. Os arquivos são mantidos em `docs/screenshots/` e podem ser atualizados a qualquer momento.

<p align="center">
  <strong>Tela Inicial</strong><br/>
  <img alt="Flight Simulator - Landing" src="docs/screenshots/landing.png" width="900" />
</p>

<p align="center">
  <strong>Controles e Dicas de Voo</strong><br/>
  <img alt="Flight Simulator - Controls" src="docs/screenshots/controls.png" width="900" />
</p>

<p align="center">
  <strong>Vista em Perseguição</strong><br/>
  <img alt="Flight Simulator - Inflight Chase View" src="docs/screenshots/inflight.png" width="900" />
</p>

> Para atualizar as imagens, substitua os arquivos em `docs/screenshots/` pelos novos PNG/JPG e faça um commit.

## 🎨 Estilo e Cores
- Tailwind com tema estendido (`tailwind.config.ts`), incluindo cores `primary`, `accent`, `foreground`, etc.
- Componentes Radix estilizados para tooltips, diálogos, menus e muito mais.

## 🗺️ Rotas e API
- O servidor Express inclui middleware de logging e JSON.
- Em desenvolvimento, o Vite é usado em modo middleware para entregar o `index.html` com cache busting.
- Em produção, os arquivos estáticos gerados pelo Vite são servidos pelo Express.

## 🧪 Qualidade e Performance
- Preferência por animações leves e cálculos de física no `useFrame`.
- Evite alocar objetos em loops de render.
- Texturas otimizadas em `client/public/textures` e sons em `client/public/sounds`.

## 🤝 Contribuição
- Faça um fork e abra uma PR com uma descrição clara.
- Sugestões de novos controles, HUDs, câmeras e cenários são super bem‑vindas! 💡

### Atualização de README e Mídia
- Screenshots residem em `docs/screenshots/` (`landing.png`, `controls.png`, `inflight.png`).
- Ao alterar nomes, ajuste os caminhos na seção "📸 Screenshots" acima.

## 📜 Licença
Este projeto está sob licença MIT. Sinta‑se livre para usar e modificar. 💚

---

Feito com 💙 e muita curiosidade. Bons voos! 🛫✨
