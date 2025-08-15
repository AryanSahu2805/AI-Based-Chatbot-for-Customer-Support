/**
 * Enhanced AI Customer Support Chatbot - Frontend JavaScript (2025)
 * Handles real-time chat, API communication, UI interactions, and modern features
 * Features: Theme switching, smart suggestions, sentiment analysis, entity extraction
 */

class EnhancedChatbotUI {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
        this.analyticsData = {};
        this.currentTheme = 'light';
        this.settings = this.loadSettings();
        
        this.initializeElements();
        this.bindEvents();
        this.initializeTheme();
        this.loadAnalytics();
        this.setupAutoRefresh();
        this.setupAccessibility();
    }
    
    initializeElements() {
        // Core elements
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.typingIndicatorFull = document.getElementById('typingIndicatorFull');
        this.charCount = document.getElementById('charCount');
        
        // Enhanced elements
        this.themeToggle = document.getElementById('themeToggle');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.smartSuggestions = document.getElementById('smartSuggestions');
        this.suggestionChips = document.getElementById('suggestionChips');
        
        // Analytics elements
        this.totalQueries = document.getElementById('totalQueries');
        this.avgResponseTime = document.getElementById('avgResponseTime');
        this.performanceGain = document.getElementById('performanceGain');
        this.uptime = document.getElementById('uptime');
        this.sentimentChart = document.getElementById('sentimentChart');
        this.intentChart = document.getElementById('intentChart');
        
        // Settings elements
        this.themeSelect = document.getElementById('themeSelect');
        this.fontSizeSelect = document.getElementById('fontSizeSelect');
        this.notificationsToggle = document.getElementById('notificationsToggle');
        this.accessibilityMode = document.getElementById('accessibilityMode');
    }
    
    bindEvents() {
        // Send message on Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character count update
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
        });
        
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Settings
        this.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });
        
        // Settings changes
        this.themeSelect.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        this.fontSizeSelect.addEventListener('change', (e) => {
            this.changeFontSize(e.target.value);
        });
        
        this.notificationsToggle.addEventListener('change', (e) => {
            this.toggleNotifications(e.target.checked);
        });
        
        this.accessibilityMode.addEventListener('change', (e) => {
            this.toggleAccessibilityMode(e.target.checked);
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        this.messageInput.focus();
                        break;
                    case 's':
                        e.preventDefault();
                        this.openSettings();
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }
    
    initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('chatbot-theme') || 'auto';
        this.changeTheme(savedTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    changeTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('chatbot-theme', theme);
        
        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(isDark ? 'dark' : 'light');
        } else {
            this.applyTheme(theme);
        }
        
        // Update theme toggle icon
        this.updateThemeIcon();
        
        // Update select value
        if (this.themeSelect) {
            this.themeSelect.value = theme;
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.changeTheme(newTheme);
    }
    
    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    changeFontSize(size) {
        document.documentElement.style.fontSize = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        }[size];
        
        localStorage.setItem('chatbot-font-size', size);
    }
    
    toggleNotifications(enabled) {
        localStorage.setItem('chatbot-notifications', enabled);
        
        if (enabled && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    toggleAccessibilityMode(enabled) {
        localStorage.setItem('chatbot-accessibility', enabled);
        document.body.classList.toggle('accessibility-mode', enabled);
        
        if (enabled) {
            this.showNotification('Accessibility mode enabled', 'info');
        }
    }
    
    openSettings() {
        this.settingsModal.style.display = 'block';
        this.loadSettingsIntoForm();
    }
    
    closeSettings() {
        this.settingsModal.style.display = 'none';
    }
    
    loadSettingsIntoForm() {
        // Load current settings into form
        this.themeSelect.value = this.currentTheme;
        this.fontSizeSelect.value = localStorage.getItem('chatbot-font-size') || 'medium';
        this.notificationsToggle.checked = localStorage.getItem('chatbot-notifications') !== 'false';
        this.accessibilityMode.checked = localStorage.getItem('chatbot-accessibility') === 'true';
    }
    
    loadSettings() {
        return {
            theme: localStorage.getItem('chatbot-theme') || 'auto',
            fontSize: localStorage.getItem('chatbot-font-size') || 'medium',
            notifications: localStorage.getItem('chatbot-notifications') !== 'false',
            accessibility: localStorage.getItem('chatbot-accessibility') === 'true'
        };
    }
    
    updateCharCount() {
        const currentLength = this.messageInput.value.length;
        const maxLength = this.messageInput.maxLength;
        this.charCount.textContent = `${currentLength}/${maxLength}`;
        
        // Change color based on length
        if (currentLength > maxLength * 0.8) {
            this.charCount.style.color = 'var(--error-color)';
        } else if (currentLength > maxLength * 0.6) {
            this.charCount.style.color = 'var(--warning-color)';
        } else {
            this.charCount.style.color = 'var(--text-color)';
            this.charCount.style.opacity = '0.7';
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        
        // Hide smart suggestions
        this.hideSmartSuggestions();
        
        // Show enhanced typing indicator
        this.showTypingIndicator();
        
        try {
            // Prepare conversation context
            const context = this.conversationHistory.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
            
            // Send to API
            const response = await this.sendToAPI(message, context);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            if (response.response) {
                this.addMessage(response.response, 'bot', response);
                
                // Show smart suggestions if available
                if (response.suggestions && response.suggestions.length > 0) {
                    this.showSmartSuggestions(response.suggestions);
                }
            } else {
                this.addMessage('I apologize, but I encountered an error. Please try again.', 'bot');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I encountered a technical issue. Please try again in a moment.', 'bot');
        }
    }
    
    sendQuickMessage(message) {
        this.messageInput.value = message;
        this.sendMessage();
    }
    
    async sendToAPI(message, context) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: context
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    addMessage(text, type, metadata = {}) {
        // Hide welcome section on first message
        if (this.welcomeSection.style.display !== 'none') {
            this.welcomeSection.style.display = 'none';
            this.chatMessages.style.display = 'block';
        }
        
        // Create enhanced message element
        const messageElement = this.createEnhancedMessageElement(text, type, metadata);
        
        // Add to container
        this.messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Store in history
        this.conversationHistory.push({
            text: text,
            type: type,
            timestamp: new Date(),
            metadata: metadata
        });
        
        // Keep only last 100 messages in memory
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-100);
        }
        
        // Update analytics if it's a bot response
        if (type === 'bot' && metadata.response_time) {
            this.updateResponseTimeAnalytics(metadata.response_time);
        }
        
        // Show notification if enabled
        if (type === 'bot' && this.settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('AI Response', {
                body: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                icon: '/static/favicon.ico'
            });
        }
    }
    
    createEnhancedMessageElement(text, type, metadata) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Enhanced message text with entity highlighting
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        if (metadata.entities && metadata.entities.length > 0) {
            messageText.innerHTML = this.highlightEntities(text, metadata.entities);
        } else {
            messageText.textContent = text;
        }
        
        const meta = document.createElement('div');
        meta.className = 'message-meta';
        
        const time = document.createElement('span');
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        meta.appendChild(time);
        
        // Add sentiment indicator if available
        if (metadata.sentiment && metadata.sentiment !== 'neutral') {
            const sentiment = document.createElement('span');
            const sentimentIcon = metadata.sentiment === 'positive' ? '😊' : '😔';
            sentiment.innerHTML = ` ${sentimentIcon}`;
            sentiment.style.fontSize = '0.9rem';
            meta.appendChild(sentiment);
        }
        
        // Add intent if available
        if (metadata.intent && metadata.intent !== 'general_inquiry') {
            const intent = document.createElement('span');
            intent.textContent = ` • ${metadata.intent.replace('_', ' ')}`;
            intent.style.fontStyle = 'italic';
            intent.style.opacity = '0.8';
            meta.appendChild(intent);
        }
        
        // Add response time if available
        if (metadata.response_time) {
            const responseTime = document.createElement('span');
            responseTime.textContent = ` • ${(metadata.response_time * 1000).toFixed(0)}ms`;
            responseTime.style.fontSize = '0.75rem';
            responseTime.style.opacity = '0.7';
            meta.appendChild(responseTime);
        }
        
        content.appendChild(messageText);
        content.appendChild(meta);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        return messageDiv;
    }
    
    highlightEntities(text, entities) {
        let highlightedText = text;
        
        // Sort entities by position to avoid conflicts
        entities.sort((a, b) => {
            const aPos = highlightedText.toLowerCase().indexOf(a.text.toLowerCase());
            const bPos = highlightedText.toLowerCase().indexOf(b.text.toLowerCase());
            return aPos - bPos;
        });
        
        // Highlight entities with different colors based on type
        entities.forEach(entity => {
            const regex = new RegExp(`(${entity.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const color = this.getEntityColor(entity.type);
            highlightedText = highlightedText.replace(regex, `<span class="entity-highlight" style="background: ${color}; padding: 2px 4px; border-radius: 4px; font-weight: 500;">$1</span>`);
        });
        
        return highlightedText;
    }
    
    getEntityColor(entityType) {
        const colors = {
            'email': 'var(--fresh-peach)',
            'phone': 'var(--electric-blue)',
            'order_number': 'var(--zesty-lemon)',
            'account_number': 'var(--sage-green)',
            'url': 'var(--iris-garden)',
            'product_name': 'var(--coral-accent)',
            'error_code': 'var(--error-color)',
            'version_number': 'var(--info-color)'
        };
        
        return colors[entityType] || 'var(--primary-color)';
    }
    
    showSmartSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) return;
        
        this.suggestionChips.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', () => {
                this.sendQuickMessage(suggestion);
                this.hideSmartSuggestions();
            });
            this.suggestionChips.appendChild(chip);
        });
        
        this.smartSuggestions.style.display = 'flex';
    }
    
    hideSmartSuggestions() {
        this.smartSuggestions.style.display = 'none';
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.typingIndicatorFull.style.display = 'flex';
        this.sendButton.disabled = true;
        this.messageInput.disabled = true;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.typingIndicatorFull.style.display = 'none';
        this.sendButton.disabled = false;
        this.messageInput.disabled = false;
        this.messageInput.focus();
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }
    
    async loadAnalytics() {
        try {
            const response = await fetch('/api/analytics');
            if (response.ok) {
                this.analyticsData = await response.json();
                this.updateEnhancedAnalyticsDisplay();
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    updateEnhancedAnalyticsDisplay() {
        if (this.analyticsData.error) {
            this.totalQueries.textContent = 'N/A';
            this.avgResponseTime.textContent = 'N/A';
            this.performanceGain.textContent = 'N/A';
            this.uptime.textContent = 'N/A';
            return;
        }
        
        // Update core metrics
        this.totalQueries.textContent = this.analyticsData.total_queries || '0';
        this.avgResponseTime.textContent = `${(this.analyticsData.average_response_time * 1000).toFixed(0)}ms`;
        this.performanceGain.textContent = this.analyticsData.response_time_reduction || '40%';
        this.uptime.textContent = this.analyticsData.uptime_percentage || '99.9%';
        
        // Update sentiment chart
        this.updateSentimentChart();
        
        // Update intent distribution
        this.updateIntentChart();
    }
    
    updateSentimentChart() {
        if (!this.analyticsData.sentiment_distribution) return;
        
        const sentimentData = this.analyticsData.sentiment_distribution;
        const total = Object.values(sentimentData).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) return;
        
        const positivePercent = ((sentimentData.positive || 0) / total * 100).toFixed(1);
        const neutralPercent = ((sentimentData.neutral || 0) / total * 100).toFixed(1);
        const negativePercent = ((sentimentData.negative || 0) / total * 100).toFixed(1);
        
        // Update chart bars
        const positiveBar = this.sentimentChart.querySelector('.sentiment-bar.positive');
        const neutralBar = this.sentimentChart.querySelector('.sentiment-bar.neutral');
        const negativeBar = this.sentimentChart.querySelector('.sentiment-bar.negative');
        
        if (positiveBar) positiveBar.style.width = `${positivePercent}%`;
        if (neutralBar) neutralBar.style.width = `${neutralPercent}%`;
        if (negativeBar) negativeBar.style.width = `${negativePercent}%`;
        
        // Update labels
        const labels = this.sentimentChart.parentElement.querySelector('.sentiment-labels');
        if (labels) {
            labels.innerHTML = `
                <span>Positive: ${positivePercent}%</span>
                <span>Neutral: ${neutralPercent}%</span>
                <span>Negative: ${negativePercent}%</span>
            `;
        }
    }
    
    updateIntentChart() {
        if (!this.analyticsData.intent_distribution) return;
        
        const intentData = this.analyticsData.intent_distribution;
        const intentChart = this.intentChart;
        
        if (!intentChart) return;
        
        intentChart.innerHTML = '';
        
        Object.entries(intentData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5) // Show top 5 intents
            .forEach(([intent, count]) => {
                const intentItem = document.createElement('div');
                intentItem.className = 'intent-item';
                
                const intentName = document.createElement('span');
                intentName.className = 'intent-name';
                intentName.textContent = intent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                const intentCount = document.createElement('span');
                intentCount.className = 'intent-count';
                intentCount.textContent = count;
                
                intentItem.appendChild(intentName);
                intentItem.appendChild(intentCount);
                intentChart.appendChild(intentItem);
            });
    }
    
    updateResponseTimeAnalytics(responseTime) {
        // Update local analytics display in real-time
        if (this.analyticsData.average_response_time !== undefined) {
            // Simple moving average update
            const currentAvg = this.analyticsData.average_response_time;
            const totalQueries = this.analyticsData.total_queries || 0;
            
            if (totalQueries > 0) {
                this.analyticsData.average_response_time = 
                    (currentAvg * totalQueries + responseTime) / (totalQueries + 1);
                this.avgResponseTime.textContent = `${(this.analyticsData.average_response_time * 1000).toFixed(0)}ms`;
            }
        }
    }
    
    async refreshAnalytics() {
        const refreshBtn = document.querySelector('.refresh-btn i');
        refreshBtn.style.animation = 'spin 1s linear';
        
        await this.loadAnalytics();
        
        setTimeout(() => {
            refreshBtn.style.animation = 'none';
        }, 1000);
    }
    
    setupAutoRefresh() {
        // Refresh analytics every 30 seconds
        setInterval(() => {
            if (!document.hidden) {
                this.loadAnalytics();
            }
        }, 30000);
    }
    
    setupAccessibility() {
        // Add ARIA labels and roles
        this.messageInput.setAttribute('aria-label', 'Type your message to the AI assistant');
        this.sendButton.setAttribute('aria-label', 'Send message');
        
        // Add skip links for keyboard navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content landmark
        const mainContent = document.querySelector('.chat-container');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Add to notification container
        const container = document.getElementById('notificationContainer');
        if (container) {
            container.appendChild(notification);
        }
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Utility methods
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
    
    sanitizeInput(input) {
        // Enhanced input sanitization
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new EnhancedChatbotUI();
    
    // Add enhanced CSS for notifications and entities
    const style = document.createElement('style');
    style.textContent = `
        .entity-highlight {
            transition: all 0.3s ease;
        }
        
        .entity-highlight:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .skip-link:focus {
            top: 6px !important;
        }
        
        .accessibility-mode .message-content {
            border-width: 2px;
        }
        
        .accessibility-mode .quick-action-btn {
            border-width: 2px;
        }
        
        .accessibility-mode button:focus,
        .accessibility-mode input:focus {
            outline: 3px solid var(--primary-color);
            outline-offset: 3px;
        }
    `;
    document.head.appendChild(style);
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('messageInput').focus();
    }, 100);
});

// Global functions for HTML onclick handlers
function sendMessage() {
    if (window.chatbot) {
        window.chatbot.sendMessage();
    }
}

function sendQuickMessage(message) {
    if (window.chatbot) {
        window.chatbot.sendQuickMessage(message);
    }
}

function refreshAnalytics() {
    if (window.chatbot) {
        window.chatbot.refreshAnalytics();
    }
}

function openSettings() {
    if (window.chatbot) {
        window.chatbot.openSettings();
    }
}

function closeSettings() {
    if (window.chatbot) {
        window.chatbot.closeSettings();
    }
}

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause some operations
        if (window.chatbot) {
            window.chatbot.pauseAutoRefresh = true;
        }
    } else {
        // Page is visible, resume operations
        if (window.chatbot) {
            window.chatbot.pauseAutoRefresh = false;
            window.chatbot.loadAnalytics();
        }
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    if (window.chatbot) {
        window.chatbot.showNotification('Connection restored!', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.chatbot) {
        window.chatbot.showNotification('Connection lost. Please check your internet connection.', 'error');
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle beforeinstallprompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt if desired
    if (window.chatbot) {
        window.chatbot.showNotification('Install this app for a better experience!', 'info');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}
