/**
 * ===================================
 * M&J ADVOCACIA - LANDING PAGE JS
 * Arquivo: script.js
 * ===================================
 */

'use strict';

/**
 * ===================================
 * CONFIGURAÇÕES E CONSTANTES
 * ===================================
 */

// Configuração do EmailJS (IMPORTANTE: Substitua pelas suas credenciais reais)
const EMAIL_CONFIG = {
    serviceId: 'service_alkwkwb',     // Substitua pelo seu Service ID
    templateId: 'template_ujyn9t9',   // Substitua pelo seu Template ID
    publicKey: 'ZQvl-ocLcCIgPo-nR'      // Substitua pela sua Public Key
};

// Configurações de validação
const VALIDATION_CONFIG = {
    minNameLength: 2,
    maxNameLength: 100,
    minMessageLength: 10,
    maxMessageLength: 1000,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\+]?[1-9][\d]{0,15}$/
};

// Configurações de animação
const ANIMATION_CONFIG = {
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    animationDelay: 100,
    toastDuration: 5000
};

// Configurações de segurança
const SECURITY_CONFIG = {
    maxSubmissionAttempts: 3,
    submissionCooldown: 60000, // 1 minuto
    maxToastMessages: 3
};

/**
 * ===================================
 * ESTADO GLOBAL DA APLICAÇÃO
 * ===================================
 */
const AppState = {
    isEmailJSInitialized: false,
    submissionAttempts: 0,
    lastSubmissionTime: 0,
    activeToasts: new Set(),
    animationObserver: null,
    isMobileMenuOpen: false,
    isFormSubmitting: false
};

/**
 * ===================================
 * UTILITÁRIOS E HELPERS
 * ===================================
 */

/**
 * Sanitização de entrada do usuário
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '') // Remove apenas os caracteres perigosos
        .substring(0, 1000);
};

/**
 * Debounce para otimização de performance
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle para eventos de scroll
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

/**
 * Logger para debugging
 */
const Logger = {
    debug: (message, data = null) => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`[M&J Debug] ${message}`, data || '');
        }
    },
    error: (message, error = null) => {
        console.error(`[M&J Error] ${message}`, error || '');
    }
};

/**
 * ===================================
 * SISTEMA DE ANIMAÇÕES
 * ===================================
 */

/**
 * Gerenciador de animações com Intersection Observer
 */
class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        if (window.innerWidth < 768) return;
        // Verificar se o usuário prefere movimento reduzido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.enableInstantAnimations();
            return;
        }

        this.setupObserver();
        this.observeElements();
    }

    setupObserver() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            ANIMATION_CONFIG.observerOptions
        );
        AppState.animationObserver = this.observer;
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                this.animateElement(entry.target);
                this.animatedElements.add(entry.target);
            }
        });
    }

    animateElement(element) {
        // Adicionar delay baseado na posição do elemento
        const delay = this.calculateDelay(element);
        
        setTimeout(() => {
            element.classList.add('animate');
            this.triggerCustomAnimation(element);
        }, delay);
    }

    calculateDelay(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementPosition = rect.top / windowHeight;
        return Math.max(0, elementPosition * ANIMATION_CONFIG.animationDelay);
    }

    triggerCustomAnimation(element) {
        // Animações especiais para elementos específicos
        if (element.classList.contains('hero-animation')) {
            this.animateHeroElement(element);
        } else if (element.classList.contains('valores-item')) {
            this.animateValueItem(element);
        }
    }

    animateHeroElement(element) {
        const siblings = element.parentElement.querySelectorAll('.hero-animation');
        const index = Array.from(siblings).indexOf(element);
        element.style.animationDelay = `${index * 0.2}s`;
    }

    animateValueItem(element) {
        const icon = element.querySelector('.value-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotate(360deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 600);
            }, 300);
        }
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll(`
            .fade-in-up,
            .hero-animation,
            .slide-in-left,
            .slide-in-right,
            .valores-item
        `);

        elementsToAnimate.forEach(element => {
            this.observer.observe(element);
        });

        Logger.debug('Animation Observer initialized', {
            elementsCount: elementsToAnimate.length
        });
    }

    enableInstantAnimations() {
        // Para usuários que preferem movimento reduzido
        const elements = document.querySelectorAll(`
            .fade-in-up,
            .hero-animation,
            .slide-in-left,
            .slide-in-right,
            .valores-item
        `);

        elements.forEach(element => {
            element.classList.add('animate');
        });

        Logger.debug('Instant animations enabled for accessibility');
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.animatedElements.clear();
    }
}

