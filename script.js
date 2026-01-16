/**
 * Chetech AB Website - Interactive Scripts
 * Terminal animation and UI interactions
 */

(function() {
    'use strict';

    // ===================================
    // Terminal Animation Configuration
    // ===================================
    const terminalSequences = [
        {
            command: 'chetech-agent --task "analyze codebase"',
            outputs: [
                { text: '> Initializing secure, offline AI environment...', delay: 300 },
                { text: '> Loading local LLM (no cloud dependencies)...', delay: 600 },
                { text: '> Scanning repository structure...', delay: 800 },
                { text: '> Found 247 source files across 12 modules', delay: 400, class: 'info' },
                { text: '> Ready for queries.', delay: 300, class: 'success' }
            ]
        },
        {
            command: 'chetech-agent --rag "query legacy docs"',
            outputs: [
                { text: '> Connecting to RAG pipeline...', delay: 300 },
                { text: '> Indexing 1,247 legacy documentation files...', delay: 700 },
                { text: '> Building semantic embeddings...', delay: 600 },
                { text: '> Vector store ready (local, encrypted)', delay: 400, class: 'info' },
                { text: '> Pipeline operational. Zero data leaves your network.', delay: 400, class: 'success' }
            ]
        },
        {
            command: 'chetech-agent --refactor "optimize module"',
            outputs: [
                { text: '> Analyzing code patterns...', delay: 400 },
                { text: '> Identifying optimization opportunities...', delay: 500 },
                { text: '> Generating refactored code...', delay: 600 },
                { text: '> Running test suite... 47/47 passed', delay: 700, class: 'success' },
                { text: '> Refactoring complete. PR ready for review.', delay: 300, class: 'success' }
            ]
        },
        {
            command: 'chetech-agent --mcp "connect tools"',
            outputs: [
                { text: '> Starting MCP server...', delay: 300 },
                { text: '> Registering tools: git, jira, confluence', delay: 500 },
                { text: '> Establishing secure connections...', delay: 600 },
                { text: '> All tools connected via Model Context Protocol', delay: 400, class: 'info' },
                { text: '> AI assistant now has full tool access.', delay: 300, class: 'success' }
            ]
        }
    ];

    // ===================================
    // Terminal Animation Engine
    // ===================================
    class TerminalAnimator {
        constructor() {
            this.commandEl = null;
            this.outputEl = null;
            this.cursorEl = null;
            this.currentSequence = 0;
            this.isAnimating = false;
            this.isPaused = false;
        }

        setElements(commandEl, outputEl, cursorEl) {
            this.commandEl = commandEl;
            this.outputEl = outputEl;
            this.cursorEl = cursorEl;
        }

        pause() {
            this.isPaused = true;
        }

        resume() {
            this.isPaused = false;
        }

        async typeText(element, text, speed = 50) {
            if (!element) return;
            element.textContent = '';
            for (let i = 0; i < text.length; i++) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                element.textContent += text[i];
                await this.sleep(speed);
            }
        }

        async waitForResume() {
            while (this.isPaused) {
                await this.sleep(100);
            }
        }

        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async addOutputLine(text, className = '') {
            if (!this.outputEl) return;
            const line = document.createElement('div');
            line.className = 'output-line' + (className ? ' ' + className : '');
            line.textContent = text;
            this.outputEl.appendChild(line);
        }

        async runSequence(sequence) {
            if (this.isAnimating || !this.commandEl || !this.outputEl) return;
            this.isAnimating = true;

            // Clear previous output
            this.outputEl.innerHTML = '';
            this.commandEl.textContent = '';

            // Show cursor
            if (this.cursorEl) {
                this.cursorEl.style.display = 'inline';
            }

            // Type command
            await this.typeText(this.commandEl, sequence.command, 40);

            // Small pause after command
            await this.sleep(400);

            // Show outputs one by one
            for (const output of sequence.outputs) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                await this.sleep(output.delay || 300);
                await this.addOutputLine(output.text, output.class || '');
            }

            // Pause before next sequence
            await this.sleep(8000);

            this.isAnimating = false;
        }

        async start() {
            while (true) {
                if (!this.isPaused && this.commandEl && this.outputEl) {
                    await this.runSequence(terminalSequences[this.currentSequence]);
                    this.currentSequence = (this.currentSequence + 1) % terminalSequences.length;
                } else {
                    await this.sleep(500);
                }
            }
        }
    }

    // ===================================
    // Terminal Window (WinBox Wrapper)
    // ===================================
    class TerminalWindow {
        constructor(animator) {
            this.animator = animator;
            this.winbox = null;
            this.isMinimized = false;
            this.isMaximized = false;
            this.isClosed = false;
            this.reopenTimeout = null;
            this.isMobile = this.detectMobile();
            this.container = document.getElementById('terminal-container');
            this.reopenBtn = document.getElementById('terminal-reopen');
            this.dockElement = null;
            this.savedPosition = null;

            this.init();
        }

        detectMobile() {
            return window.matchMedia('(max-width: 1024px)').matches ||
                   'ontouchstart' in window ||
                   navigator.maxTouchPoints > 0;
        }

        init() {
            this.createWindow();
            this.setupReopenButton();

            // Update mobile detection on resize
            window.addEventListener('resize', () => {
                this.isMobile = this.detectMobile();
                if (this.winbox) {
                    // Disable/enable move based on mobile
                    this.winbox.move = !this.isMobile;
                }
            });
        }

        createWindow() {
            const containerRect = this.container.getBoundingClientRect();

            // Create the terminal content
            const terminalHTML = `
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span class="terminal-btn red" id="btn-close"></span>
                        <span class="terminal-btn yellow" id="btn-minimize"></span>
                        <span class="terminal-btn green" id="btn-maximize"></span>
                    </div>
                    <div class="terminal-title">chetech-agent</div>
                </div>
                <div class="terminal-body">
                    <div class="terminal-content">
                        <div class="terminal-line">
                            <span class="prompt">$</span>
                            <span class="command" id="terminal-command"></span>
                            <span class="cursor" id="cursor">|</span>
                        </div>
                        <div class="terminal-output" id="terminal-output"></div>
                    </div>
                </div>
            `;

            // Calculate position
            const width = Math.min(540, window.innerWidth - 40);
            const height = 380;

            // For desktop, position relative to container
            // For mobile, center in container
            let x, y;
            if (this.isMobile) {
                x = 'center';
                y = containerRect.top + window.scrollY;
            } else {
                x = containerRect.left + (containerRect.width - width) / 2;
                y = containerRect.top + window.scrollY + 20;
            }

            this.winbox = new WinBox({
                title: '',
                html: terminalHTML,
                width: width,
                height: height,
                x: x,
                y: y,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                class: ['no-animation', 'no-header'],
                background: 'transparent',
                border: 0,
                header: 0, // Hide default header
                move: false, // We handle move ourselves
                resize: false,
                maximize: false,
                minimize: false,
                close: false
            });

            // Make terminal header the drag handle
            if (!this.isMobile) {
                this.setupDragHandler();
            }

            // Remove no-animation class after initial render
            setTimeout(() => {
                if (this.winbox && this.winbox.dom) {
                    this.winbox.dom.classList.remove('no-animation');
                    // Add float animation
                    if (!this.isMobile) {
                        this.winbox.dom.style.animation = 'terminalFloat 6s ease-in-out infinite';
                    }
                }
            }, 100);

            // Set up button handlers
            this.setupButtons();

            // Connect animator to new elements
            this.connectAnimator();

            // Hide reopen button
            this.reopenBtn.style.display = 'none';
            this.isClosed = false;
        }

        setupButtons() {
            const closeBtn = this.winbox.body.querySelector('#btn-close');
            const minimizeBtn = this.winbox.body.querySelector('#btn-minimize');
            const maximizeBtn = this.winbox.body.querySelector('#btn-maximize');

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });

            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimize();
            });

            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximize();
            });
        }

        connectAnimator() {
            const commandEl = this.winbox.body.querySelector('#terminal-command');
            const outputEl = this.winbox.body.querySelector('#terminal-output');
            const cursorEl = this.winbox.body.querySelector('#cursor');

            this.animator.setElements(commandEl, outputEl, cursorEl);
            this.animator.resume();
        }

        setupReopenButton() {
            this.reopenBtn.addEventListener('click', () => {
                this.reopen();
            });
        }

        setupDragHandler() {
            const terminalHeader = this.winbox.body.querySelector('.terminal-header');
            if (!terminalHeader) return;

            // Get the WinBox DOM element
            const winboxEl = this.winbox.body.parentElement;
            if (!winboxEl) return;

            let isDragging = false;
            let startX, startY;
            let startLeft, startTop;

            const onMouseDown = (e) => {
                // Don't drag if clicking on buttons
                if (e.target.closest('.terminal-btn')) return;
                // Only respond to left mouse button
                if (e.button !== 0) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                // Get current position from the element's style
                startLeft = parseInt(winboxEl.style.left, 10) || 0;
                startTop = parseInt(winboxEl.style.top, 10) || 0;

                // Remove float animation when dragging starts
                winboxEl.style.animation = 'none';

                // Add dragging class for visual feedback
                winboxEl.classList.add('dragging');

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);

                e.preventDefault();
                e.stopPropagation();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newX = startLeft + deltaX;
                const newY = startTop + deltaY;

                // Directly set CSS position
                winboxEl.style.left = newX + 'px';
                winboxEl.style.top = newY + 'px';

                e.preventDefault();
            };

            const onMouseUp = (e) => {
                if (!isDragging) return;

                isDragging = false;
                winboxEl.classList.remove('dragging');

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                e.preventDefault();
            };

            terminalHeader.addEventListener('mousedown', onMouseDown);
        }

        close() {
            if (this.winbox && !this.isClosed) {
                this.animator.pause();
                this.winbox.hide();
                this.isClosed = true;

                // Show reopen button
                this.reopenBtn.style.display = 'flex';

                // Auto-reopen after 8 seconds
                this.reopenTimeout = setTimeout(() => {
                    if (this.isClosed) {
                        this.reopen();
                    }
                }, 8000);
            }
        }

        minimize() {
            if (this.winbox && !this.isMinimized) {
                this.animator.pause();
                this.winbox.hide();
                this.isMinimized = true;

                // Create dock element
                this.createDock();
            }
        }

        restore() {
            if (this.winbox && this.isMinimized) {
                this.winbox.show();
                this.isMinimized = false;
                this.animator.resume();

                // Remove dock
                this.removeDock();
            }
        }

        toggleMaximize() {
            if (!this.winbox) return;

            const winboxEl = this.winbox.body.parentElement;
            if (!winboxEl) return;

            if (this.isMaximized) {
                // Restore to original size and position
                winboxEl.style.left = this.savedPosition.left;
                winboxEl.style.top = this.savedPosition.top;
                winboxEl.style.width = this.savedPosition.width;
                winboxEl.style.height = this.savedPosition.height;
                winboxEl.style.position = 'absolute';
                winboxEl.classList.remove('max');
                this.isMaximized = false;
            } else {
                // Save current position and size
                this.savedPosition = {
                    left: winboxEl.style.left,
                    top: winboxEl.style.top,
                    width: winboxEl.style.width,
                    height: winboxEl.style.height
                };
                // Maximize - use fixed position and account for nav bar
                const navHeight = 72; // var(--nav-height)
                winboxEl.style.position = 'fixed';
                winboxEl.style.left = '0px';
                winboxEl.style.top = navHeight + 'px';
                winboxEl.style.width = '100vw';
                winboxEl.style.height = `calc(100vh - ${navHeight}px)`;
                winboxEl.classList.add('max');
                this.isMaximized = true;
            }
        }

        reopen() {
            if (this.reopenTimeout) {
                clearTimeout(this.reopenTimeout);
                this.reopenTimeout = null;
            }

            if (this.winbox) {
                // Show the hidden window
                this.winbox.show();
                this.isClosed = false;
                this.reopenBtn.style.display = 'none';
                this.animator.resume();
            } else {
                // Create new window if it was destroyed
                this.createWindow();
            }
        }

        createDock() {
            this.dockElement = document.createElement('div');
            this.dockElement.className = 'terminal-dock';
            this.dockElement.innerHTML = `
                <button class="terminal-dock-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M3 9h18"/>
                    </svg>
                    chetech-agent
                </button>
            `;

            document.body.appendChild(this.dockElement);

            this.dockElement.querySelector('button').addEventListener('click', () => {
                this.restore();
            });
        }

        removeDock() {
            if (this.dockElement) {
                this.dockElement.remove();
                this.dockElement = null;
            }
        }
    }

    // ===================================
    // Navigation
    // ===================================
    function initNavigation() {
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.getElementById('nav-links');

        // Scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // Mobile toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===================================
    // Scroll Animations
    // ===================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add fade-in class to elements
        const animatedElements = document.querySelectorAll(
            '.service-card, .timeline-item, .featured-project, .github-profile, .about-content'
        );

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ===================================
    // Smooth Scroll
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===================================
    // Initialize
    // ===================================
    function init() {
        initNavigation();
        initScrollAnimations();
        initSmoothScroll();

        // Create terminal animator
        const animator = new TerminalAnimator();

        // Create terminal window with WinBox
        const terminalWindow = new TerminalWindow(animator);

        // Start terminal animation
        animator.start();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
