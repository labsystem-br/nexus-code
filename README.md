# Nexus Code - Landing Page

Esta pasta contém o código fonte completo da Landing Page da Nexus Code.

## 🚀 Como Iniciar

1. **Simples**: Apenas abra o arquivo `index.html` no seu navegador (Chrome, Edge, Firefox).
2. **Servidor Local (Recomendado)**: Se tiver o VS Code, instale a extensão "Live Server" e clique em "Go Live".

## ⚙️ Configuração Obrigatória

### 1. Definir seu Número WhatsApp
Abra o arquivo `script.js` e vá para a linha 6:

```javascript
// Linha 6 do script.js
const WHATSAPP_NUMBER = "5511999999999"; // <--- COLOQUE SEU NÚMERO AQUI
```

Substitua pelo número da sua empresa (com DDD e 55 do Brasil, apenas números).

### 2. Personalizar o Formulário
Atualmente, os leads são salvos no **LocalStorage** do navegador (para teste) e exibidos no Console (F12).
Para ligar a um backend real, edite a linha 87 do `script.js`.

## 🎨 Estrutura

- `index.html`: Estrutura do site, textos e seções.
- `style.css`: Estilização premium, cores (Roxo/Preto/Branco) e animações.
- `script.js`: Lógica do formulário, integração WhatsApp e efeitos 3D (Tilt).

## 🛠️ Tecnologias
- HTML5 Semântico
- CSS3 Moderno (Variáveis, Flexbox, Grid, Glassmorphism)
- JavaScript Vanilla (Sem frameworks pesados)
- Ícones Lucide (via CDN)