/**
 * ===================================
 * SISTEMA DE NAVEGAÇÃO
 * ===================================
 */

/**
 * Gerenciador de navegação e menu mobile
 */
class NavigationManager {
    constructor() {
        this.header = null;
        this.mobileMenuBtn = null;
        this.mobileMenu = null;
        this.navLinks = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.setupSmoothScroll();
    }

    bindElements() {
        this.header = document.querySelector('.header-dynamic');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .scroll-link');
    }

    bindEvents() {
        // Scroll do header
        window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
        
        // Menu mobile
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Links de navegação
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', this.handleOutsideClick.bind(this));

        // Tecla ESC para fechar menu
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleScroll() {
        if (!this.header) return;

        const scrollY = window.scrollY;
        
        // Adicionar classe quando rolar
        if (scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Fechar menu mobile ao rolar
        if (AppState.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    toggleMobileMenu() {
        if (AppState.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        AppState.isMobileMenuOpen = true;
        this.mobileMenuBtn?.classList.add('active');
        this.mobileMenu?.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        Logger.debug('Mobile menu opened');
    }

    closeMobileMenu() {
        AppState.isMobileMenuOpen = false;
        this.mobileMenuBtn?.classList.remove('active');
        this.mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
        
        Logger.debug('Mobile menu closed');
    }

    handleNavClick(event) {
        const href = event.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
                this.closeMobileMenu();
            }
        }
    }

    handleOutsideClick(event) {
        if (AppState.isMobileMenuOpen && 
            !this.mobileMenu?.contains(event.target) && 
            !this.mobileMenuBtn?.contains(event.target)) {
            this.closeMobileMenu();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Escape' && AppState.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    scrollToElement(element) {
    const headerHeight = this.header?.offsetHeight || 80;
    const targetY = element.offsetTop - headerHeight;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 800;
    let startTime = null;

    const easeInOutQuad = (t) => t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;

    const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const timeElapsed = timestamp - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        window.scrollTo(0, startY + distance * easedProgress);
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
}


    setupSmoothScroll() {
        // Polyfill para navegadores que não suportam scroll behavior smooth
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.loadSmoothScrollPolyfill();
        }
    }

    loadSmoothScrollPolyfill() {
        // Implementação básica de smooth scroll para navegadores antigos
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js';
        script.onload = () => {
            Logger.debug('Smooth scroll polyfill loaded');
        };
        document.head.appendChild(script);
    }
}

/**
 * ===================================
 * SISTEMA DE FORMULÁRIO
 * ===================================
 */

/**
 * Validador de formulário
 */
class FormValidator {
    constructor() {
        this.errors = new Map();
    }

    validateName(name) {
        const sanitized = sanitizeInput(name);
        
        if (!sanitized) {
            return 'Nome é obrigatório';
        }
        
        if (sanitized.length < VALIDATION_CONFIG.minNameLength) {
            return `Nome deve ter pelo menos ${VALIDATION_CONFIG.minNameLength} caracteres`;
        }
        
        if (sanitized.length > VALIDATION_CONFIG.maxNameLength) {
            return `Nome deve ter no máximo ${VALIDATION_CONFIG.maxNameLength} caracteres`;
        }
        
        return null;
    }

    validateEmail(email) {
        const sanitized = sanitizeInput(email);
        
        if (!sanitized) {
            return 'E-mail é obrigatório';
        }
        
        if (!VALIDATION_CONFIG.emailRegex.test(sanitized)) {
            return 'E-mail deve ter um formato válido';
        }
        
        return null;
    }

    validatePhone(phone) {
        if (!phone) return null; // Telefone é opcional
        
        const sanitized = sanitizeInput(phone).replace(/\D/g, '');
        
        if (sanitized && !VALIDATION_CONFIG.phoneRegex.test(sanitized)) {
            return 'Telefone deve ter um formato válido';
        }
        
        return null;
    }

    validateSubject(subject) {
        const sanitized = sanitizeInput(subject);
        
        if (!sanitized) {
            return 'Assunto é obrigatório';
        }
        
        return null;
    }

    validateMessage(message) {
        const sanitized = sanitizeInput(message);
        
        if (!sanitized) {
            return 'Mensagem é obrigatória';
        }
        
        if (sanitized.length < VALIDATION_CONFIG.minMessageLength) {
            return `Mensagem deve ter pelo menos ${VALIDATION_CONFIG.minMessageLength} caracteres`;
        }
        
        if (sanitized.length > VALIDATION_CONFIG.maxMessageLength) {
            return `Mensagem deve ter no máximo ${VALIDATION_CONFIG.maxMessageLength} caracteres`;
        }
        
        return null;
    }

    validateField(fieldName, value) {
        let error = null;
        
        switch (fieldName) {
            case 'name':
                error = this.validateName(value);
                break;
            case 'email':
                error = this.validateEmail(value);
                break;
            case 'phone':
                error = this.validatePhone(value);
                break;
            case 'subject':
                error = this.validateSubject(value);
                break;
            case 'message':
                error = this.validateMessage(value);
                break;
            default:
                Logger.error('Unknown field name for validation:', fieldName);
        }
        
        if (error) {
            this.errors.set(fieldName, error);
        } else {
            this.errors.delete(fieldName);
        }
        
        return error;
    }

    isValid() {
        return this.errors.size === 0;
    }

    getErrors() {
        return new Map(this.errors);
    }

    clearErrors() {
        this.errors.clear();
    }
}

/**
 * Gerenciador do formulário de contato
 */
class ContactFormManager {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.validator = new FormValidator();
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.initializeEmailJS();
    }

    bindElements() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
    }

    bindEvents() {
        if (!this.form) return;

        // Submit do formulário
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Validação em tempo real
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', debounce(() => this.validateField(input), 300));
        });
    }

    async initializeEmailJS() {
        try {
            if (typeof emailjs === 'undefined') {
                Logger.error('EmailJS library not loaded');
                return;
            }

            emailjs.init(EMAIL_CONFIG.publicKey);
            AppState.isEmailJSInitialized = true;
            Logger.debug('EmailJS initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize EmailJS:', error);
            AppState.isEmailJSInitialized = false;
        }
    }

    validateField(input) {
        const fieldName = input.name;
        const value = input.value;
        const error = this.validator.validateField(fieldName, value);
        
        this.displayFieldError(input, error);
        this.updateFieldVisualState(input, error);
        
        return !error;
    }

    displayFieldError(input, error) {
        const errorElement = document.getElementById(`${input.name}-error`);
        
        if (errorElement) {
            errorElement.textContent = error || '';
            errorElement.classList.toggle('show', !!error);
        }
    }

    updateFieldVisualState(input, error) {
        input.classList.remove('error', 'success');
        
        if (input.value.trim()) {
            input.classList.add(error ? 'error' : 'success');
        }
        
        // Animação de shake para erros
        if (error) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (AppState.isFormSubmitting) {
            return;
        }

        // Verificar limite de tentativas
        if (!this.checkSubmissionLimits()) {
            return;
        }

        // Validar formulário completo
        if (!this.validateForm()) {
            ToastManager.show('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        await this.submitForm();
    }

    checkSubmissionLimits() {
        const now = Date.now();
        const timeSinceLastSubmission = now - AppState.lastSubmissionTime;
        
        if (AppState.submissionAttempts >= SECURITY_CONFIG.maxSubmissionAttempts && 
            timeSinceLastSubmission < SECURITY_CONFIG.submissionCooldown) {
            const remainingTime = Math.ceil((SECURITY_CONFIG.submissionCooldown - timeSinceLastSubmission) / 1000);
            ToastManager.show(
                `Muitas tentativas. Tente novamente em ${remainingTime} segundos`, 
                'warning'
            );
            return false;
        }
        
        if (timeSinceLastSubmission > SECURITY_CONFIG.submissionCooldown) {
            AppState.submissionAttempts = 0;
        }
        
        return true;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid && this.validator.isValid();
    }

    async submitForm() {
        AppState.isFormSubmitting = true;
        AppState.submissionAttempts++;
        AppState.lastSubmissionTime = Date.now();
        
        this.setSubmitButtonLoading(true);
        
        try {
            const formData = this.getFormData();
            
            if (!AppState.isEmailJSInitialized) {
                throw new Error('EmailJS não está inicializado');
            }
            
            await this.sendEmail(formData);
            this.handleSubmitSuccess();
            
        } catch (error) {
            this.handleSubmitError(error);
        } finally {
            AppState.isFormSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = sanitizeInput(value);
        }
        
        // Adicionar informações extras
        data.timestamp = new Date().toLocaleString('pt-BR');
        data.userAgent = navigator.userAgent;
        
        return data;
    }

    async sendEmail(data) {
        const templateParams = {
            nome: data.name,
            email: data.email,
            telefone: data.phone,
            assunto: data.subject,
            mensagem: data.message,
            data: data.timestamp
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
        );

        Logger.debug('Email sent successfully:', response);
        return response;
    }

    handleSubmitSuccess() {
        ToastManager.show(
            'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'success'
        );
        
        this.form.reset();
        this.clearFieldStates();
        this.validator.clearErrors();
        
        // Reset submission attempts on success
        AppState.submissionAttempts = 0;
        
        Logger.debug('Form submitted successfully');
    }

    handleSubmitError(error) {
        Logger.error('Form submission error:', error);
        
        let errorMessage = 'Ocorreu um erro ao enviar a mensagem. ';
        
        if (error.message.includes('EmailJS')) {
            errorMessage += 'Serviço de email temporariamente indisponível.';
        } else if (error.status === 400) {
            errorMessage += 'Dados do formulário inválidos.';
        } else if (error.status >= 500) {
            errorMessage += 'Erro no servidor. Tente novamente mais tarde.';
        } else {
            errorMessage += 'Tente novamente ou entre em contato por telefone.';
        }
        
        ToastManager.show(errorMessage, 'error');
    }

    setSubmitButtonLoading(isLoading) {
        if (!this.submitBtn) return;
        
        const icon = this.submitBtn.querySelector('i');
        const text = this.submitBtn.querySelector('span') || this.submitBtn;
        
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin mr-2';
            }
            text.textContent = 'Enviando...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            if (icon) {
                icon.className = 'fas fa-paper-plane mr-2';
            }
            text.textContent = 'Enviar Mensagem';
        }
    }

    clearFieldStates() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
    }

}

