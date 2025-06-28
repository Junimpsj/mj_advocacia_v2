# 🏛️ M&J Advocacia - Landing Page

Uma landing page moderna e responsiva para o escritório de advocacia M&J Advocacia, especializado em Direito Familiar e Previdenciário, localizado em Macedônia - SP.

![M&J Advocacia](https://img.shields.io/badge/Status-InDevelopment-success?style=for-the-badge)
![Versão](https://img.shields.io/badge/Versão-2.0-blue?style=for-the-badge)
![Licença](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)

## 📋 Sobre o Projeto

Esta landing page foi desenvolvida para apresentar os serviços do escritório M&J Advocacia, fundado pelas advogadas **Amanda Machado** e **Jéssica Juste**. O site oferece uma experiência elegante e profissional, transmitindo confiança e acolhimento aos clientes através de um design moderno e funcionalidades avançadas.

### 🎯 Objetivo

Criar uma presença digital forte para captar novos clientes e fortalecer a marca do escritório, focando no atendimento humanizado e na expertise técnica em Direito Familiar e Previdenciário.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **HTML5** | - | Estrutura semântica e acessível |
| **CSS3** | - | Estilos customizados com variáveis CSS |
| **JavaScript (ES6+)** | - | Funcionalidades interativas e validações |
| **TailwindCSS** | 3.x | Framework CSS utilitário |
| **EmailJS** | 4.x | Serviço de envio de emails |
| **Font Awesome** | 6.4.0 | Biblioteca de ícones vetoriais |
| **Google Fonts** | - | Tipografia (Playfair Display + Mulish) |
| **Google Maps** | - | Mapa interativo da localização |

## 🎨 Design System

### Paleta de Cores
```css
:root {
  --color-primary: #A67B5B;        /* Marrom médio - Botões e títulos */
  --color-secondary: #7FA987;      /* Verde esmeralda - Realces e hovers */
  --color-background: #F5F0E6;     /* Bege claro - Fundo predominante */
  --color-light: #FAFAFA;          /* Branco suave - Seções alternadas */
  --color-text-primary: #444444;   /* Cinza escuro - Textos principais */
}
```

### Tipografia
- **Títulos**: Playfair Display (Serif elegante)
- **Corpo**: Mulish (Sans-serif moderna)

## 📁 Estrutura do Projeto

```
mj-advocacia/
├── index.html              # Página principal
├── style.css               # Estilos CSS com variáveis organizadas
├── script.js               # JavaScript modular e funcional
├── README.md               # Documentação do projeto
└── assets/                 # Recursos estáticos
    ├── images/
    └── icons/
        └── title-icon.ico  # Favicon personalizado
```

## 🚀 Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para CDNs e EmailJS)
- Servidor local (opcional, mas recomendado)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone https://github.com/seu-usuario/mj-advocacia.git
   cd mj-advocacia
   ```

2. **Abra o projeto**
   
   **Opção 1: Direto no navegador**
   ```
   Abra o arquivo index.html no seu navegador
   ```
   
   **Opção 2: Servidor local (recomendado)**
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js
   npx http-server
   
   # Com PHP
   php -S localhost:8000
   
   # Com VS Code Live Server
   # Instale a extensão Live Server e clique em "Go Live"
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

## ⚙️ Configuração

### 📧 EmailJS (Obrigatório)

Para ativar o formulário de contato funcional:

1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email
3. Crie um template de email
4. Atualize as credenciais no arquivo `script.js`:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'SEU_SERVICE_ID',     // Seu Service ID
    templateId: 'SEU_TEMPLATE_ID',   // Seu Template ID
    publicKey: 'SUA_PUBLIC_KEY'      // Sua Public Key
};
```

### 🗺️ Google Maps

Atualize as coordenadas no `index.html` para a localização real:

```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d[SUAS_COORDENADAS]">
```

### 🎨 Personalização de Cores

Modifique as variáveis CSS no arquivo `style.css`:

```css
:root {
  --color-primary: #SUA_COR_PRIMARIA;
  --color-secondary: #SUA_COR_SECUNDARIA;
  --color-background: #SUA_COR_DE_FUNDO;
}
```

## 📋 Seções da Landing Page

### 🏠 Header Fixo
- Logo do escritório
- Menu de navegação responsivo
- Menu mobile com animações
- Backdrop blur dinâmico

### 🌟 Hero Section
- Apresentação principal com gradiente sobre imagem de fundo
- Frase de impacto com tipografia destacada
- Botões de call-to-action animados

### 💼 Serviços
- **Direito Familiar**: Inventários, separações, pensão alimentícia, guarda, união estável, adoção
- **Direito Previdenciário**: Aposentadorias, revisões, auxílios, pensão por morte, BPC/LOAS
- Cards interativos com hover effects

### 👥 Quem Somos
- Perfis das sócias fundadoras (Amanda Machado e Jéssica Juste)
- Valores do escritório: Humanização, Ética, Excelência
- Animações suaves de entrada

### 📞 Contatos
- Formulário funcional com validação em tempo real
- Integração com EmailJS para envio real
- Informações de contato (WhatsApp, e-mail, telefone)
- Links para redes sociais
- Sistema de notificações toast

### 📍 Localização
- Endereço do escritório em Macedônia - SP
- Horário de funcionamento
- Google Maps integrado
- Informações de atendimento

### 🦶 Footer
- Links de navegação rápida
- Informações de contato resumidas
- Copyright e créditos dos desenvolvedores

## ⚡ Funcionalidades Técnicas

### 🎭 Sistema de Animações
- **Intersection Observer** para animações ao scroll
- **GPU Acceleration** para performance otimizada
- **Prefers-reduced-motion** para acessibilidade
- Animações personalizadas: `fade-in-up`, `slide-in-left/right`, `hero-animation`

### 📝 Formulário Inteligente
- **Validação em tempo real** com feedback visual
- **Sanitização de entrada** para segurança
- **Rate limiting** para prevenção de spam
- **Estados visuais**: error, success, loading
- **EmailJS integration** para envio real

### 📱 Menu Mobile Avançado
- Animação hamburger suave
- Backdrop para fechar ao clicar fora
- Animações escalonadas dos links
- Suporte a gestos e teclado (ESC)

### 🔔 Sistema de Notificações
- **Toast notifications** elegantes
- Tipos: success, error, warning, info
- Auto-dismiss configurável
- Limite de toasts simultâneos

### 🚀 Performance & SEO
- **Lazy loading** para recursos
- **Meta tags** otimizadas
- **Estrutura semântica** HTML5
- **Responsive design** mobile-first

## 📱 Responsividade

| Dispositivo | Breakpoint | Características |
|-------------|------------|-----------------|
| **Mobile** | < 480px | Layout single-column, botões full-width |
| **Tablet** | 481px - 768px | Grid adaptado, espaçamentos ajustados |
| **Desktop** | > 768px | Layout completo, animações avançadas |

## ♿ Acessibilidade

- ✅ **Navegação por teclado** completa
- ✅ **Screen reader** support com ARIA labels
- ✅ **Contraste adequado** (WCAG 2.1)
- ✅ **Prefers-reduced-motion** support
- ✅ **Focus states** visíveis
- ✅ **Estrutura semântica** HTML5

## 🔒 Segurança

- ✅ **Sanitização** de entrada do usuário
- ✅ **Rate limiting** básico
- ✅ **CSP violation** handling
- ✅ **Input validation** multicamada
- ✅ **XSS protection** básica

## 🐛 Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| **Formulário não envia** | Verificar credenciais EmailJS no `script.js` |
| **Animações não funcionam** | Verificar se JavaScript está habilitado |
| **Menu mobile não abre** | Verificar console para erros e FontAwesome |
| **Mapa não carrega** | Verificar conexão e URL do Google Maps |

### Debug Mode

Para debugging, abra o console e use:

```javascript
// Verificar status dos componentes
window.MJDebug.showTestToast();

// Ver métricas de performance
window.MJDebug.getPerformanceMetrics();

// Forçar animações
window.MJDebug.triggerAnimation('.fade-in-up');
```

## 📊 Métricas de Performance

| Métrica | Meta | Status |
|---------|------|--------|
| **First Contentful Paint** | < 2s | ✅ |
| **Largest Contentful Paint** | < 3s | ✅ |
| **Time to Interactive** | < 4s | ✅ |
| **Cumulative Layout Shift** | < 0.1 | ✅ |

## 🔄 Roadmap Futuro

- [ ] **PWA Support** com Service Worker
- [ ] **Dark Mode** opcional
- [ ] **Multilingual** (EN/ES)
- [ ] **Portal do Cliente** com login
- [ ] **Agendamento Online** de consultas
- [ ] **Chat Widget** integrado
- [ ] **Analytics** integrado

## 👥 Equipe

### 🏛️ Cliente
- **M&J Advocacia**
- **Amanda Machado** - Sócia Fundadora (Direito Familiar)
- **Jéssica Juste** - Sócia Fundadora (Direito Previdenciário)

### 💻 Desenvolvimento
- **Laís Isabella Santos Sousa** - Desenvolvedor Frontend
- **Paulo Celso dos Santos Júnior** - Desenvolvedor Frontend

### 📅 Timeline
- **Projeto:** Janeiro 2025
- **Versão:** 2.0
- **Status:** Em desenvolvimento 🔄

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**🚀 Desenvolvido com dedicação para M&J Advocacia**

*"Direito com Propósito, Advocacia com Coração"*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)]()
[![EmailJS](https://img.shields.io/badge/EmailJS-0066CC?style=flat-square&logo=emailjs&logoColor=white)]()

**Feito em 🇧🇷 por desenvolvedores brasileiros**

</div>