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
        this.initializeMetricsScrolling();
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
        
        // Input control elements
        this.emojiBtn = document.getElementById('emojiBtn');
        this.attachmentBtn = document.getElementById('attachmentBtn');
        
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
        
        // Analytics panel controls
        this.refreshBtn = document.querySelector('.refresh-btn');
        this.expandAnalyticsBtn = document.getElementById('expandAnalytics');
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
        
        // Emoji button functionality
        this.emojiBtn.addEventListener('click', () => {
            this.showEmojiPicker();
        });
        
        // Attachment button functionality
        this.attachmentBtn.addEventListener('click', () => {
            this.showFileUpload();
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Settings
        this.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });
        
        // Analytics panel controls
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                this.refreshAnalytics();
            });
        }
        
        if (this.expandAnalyticsBtn) {
            this.expandAnalyticsBtn.addEventListener('click', () => {
                this.toggleAnalyticsPanel();
            });
        }
        
        // Close analytics panel button
        const closeAnalyticsBtn = document.getElementById('closeAnalyticsPanel');
        if (closeAnalyticsBtn) {
            closeAnalyticsBtn.addEventListener('click', () => {
                this.closeAnalyticsPanel();
            });
        }
        
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
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Hide smart suggestions before sending
        this.hideSmartSuggestions();
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Send to API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(data.response, 'bot', {
                intent: data.intent,
                sentiment: data.sentiment,
                entities: data.entities,
                suggestions: data.suggestions
            });
            
            // Show smart suggestions if available
            if (data.suggestions && data.suggestions.length > 0) {
                this.showSmartSuggestions(data.suggestions);
            }
            
            // Update analytics
            this.loadAnalytics();
        })
        .catch(error => {
            console.error('Error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        });
    }
    
    sendQuickMessage(message) {
        // Set the message in the input
        this.messageInput.value = message;
        this.updateCharCount();
        
        // Send the message
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
                this.updateEnhancedAnalyticsDisplay(this.analyticsData);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    updateEnhancedAnalyticsDisplay(data) {
        try {
            console.log('Updating analytics display with data:', data);
            
            // Update basic metrics
            const totalQueries = document.getElementById('totalQueries');
            const avgResponseTime = document.getElementById('avgResponseTime');
            const uptime = document.getElementById('uptime');
            
            if (totalQueries) totalQueries.textContent = data.total_queries || '0';
            if (avgResponseTime) avgResponseTime.textContent = `${(data.avg_response_time || 0).toFixed(1)}ms`;
            if (uptime) uptime.textContent = `${data.uptime || '99.9'}%`;
            
            // Update trends
            const responseTimeTrend = document.getElementById('responseTimeTrend');
            const uptimeTrend = document.getElementById('uptimeTrend');
            const queriesTrend = document.getElementById('queriesTrend');
            
            if (responseTimeTrend) responseTimeTrend.textContent = `${data.response_time_trend || '-5%'} this week`;
            if (uptimeTrend) uptimeTrend.textContent = `${data.uptime || '99.9'}%`;
            if (queriesTrend) queriesTrend.textContent = `+${data.queries_trend || '12%'} today`;
            
            // Update performance gain
            const performanceGain = document.getElementById('performanceGain');
            const performanceTrend = document.getElementById('performanceTrend');
            
            if (performanceGain) performanceGain.textContent = `${data.performance_gain || '40.0'}%`;
            if (performanceTrend) performanceTrend.textContent = `Target: ${data.performance_target || '40%'}`;
            
            // Update sentiment chart
            this.updateSentimentChart(data.sentiment_distribution || { positive: 0, neutral: 100, negative: 0 });
            
            // Update intent chart
            this.updateIntentChart(data.intent_distribution || { 'return_refund': 2, 'technical_support': 1, 'general_inquiry': 1 });
            
            console.log('Analytics display updated successfully');
            
            // Debug: Check if metrics container is visible
            const metricsContainer = document.querySelector('.metrics-container');
            if (metricsContainer) {
                console.log('Metrics container found:', metricsContainer);
                console.log('Metrics container children:', metricsContainer.children.length);
                console.log('Metrics container styles:', window.getComputedStyle(metricsContainer));
            } else {
                console.error('Metrics container not found!');
            }
            
        } catch (error) {
            console.error('Error updating analytics display:', error);
        }
    }
    
    updateSentimentChart(sentimentData) {
        if (!sentimentData) return;
        
        const sentimentChart = this.sentimentChart;
        if (!sentimentChart) return;
        
        sentimentChart.innerHTML = '';
        
        const total = Object.values(sentimentData).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) {
            sentimentChart.innerHTML = '<p>No sentiment data available.</p>';
            return;
        }
        
        const positivePercent = ((sentimentData.positive || 0) / total * 100).toFixed(1);
        const neutralPercent = ((sentimentData.neutral || 0) / total * 100).toFixed(1);
        const negativePercent = ((sentimentData.negative || 0) / total * 100).toFixed(1);
        
        // Update chart bars
        const positiveBar = document.createElement('div');
        positiveBar.className = 'sentiment-bar positive';
        positiveBar.style.width = `${positivePercent}%`;
        
        const neutralBar = document.createElement('div');
        neutralBar.className = 'sentiment-bar neutral';
        neutralBar.style.width = `${neutralPercent}%`;
        
        const negativeBar = document.createElement('div');
        negativeBar.className = 'sentiment-bar negative';
        negativeBar.style.width = `${negativePercent}%`;
        
        sentimentChart.appendChild(positiveBar);
        sentimentChart.appendChild(neutralBar);
        sentimentChart.appendChild(negativeBar);
        
        // Update labels
        const labels = sentimentChart.parentElement.querySelector('.sentiment-labels');
        if (labels) {
            labels.innerHTML = `
                <span>Positive: ${positivePercent}%</span>
                <span>Neutral: ${neutralPercent}%</span>
                <span>Negative: ${negativePercent}%</span>
            `;
        }
    }
    
    updateIntentChart(intentData) {
        if (!intentData) return;
        
        const intentChart = this.intentChart;
        if (!intentChart) return;
        
        intentChart.innerHTML = '';
        
        const total = Object.values(intentData).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) {
            intentChart.innerHTML = '<p>No intent data available.</p>';
            return;
        }
        
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
    
    showEmojiPicker() {
        // Create emoji picker overlay
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker-overlay';
        emojiPicker.innerHTML = `
            <div class="emoji-picker">
                <div class="emoji-picker-header">
                    <h4>Select Emoji</h4>
                    <button class="close-emoji-btn">&times;</button>
                </div>
                <div class="emoji-grid">
                    <span class="emoji" data-emoji="😊">😊</span>
                    <span class="emoji" data-emoji="😂">😂</span>
                    <span class="emoji" data-emoji="❤️">❤️</span>
                    <span class="emoji" data-emoji="👍">👍</span>
                    <span class="emoji" data-emoji="👎">👎</span>
                    <span class="emoji" data-emoji="🎉">🎉</span>
                    <span class="emoji" data-emoji="🔥">🔥</span>
                    <span class="emoji" data-emoji="💯">💯</span>
                    <span class="emoji" data-emoji="✨">✨</span>
                    <span class="emoji" data-emoji="🙏">🙏</span>
                    <span class="emoji" data-emoji="😎">😎</span>
                    <span class="emoji" data-emoji="🤔">🤔</span>
                    <span class="emoji" data-emoji="😢">😢</span>
                    <span class="emoji" data-emoji="😡">😡</span>
                    <span class="emoji" data-emoji="🤗">🤗</span>
                    <span class="emoji" data-emoji="👋">👋</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(emojiPicker);
        
        // Position the emoji picker relative to the emoji button
        const emojiBtn = this.emojiBtn;
        const btnRect = emojiBtn.getBoundingClientRect();
        const picker = emojiPicker.querySelector('.emoji-picker');
        
        // Calculate position to keep picker within viewport
        const pickerWidth = 400; // max-width from CSS
        const pickerHeight = 300; // approximate height
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = btnRect.left + (btnRect.width / 2) - (pickerWidth / 2);
        let top = btnRect.bottom + 10; // 10px below button
        
        // Ensure picker doesn't go off-screen
        if (left < 20) left = 20;
        if (left + pickerWidth > viewportWidth - 20) left = viewportWidth - pickerWidth - 20;
        if (top + pickerHeight > viewportHeight - 20) top = btnRect.top - pickerHeight - 10;
        
        picker.style.position = 'absolute';
        picker.style.left = left + 'px';
        picker.style.top = top + 'px';
        picker.style.transform = 'none';
        
        // Add event listeners
        emojiPicker.querySelector('.close-emoji-btn').addEventListener('click', () => {
            emojiPicker.remove();
        });
        
        emojiPicker.querySelectorAll('.emoji').forEach(emoji => {
            emoji.addEventListener('click', () => {
                const emojiText = emoji.dataset.emoji;
                this.messageInput.value += emojiText;
                this.messageInput.focus();
                emojiPicker.remove();
                this.updateCharCount();
            });
        });
        
        // Close on outside click
        emojiPicker.addEventListener('click', (e) => {
            if (e.target === emojiPicker) {
                emojiPicker.remove();
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                emojiPicker.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    showFileUpload() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
        fileInput.multiple = false;
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
        
        fileInput.click();
    }
    
    handleFileUpload(file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('File type not supported. Please upload images, PDFs, Word documents, or text files.', 'error');
            return;
        }
        
        // Show file preview
        this.showFilePreview(file);
    }
    
    showFilePreview(file) {
        const filePreview = document.createElement('div');
        filePreview.className = 'file-preview';
        filePreview.innerHTML = `
            <div class="file-preview-content">
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
                <div class="file-actions">
                    <button class="send-file-btn">Send File</button>
                    <button class="remove-file-btn">Remove</button>
                </div>
            </div>
        `;
        
        // Insert before the input wrapper
        this.messageInput.parentElement.parentElement.insertBefore(filePreview, this.messageInput.parentElement);
        
        // Add event listeners
        filePreview.querySelector('.send-file-btn').addEventListener('click', () => {
            this.sendFileMessage(file);
            filePreview.remove();
        });
        
        filePreview.querySelector('.remove-file-btn').addEventListener('click', () => {
            filePreview.remove();
        });
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    sendFileMessage(file) {
        // Create a message about the file
        const fileMessage = `📎 Attached file: ${file.name} (${this.formatFileSize(file.size)})`;
        
        // Add to conversation
        this.addMessage(fileMessage, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response about the file
        setTimeout(() => {
            this.hideTypingIndicator();
            const aiResponse = `I can see you've uploaded "${file.name}". This appears to be a ${file.type.split('/')[1]} file. How can I help you with this document?`;
            this.addMessage(aiResponse, 'bot');
        }, 1500);
    }
    
    toggleAnalyticsPanel() {
        const panel = this.analyticsPanel;
        const isExpanded = panel.classList.contains('expanded');
        const closeBtn = document.getElementById('closeAnalyticsPanel');
        const expandBtn = document.getElementById('expandAnalytics');
        
        if (isExpanded) {
            // Collapse panel
            panel.classList.remove('expanded');
            document.body.style.overflow = 'auto';
            
            // Hide close button, show expand button
            if (closeBtn) closeBtn.style.display = 'none';
            if (expandBtn) expandBtn.style.display = 'inline-block';
            
            // Ensure proper scrolling in collapsed state
            const metricsContainer = panel.querySelector('.metrics-container');
            if (metricsContainer) {
                metricsContainer.style.overflowY = 'scroll';
                metricsContainer.style.maxHeight = 'calc(100vh - 100px)';
                metricsContainer.style.height = 'calc(100vh - 100px)';
                // Force scrollbar to be visible
                metricsContainer.style.overflowY = 'scroll';
            }
        } else {
            // Expand panel
            panel.classList.add('expanded');
            document.body.style.overflow = 'hidden';
            
            // Show close button, hide expand button
            if (closeBtn) closeBtn.style.display = 'inline-block';
            if (expandBtn) expandBtn.style.display = 'none';
            
            // Ensure proper scrolling in expanded state
            const metricsContainer = panel.querySelector('.metrics-container');
            if (metricsContainer) {
                metricsContainer.style.overflowY = 'scroll';
                metricsContainer.style.maxHeight = 'calc(100vh - 100px)';
                metricsContainer.style.height = 'calc(100vh - 100px)';
                // Force scrollbar to be visible
                metricsContainer.style.overflowY = 'scroll';
            }
        }
    }

    refreshAnalytics() {
        console.log('Refreshing analytics...');
        
        // Show loading state
        const refreshBtn = this.refreshBtn;
        if (refreshBtn) {
            const originalIcon = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            refreshBtn.disabled = true;
            
            // Fetch fresh analytics data
            fetch('/api/analytics')
                .then(response => response.json())
                .then(data => {
                    console.log('Analytics data received:', data);
                    this.updateEnhancedAnalyticsDisplay(data);
                    
                    // Re-enable refresh button
                    setTimeout(() => {
                        refreshBtn.innerHTML = originalIcon;
                        refreshBtn.disabled = false;
                    }, 1000);
                })
                .catch(error => {
                    console.error('Error refreshing analytics:', error);
                    refreshBtn.innerHTML = originalIcon;
                    refreshBtn.disabled = false;
                });
        }
    }

    closeAnalyticsPanel() {
        const panel = this.analyticsPanel;
        const closeBtn = document.getElementById('closeAnalyticsPanel');
        const expandBtn = document.getElementById('expandAnalytics');
        
        if (panel.classList.contains('expanded')) {
            panel.classList.remove('expanded');
            document.body.style.overflow = 'auto';
            
            // Hide close button, show expand button
            if (closeBtn) closeBtn.style.display = 'none';
            if (expandBtn) expandBtn.style.display = 'inline-block';
            
            // Ensure proper scrolling in collapsed state
            const metricsContainer = panel.querySelector('.metrics-container');
            if (metricsContainer) {
                metricsContainer.style.overflowY = 'scroll';
                metricsContainer.style.maxHeight = 'calc(100vh - 100px)';
                metricsContainer.style.height = 'calc(100vh - 100px)';
                // Force scrollbar to be visible
                metricsContainer.style.overflowY = 'scroll';
            }
        }
    }

    // Initialize scrolling for metrics container
    initializeMetricsScrolling() {
        const metricsContainer = this.analyticsPanel?.querySelector('.metrics-container');
        if (metricsContainer) {
            // Force scrolling to work with new compact layout
            metricsContainer.style.overflowY = 'scroll';
            metricsContainer.style.maxHeight = 'calc(100vh - 100px)';
            metricsContainer.style.height = 'calc(100vh - 100px)';
            
            // Add scroll event listener for debugging
            metricsContainer.addEventListener('scroll', (e) => {
                console.log('Scrolling metrics container:', e.target.scrollTop);
            });
            
            // Ensure scrollbar is visible
            metricsContainer.style.overflowY = 'scroll';
            
            console.log('Metrics scrolling initialized with thicker header layout');
        }
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotUI = new EnhancedChatbotUI();
    
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

// Global functions for HTML onclick attributes (legacy support)
function sendMessage() {
    if (window.chatbotUI) {
        window.chatbotUI.sendMessage();
    }
}

function openSettings() {
    if (window.chatbotUI) {
        window.chatbotUI.openSettings();
    }
}

function closeSettings() {
    if (window.chatbotUI) {
        window.chatbotUI.closeSettings();
    }
}

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle beforeinstallprompt event for PWA installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
});

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});