/**
 * ===================================
 * SISTEMA DE NOTIFICAÇÕES TOAST
 * ===================================
 */

/**
 * Gerenciador de notificações toast
 */
class ToastManager {
    static show(message, type = 'info', duration = ANIMATION_CONFIG.toastDuration) {
        if (AppState.activeToasts.size >= SECURITY_CONFIG.maxToastMessages) {
            return;
        }

        const toast = this.createToast(message, type);
        this.displayToast(toast, duration);
    }

    static createToast(message, type) {
        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast = document.createElement('div');
        
        toast.id = toastId;
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const titleMap = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Atenção',
            info: 'Informação'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <i class="${iconMap[type]} mr-2"></i>
                <span class="toast-title">${titleMap[type]}</span>
                <button class="toast-close" aria-label="Fechar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${sanitizeInput(message)}</div>
        `;
        
        // Event listener para fechar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toastId));
        
        return toast;
    }

    static displayToast(toast, duration) {
        const container = this.getToastContainer();
        container.appendChild(toast);
        
        AppState.activeToasts.add(toast.id);
        
        // Animar entrada
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto-remover após duração especificada
        setTimeout(() => {
            this.removeToast(toast.id);
        }, duration);
        
        Logger.debug('Toast displayed:', { id: toast.id, type: toast.className });
    }

    static removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (!toast) return;
        
        toast.classList.remove('show');
        AppState.activeToasts.delete(toastId);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
        
        Logger.debug('Toast removed:', toastId);
    }

    static getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    static clearAll() {
        const container = this.getToastContainer();
        container.innerHTML = '';
        AppState.activeToasts.clear();
    }
}

/**
 * ===================================
 * SISTEMA DE MAPAS
 * ===================================
 */

/**
 * Gerenciador do Google Maps
 */
class MapManager {
    constructor() {
        this.mapElement = null;
        this.loadingElement = null;
        this.init();
    }

    init() {
        this.mapElement = document.getElementById('google-map');
        this.loadingElement = document.getElementById('map-loading');
        
        if (this.mapElement) {
            this.setupMapEvents();
        }
    }

    setupMapEvents() {
        // Adicionar eventos globais para o iframe do mapa
        window.handleMapLoad = this.handleMapLoad.bind(this);
        window.handleMapError = this.handleMapError.bind(this);
        
        // Timeout para loading
        setTimeout(() => {
            if (this.loadingElement && this.loadingElement.style.display !== 'none') {
                this.handleMapError(new Error('Timeout'));
            }
        }, 10000);
    }

    handleMapLoad() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        
        if (this.mapElement) {
            this.mapElement.classList.add('loaded');
            this.mapElement.style.opacity = '1';
        }
        
        Logger.debug('Google Maps loaded successfully');
    }

    handleMapError(error) {
        Logger.error('Google Maps loading error:', error);
        
        if (this.loadingElement) {
            this.loadingElement.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: var(--color-warning);"></i>
                <p>Não foi possível carregar o mapa</p>
                <button onclick="location.reload()" class="btn-primary mt-4">
                    Tentar Novamente
                </button>
            `;
        }
    }
}

