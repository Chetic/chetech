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
            this.commandEl = document.getElementById('terminal-command');
            this.outputEl = document.getElementById('terminal-output');
            this.cursorEl = document.getElementById('cursor');
            this.currentSequence = 0;
            this.isAnimating = false;
        }

        async typeText(element, text, speed = 50) {
            element.textContent = '';
            for (let i = 0; i < text.length; i++) {
                element.textContent += text[i];
                await this.sleep(speed);
            }
        }

        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async addOutputLine(text, className = '') {
            const line = document.createElement('div');
            line.className = 'output-line' + (className ? ' ' + className : '');
            line.textContent = text;
            this.outputEl.appendChild(line);
        }

        async runSequence(sequence) {
            if (this.isAnimating) return;
            this.isAnimating = true;

            // Clear previous output
            this.outputEl.innerHTML = '';
            this.commandEl.textContent = '';

            // Hide cursor during clear
            this.cursorEl.style.display = 'inline';

            // Type command
            await this.typeText(this.commandEl, sequence.command, 40);

            // Small pause after command
            await this.sleep(400);

            // Show outputs one by one
            for (const output of sequence.outputs) {
                await this.sleep(output.delay || 300);
                await this.addOutputLine(output.text, output.class || '');
            }

            // Pause before next sequence
            await this.sleep(8000);

            this.isAnimating = false;
        }

        async start() {
            while (true) {
                await this.runSequence(terminalSequences[this.currentSequence]);
                this.currentSequence = (this.currentSequence + 1) % terminalSequences.length;
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

        // Start terminal animation
        const terminal = new TerminalAnimator();
        terminal.start();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
