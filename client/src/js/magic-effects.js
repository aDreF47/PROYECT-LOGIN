document.addEventListener('DOMContentLoaded', function() {
    // Crear elementos para el fondo animado
    createAnimatedBackground();
    
    // Crear elementos para el cursor personalizado
    createMagicCursor();
    
    // Crear el personaje animado si no está en modo móvil
    if (window.innerWidth > 768) {
        createAnimatedCharacter();
    }
    
    // Función para crear el fondo animado
    function createAnimatedBackground() {
        const circlesContainer = document.createElement('ul');
        circlesContainer.className = 'circles';
        
        // Crear 10 círculos
        for (let i = 1; i <= 10; i++) {
            const circle = document.createElement('li');
            circlesContainer.appendChild(circle);
        }
        
        document.body.appendChild(circlesContainer);
    }
    
    // Función para crear el cursor personalizado
    function createMagicCursor() {
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'magic-cursor';
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        
        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        
        const cursorMagic = document.createElement('div');
        cursorMagic.className = 'cursor-magic';
        
        cursorContainer.appendChild(cursorDot);
        cursorContainer.appendChild(cursorRing);
        cursorContainer.appendChild(cursorMagic);
        
        // Contenedor para partículas mágicas
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'magic-particles';
        
        document.body.appendChild(cursorContainer);
        document.body.appendChild(particlesContainer);
        
        // Array para almacenar las partículas
        const particles = [];
        const maxParticles = 15;
        
        // Función para crear una partícula mágica
        function createParticle(x, y) {
            // Limpiar partículas si hay demasiadas
            while (particles.length >= maxParticles) {
                const oldParticle = particles.shift();
                if (oldParticle.element && oldParticle.element.parentNode) {
                    oldParticle.element.parentNode.removeChild(oldParticle.element);
                }
            }
            
            const particle = document.createElement('div');
            particle.className = 'magic-particle';
            
            // Tamaño aleatorio
            const size = Math.random() * 8 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Posición inicial
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Añadir al DOM
            particlesContainer.appendChild(particle);
            
            // Configurar animación
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const distance = Math.random() * 50 + 30;
            const life = Math.random() * 1000 + 500;
            
            // Guardar referencia y propiedades
            const particleObj = {
                element: particle,
                startX: x,
                startY: y,
                angle: angle,
                speed: speed,
                distance: distance,
                life: life,
                born: Date.now()
            };
            
            particles.push(particleObj);
            
            // Mostrar la partícula
            setTimeout(() => {
                particle.style.opacity = Math.random() * 0.5 + 0.5;
            }, 10);
            
            return particleObj;
        }
        
        // Función para actualizar las partículas
        function updateParticles() {
            const now = Date.now();
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                const age = now - p.born;
                
                if (age > p.life) {
                    // Eliminar partícula que terminó su vida
                    p.element.style.opacity = '0';
                    setTimeout(() => {
                        if (p.element && p.element.parentNode) {
                            p.element.parentNode.removeChild(p.element);
                        }
                    }, 100);
                    particles.splice(i, 1);
                    continue;
                }
                
                // Calcular movimiento
                const progress = age / p.life;
                const easing = 1 - Math.pow(1 - progress, 3); // Efecto de desaceleración
                const moveX = Math.cos(p.angle) * p.distance * easing;
                const moveY = Math.sin(p.angle) * p.distance * easing;
                
                // Aplicar movimiento
                p.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                
                // Desvanecer al final
                if (progress > 0.7) {
                    p.element.style.opacity = (1 - (progress - 0.7) / 0.3) * 0.8;
                }
            }
            
            requestAnimationFrame(updateParticles);
        }
        
        // Iniciar animación de partículas
        updateParticles();
        
        // Función para mover el cursor personalizado
        function moveCursor(e) {
            cursorContainer.style.left = e.clientX + 'px';
            cursorContainer.style.top = e.clientY + 'px';
            
            // Crear partículas ocasionalmente (20% de probabilidad)
            if (Math.random() < 0.2) {
                createParticle(e.clientX, e.clientY);
            }
            
            // Verificar si el cursor está cerca del personaje para activar efecto
            const animatedCharacter = document.getElementById('animated-character');
            if (animatedCharacter) {
                const characterRect = animatedCharacter.getBoundingClientRect();
                const characterCenterX = characterRect.left + characterRect.width / 2;
                const characterCenterY = characterRect.top + characterRect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(e.clientX - characterCenterX, 2) + 
                    Math.pow(e.clientY - characterCenterY, 2)
                );
                
                if (distance < 150) {
                    cursorContainer.classList.add('magic-active');
                    
                    // Activar efecto adicional en el personaje
                    const cartoon = animatedCharacter.querySelector('.cartoon');
                    if (cartoon) {
                        cartoon.classList.add('magic-active');
                    }
                    
                    // Crear más partículas cuando está cerca del personaje
                    if (Math.random() < 0.4) {
                        createParticle(e.clientX, e.clientY);
                    }
                } else {
                    cursorContainer.classList.remove('magic-active');
                    
                    // Desactivar efecto en el personaje
                    const cartoon = animatedCharacter.querySelector('.cartoon');
                    if (cartoon) {
                        cartoon.classList.remove('magic-active');
                    }
                }
            }
        }
        
        // Asociar eventos
        document.addEventListener('mousemove', moveCursor);
    }
    
    // Función para crear y agregar el personaje animado
    function createAnimatedCharacter() {
        // Crear contenedor para el personaje
        const characterContainer = document.createElement('div');
        characterContainer.id = 'animated-character';
        
        // Cargar el HTML del personaje (Figuralog.html)
        fetch('../utils/Figuralog.html')
            .then(response => response.text())
            .then(html => {
                characterContainer.innerHTML = html;
                
                // Agregar el personaje al body
                document.body.appendChild(characterContainer);
                
                // Configurar eventos para el personaje
                setupCharacterEvents(characterContainer);
            })
            .catch(error => {
                console.error('Error al cargar el personaje:', error);
            });
    }
    
    // Configurar eventos para el personaje
    function setupCharacterEvents(characterContainer) {
        // Animate character on hover
        characterContainer.addEventListener('mouseenter', function() {
            const cartoon = this.querySelector('.cartoon');
            if (cartoon) {
                cartoon.style.animation = 'tada 1s ease-in-out';
                
                // Crear explosión de partículas
                const rect = cartoon.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const particlesContainer = document.querySelector('.magic-particles');
                if (particlesContainer) {
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            // Crear partícula
                            const particle = document.createElement('div');
                            particle.className = 'magic-particle';
                            
                            // Tamaño aleatorio
                            const size = Math.random() * 8 + 2;
                            particle.style.width = size + 'px';
                            particle.style.height = size + 'px';
                            
                            // Posición inicial
                            const offsetX = Math.random() * 60 - 30;
                            const offsetY = Math.random() * 60 - 30;
                            particle.style.left = (centerX + offsetX) + 'px';
                            particle.style.top = (centerY + offsetY) + 'px';
                            
                            // Añadir al DOM
                            particlesContainer.appendChild(particle);
                            
                            // Animar y eliminar después
                            setTimeout(() => {
                                particle.style.opacity = '0.8';
                                
                                // Movimiento aleatorio
                                const angle = Math.random() * Math.PI * 2;
                                const distance = Math.random() * 50 + 30;
                                const moveX = Math.cos(angle) * distance;
                                const moveY = Math.sin(angle) * distance;
                                
                                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                                
                                setTimeout(() => {
                                    particle.style.opacity = '0';
                                    setTimeout(() => {
                                        if (particle.parentNode) {
                                            particle.parentNode.removeChild(particle);
                                        }
                                    }, 300);
                                }, 500);
                            }, 10);
                        }, i * 50);
                    }
                }
            }
        });
        
        characterContainer.addEventListener('mouseleave', function() {
            const cartoon = this.querySelector('.cartoon');
            if (cartoon) {
                cartoon.style.animation = '';
            }
        });
        
        // Animación adicional para el personaje (cambios aleatorios de posición)
        function randomizeCharacterPosition() {
            const baseX = 2; // Pixeles máximos de movimiento horizontal
            const baseY = 2; // Pixeles máximos de movimiento vertical
            
            const randomX = Math.random() * baseX * 2 - baseX;
            const randomY = Math.random() * baseY * 2 - baseY;
            
            characterContainer.style.marginLeft = randomX + 'px';
            characterContainer.style.marginTop = randomY + 'px';
            
            setTimeout(randomizeCharacterPosition, 1000 + Math.random() * 500);
        }
        
        randomizeCharacterPosition();
    }
});