/**
 * ===================================
 * SISTEMA DE PERFORMANCE
 * ===================================
 */

/**
 * Monitor de performance
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.measurePaintMetrics();
        this.setupLazyLoading();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            
            Logger.debug('Page load time:', `${loadTime}ms`);
        });

        document.addEventListener('DOMContentLoaded', () => {
            const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            this.metrics.domContentLoaded = domTime;
            
            Logger.debug('DOM content loaded time:', `${domTime}ms`);
        });
    }

    measurePaintMetrics() {
        if ('getEntriesByType' in performance) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    } else if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                });
                
                Logger.debug('Paint metrics:', this.metrics);
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    setupLazyLoading() {
        // Lazy loading para imagens
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sem suporte
            images.forEach(img => img.classList.add('loaded'));
        }
    }

    getMetrics() {
        return { ...this.metrics };
    }
}

/**
 * ===================================
 * SISTEMA DE ACESSIBILIDADE
 * ===================================
 */

/**
 * Gerenciador de acessibilidade
 */
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIAUpdates();
        this.detectReducedMotion();
    }

    setupKeyboardNavigation() {
        // Navegação por Tab mais intuitiva
        const focusableElements = document.querySelectorAll(`
            a[href],
            button:not([disabled]),
            input:not([disabled]),
            select:not([disabled]),
            textarea:not([disabled]),
            [tabindex]:not([tabindex="-1"])
        `);

        focusableElements.forEach((element, index) => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e, focusableElements, index);
                }
            });
        });
    }

    handleTabNavigation(event, elements, currentIndex) {
        const isShiftTab = event.shiftKey;
        const isLastElement = currentIndex === elements.length - 1;
        const isFirstElement = currentIndex === 0;

        if (isShiftTab && isFirstElement) {
            event.preventDefault();
            elements[elements.length - 1].focus();
        } else if (!isShiftTab && isLastElement) {
            event.preventDefault();
            elements[0].focus();
        }
    }

    setupFocusManagement() {
        // Melhorar visibilidade do foco
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('click', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupARIAUpdates() {
        // Atualizar ARIA labels dinamicamente
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', () => {
                form.setAttribute('aria-busy', 'true');
                form.setAttribute('aria-describedby', 'form-status');
            });
        }
    }

    detectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
            Logger.debug('Reduced motion preference detected');
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

