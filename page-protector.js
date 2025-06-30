// page-protector.js
class PageProtector {
    constructor(options = {}) {
        // Default configuration
        this.defaultConfig = {
            disableRightClick: true,
            disableShortcuts: true,
            disableTextSelection: true,
            tamperDetection: true,
            obfuscate: true,
            showStatusIndicator: true,
            tamperCheckInterval: 1000,
            tamperThreshold: 100,
            onContextMenuBlocked: null,
            onShortcutBlocked: null,
            onDevToolsDetected: null
        };
        
        // Merge options with defaults
        this.config = {...this.defaultConfig, ...options};
        
        // Store references to event listeners
        this.listeners = {
            contextmenu: null,
            keydown: null,
            keypress: null,
            selectstart: null
        };
        
        // Store interval ID for tamper detection
        this.tamperInterval = null;
        
        // Status indicator element
        this.statusIndicator = null;
    }
    
    init() {
        // Initialize all enabled protections
        if (this.config.disableRightClick) this._disableRightClick();
        if (this.config.disableShortcuts) this._disableShortcuts();
        if (this.config.disableTextSelection) this._disableTextSelection();
        if (this.config.tamperDetection) this._enableTamperDetection();
        if (this.config.obfuscate) this._obfuscateSource();
        if (this.config.showStatusIndicator) this._createStatusIndicator();
        
        return this; // Return instance for method chaining
    }
    
    destroy() {
        // Remove all event listeners
        if (this.listeners.contextmenu) {
            document.removeEventListener('contextmenu', this.listeners.contextmenu);
        }
        
        if (this.listeners.keydown) {
            document.removeEventListener('keydown', this.listeners.keydown);
        }
        
        if (this.listeners.keypress) {
            document.onkeypress = null;
        }
        
        if (this.listeners.selectstart) {
            document.removeEventListener('selectstart', this.listeners.selectstart);
        }
        
        // Clear tamper detection interval
        if (this.tamperInterval) {
            clearInterval(this.tamperInterval);
            this.tamperInterval = null;
        }
        
        // Remove status indicator
        if (this.statusIndicator && this.statusIndicator.parentNode) {
            this.statusIndicator.parentNode.removeChild(this.statusIndicator);
        }
    }
    
    _disableRightClick() {
        this.listeners.contextmenu = (e) => {
            e.preventDefault();
            if (this.config.onContextMenuBlocked) {
                this.config.onContextMenuBlocked(e);
            }
            this._updateStatus('Context menu blocked');
        };
        document.addEventListener('contextmenu', this.listeners.contextmenu);
    }
    
    _disableShortcuts() {
        this.listeners.keydown = (e) => {
            // Disable F12
            if (e.key === 'F12') {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('F12');
                }
                this._updateStatus('F12 blocked');
                return;
            }
            
            // Disable Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('Ctrl+Shift+I');
                }
                this._updateStatus('Ctrl+Shift+I blocked');
                return;
            }
            
            // Disable Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('Ctrl+Shift+J');
                }
                this._updateStatus('Ctrl+Shift+J blocked');
                return;
            }
            
            // Disable Ctrl+U (View source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('Ctrl+U');
                }
                this._updateStatus('Ctrl+U blocked');
                return;
            }
            
            // Disable Ctrl+Shift+C (Chrome/Firefox element inspector)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('Ctrl+Shift+C');
                }
                this._updateStatus('Ctrl+Shift+C blocked');
                return;
            }
        };
        document.addEventListener('keydown', this.listeners.keydown);
        
        // Block menu bar access to View Source
        this.listeners.keypress = (e) => {
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                if (this.config.onShortcutBlocked) {
                    this.config.onShortcutBlocked('Ctrl+U');
                }
                this._updateStatus('Ctrl+U blocked');
                return false;
            }
        };
        document.onkeypress = this.listeners.keypress;
    }
    
    _disableTextSelection() {
        this.listeners.selectstart = (e) => {
            e.preventDefault();
        };
        document.addEventListener('selectstart', this.listeners.selectstart);
    }
    
    _enableTamperDetection() {
        this.tamperInterval = setInterval(() => {
            const before = performance.now();
            
            // This will pause execution if dev tools are open
            try {
                // Using a function constructor to bypass breakpoint detection
                const debug = new Function("debugger;");
                debug();
            } catch (e) {
                // Continue even if debugger statement is blocked
            }
            
            const after = performance.now();
            
            if (after - before > this.config.tamperThreshold) {
                if (this.config.onDevToolsDetected) {
                    this.config.onDevToolsDetected();
                }
                this._updateStatus('Dev tools detected! Reloading...');
                location.reload();
            }
        }, this.config.tamperCheckInterval);
    }
    
    _obfuscateSource() {
        // Add a comment to the body for obfuscation
        document.body.innerHTML += '<!-- Source code protected by PageProtector.js -->';
    }
    
    _createStatusIndicator() {
        // Create status indicator element
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.id = 'page-protector-status';
        this.statusIndicator.style.position = 'fixed';
        this.statusIndicator.style.bottom = '10px';
        this.statusIndicator.style.right = '10px';
        this.statusIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.statusIndicator.style.color = 'white';
        this.statusIndicator.style.padding = '5px 10px';
        this.statusIndicator.style.borderRadius = '5px';
        this.statusIndicator.style.fontSize = '0.8rem';
        this.statusIndicator.style.zIndex = '10000';
        this.statusIndicator.style.transition = 'opacity 0.3s';
        this.statusIndicator.innerHTML = '<i class="fas fa-shield-alt"></i> Protection: Active';
        
        // Add Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
        
        document.body.appendChild(this.statusIndicator);
    }
    
    _updateStatus(message) {
        if (this.statusIndicator && this.config.showStatusIndicator) {
            this.statusIndicator.innerHTML = `<i class="fas fa-shield-alt"></i> ${message}`;
            this.statusIndicator.style.opacity = '1';
            
            // Reset after delay
            setTimeout(() => {
                if (this.statusIndicator) {
                    this.statusIndicator.style.opacity = '0.7';
                    this.statusIndicator.innerHTML = '<i class="fas fa-shield-alt"></i> Protection: Active';
                }
            }, 2000);
        }
    }
}

// Auto-initialize if configured to do so
if (typeof PAGE_PROTECTOR_AUTO_INIT !== 'undefined' && PAGE_PROTECTOR_AUTO_INIT) {
    document.addEventListener('DOMContentLoaded', function() {
        new PageProtector().init();
    });
}