/**
 * ===================================
 * SISTEMA DE SEGURANÇA
 * ===================================
 */

/**
 * Gerenciador de segurança
 */
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSPViolationHandling();
        this.setupInputSanitization();
        this.setupRateLimiting();
        this.detectBotBehavior();
    }

    setupCSPViolationHandling() {
        document.addEventListener('securitypolicyviolation', (e) => {
            Logger.error('CSP Violation:', {
                violatedDirective: e.violatedDirective,
                blockedURI: e.blockedURI,
                originalPolicy: e.originalPolicy
            });
        });
    }

    setupRateLimiting() {
        // Rate limiting básico para ações sensíveis
        const actions = new Map();
        const RATE_LIMIT = 5; // 5 ações por minuto
        const TIME_WINDOW = 60000; // 1 minuto

        window.addEventListener('click', (e) => {
            if (e.target.matches('button[type="submit"], .btn-primary')) {
                const now = Date.now();
                const actionKey = 'form_submit';
                
                if (!actions.has(actionKey)) {
                    actions.set(actionKey, []);
                }
                
                const timestamps = actions.get(actionKey);
                const recentActions = timestamps.filter(time => now - time < TIME_WINDOW);
                
                if (recentActions.length >= RATE_LIMIT) {
                    e.preventDefault();
                    ToastManager.show('Muitas ações realizadas. Aguarde um momento.', 'warning');
                    return false;
                }
                
                recentActions.push(now);
                actions.set(actionKey, recentActions);
            }
        });
    }

    detectBotBehavior() {
        // Detecção básica de comportamento de bot
        let mouseMovements = 0;
        let keystrokes = 0;
        
        document.addEventListener('mousemove', () => {
            mouseMovements++;
        });
        
        document.addEventListener('keydown', () => {
            keystrokes++;
        });
        
        // Verificar após 30 segundos
        setTimeout(() => {
            if (mouseMovements === 0 && keystrokes === 0) {
                Logger.debug('Possible bot behavior detected');
                // Não bloquear, apenas logar
            }
        }, 30000);
    }

    validateOrigin(expectedOrigin) {
        return window.location.origin === expectedOrigin;
    }

    generateCSRFToken() {
        // Geração simples de token CSRF
        return btoa(Date.now() + Math.random().toString()).substr(0, 32);
    }
}

/**
 * ===================================
 * INICIALIZAÇÃO PRINCIPAL
 * ===================================
 */

/**
 * Classe principal da aplicação
 */
class MJAdvocaciaApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) {
            Logger.debug('App already initialized');
            return;
        }

        try {
            Logger.debug('Initializing M&J Advocacia App...');
            
            // Aguardar DOM estar pronto
            await this.waitForDOM();
            
            // Inicializar componentes na ordem correta
            this.initializeComponents();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            Logger.debug('M&J Advocacia App initialized successfully');
            
            // Anunciar para screen readers
            if (this.components.has('accessibility')) {
                this.components.get('accessibility').announceToScreenReader(
                    'Página carregada. Site do escritório M&J Advocacia.'
                );
            }
            
        } catch (error) {
            Logger.error('Failed to initialize app:', error);
            this.handleInitializationError(error);
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    initializeComponents() {
        // Ordem de inicialização é importante
        const componentsToInit = [
            { name: 'security', class: SecurityManager },
            { name: 'performance', class: PerformanceMonitor },
            { name: 'accessibility', class: AccessibilityManager },
            { name: 'navigation', class: NavigationManager },
            { name: 'animation', class: AnimationManager },
            { name: 'contactForm', class: ContactFormManager },
            { name: 'map', class: MapManager }
        ];

        componentsToInit.forEach(({ name, class: ComponentClass }) => {
            try {
                const component = new ComponentClass();
                this.components.set(name, component);
                Logger.debug(`${name} component initialized`);
            } catch (error) {
                Logger.error(`Failed to initialize ${name} component:`, error);
            }
        });
    }

    handleInitializationError(error) {
        // Fallback gracioso em caso de erro
        document.body.classList.add('app-error');
        
        // Remover animações para evitar problemas
        const animatedElements = document.querySelectorAll(`
            .fade-in-up,
            .hero-animation,
            .slide-in-left,
            .slide-in-right,
            .valores-item
        `);
        
        animatedElements.forEach(element => {
            element.classList.add('animate');
        });
        
        Logger.error('App initialization error handled');
    }

    getComponent(name) {
        return this.components.get(name);
    }

    destroy() {
        // Limpeza de recursos
        this.components.forEach((component, name) => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components.clear();
        this.isInitialized = false;
        
        Logger.debug('App destroyed');
    }
}

/**
 * ===================================
 * EXPOSIÇÃO GLOBAL E INICIALIZAÇÃO
 * ===================================
 */

// Criar instância global da aplicação
window.MJApp = new MJAdvocaciaApp();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.MJApp.init();
});

// Limpeza ao sair da página
window.addEventListener('beforeunload', () => {
    window.MJApp.destroy();
});

// Expor utilidades globais para debugging (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.MJDebug = {
        AppState,
        Logger,
        ToastManager,
        showTestToast: () => ToastManager.show('Toast de teste!', 'info'),
        getPerformanceMetrics: () => window.MJApp.getComponent('performance')?.getMetrics(),
        triggerAnimation: (selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.classList.add('animate'));
        }
    };
}

/**
 * ===================================
 * POLYFILLS E COMPATIBILIDADE
 * ===================================
 */

// Polyfill para Object.assign (IE11)
if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        const to = Object(target);
        for (let index = 1; index < arguments.length; index++) {
            const nextSource = arguments[index];
            if (nextSource != null) {
                for (const nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// Polyfill para Array.from (IE11)
if (!Array.from) {
    Array.from = function(arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    };
}

// Service Worker registration (para futuras melhorias PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker será implementado em versões futuras
        Logger.debug('Service Worker support detected');
    });
}

/**
 * ===================================
 * FIM DO ARQUIVO
 * Desenvolvido para M&J Advocacia
 * ===================================
 */