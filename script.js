// ========================================
// CONFIGURACIÓN INICIAL
// ========================================
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // ELEMENTOS DEL DOM
  // ========================================
  const flower = document.querySelector(".flower__leafs--1");
  const popup = document.querySelector(".general-span");
  const overlay = document.querySelector(".popup-overlay");
  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const musicToggle = document.getElementById("musicToggle");
  const backgroundMusic = document.getElementById("backgroundMusic");
  
  let yesSize = 16;
  let noButtonMoves = 0;
  let musicPlaying = false;

  // ========================================
  // CONTROL DE MÚSICA - AUTOPLAY MEJORADO
  // ========================================
  
  // Configurar volumen inicial bajo para mejor compatibilidad con autoplay
  backgroundMusic.volume = 0.5;

  function startMusic() {
    backgroundMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.classList.add("playing");
      console.log("✅ Música reproduciendo");
    }).catch(e => {
      console.log("⚠️ Autoplay bloqueado - esperando interacción del usuario");
      // Mostrar indicador visual discreto
      musicToggle.style.animation = "pulse-attention 1s infinite";
    });
  }

  // Botón para controlar música manualmente
  musicToggle.addEventListener("click", function() {
    if (musicPlaying) {
      backgroundMusic.pause();
      musicToggle.classList.remove("playing");
      musicToggle.style.animation = "";
      musicPlaying = false;
    } else {
      startMusic();
      musicToggle.style.animation = "";
    }
  });

  // ESTRATEGIA 1: Intentar reproducir inmediatamente al cargar
  setTimeout(() => {
    startMusic();
  }, 1500);

  // ESTRATEGIA 2: Reproducir en CUALQUIER primera interacción del usuario
  const playOnFirstInteraction = () => {
    if (!musicPlaying) {
      startMusic();
    }
  };

  // Escuchar cualquier interacción para activar la música
  document.addEventListener('click', playOnFirstInteraction, { once: true });
  document.addEventListener('touchstart', playOnFirstInteraction, { once: true });
  document.addEventListener('keydown', playOnFirstInteraction, { once: true });

  // ========================================
  // CREAR PÉTALOS DE ROSA
  // ========================================
  function createPetal() {
    const petalsContainer = document.querySelector('.petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Posición horizontal aleatoria
    petal.style.left = Math.random() * 100 + 'vw';
    
    // Duración aleatoria de la animación
    const duration = 10 + Math.random() * 10; // 10-20 segundos
    petal.style.animationDuration = duration + 's';
    
    // Delay aleatorio
    petal.style.animationDelay = Math.random() * 5 + 's';
    
    // Tamaño aleatorio
    const size = 10 + Math.random() * 15;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    petalsContainer.appendChild(petal);
    
    // Eliminar el pétalo después de que termine su animación
    setTimeout(() => {
      petal.remove();
    }, (duration + 5) * 1000);
  }

  // Crear pétalos continuamente
  setInterval(createPetal, 800);
  
  // Crear algunos pétalos iniciales
  for (let i = 0; i < 15; i++) {
    setTimeout(createPetal, i * 200);
  }

  // ========================================
  // SISTEMA DE CONFETTI
  // ========================================
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Confetti {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height / 2;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * -15 - 5;
      this.speedX = Math.random() * 6 - 3;
      this.gravity = 0.3;
      this.colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;
      
      // Dibujar forma de confetti (rectángulo)
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 3);
      
      ctx.restore();
    }
  }

  let confettiArray = [];
  let animationId;

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiArray.forEach((confetti, index) => {
      confetti.update();
      confetti.draw();
      
      // Eliminar confetti que salió de la pantalla
      if (confetti.y > canvas.height + 50) {
        confettiArray.splice(index, 1);
      }
    });

    if (confettiArray.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    }
  }

  function launchConfetti() {
    // Crear confetti desde múltiples puntos
    const points = 5;
    for (let i = 0; i < points; i++) {
      setTimeout(() => {
        for (let j = 0; j < 50; j++) {
          confettiArray.push(new Confetti());
        }
      }, i * 100);
    }
    animateConfetti();
  }

  // ========================================
  // BOTÓN "NO" QUE HUYE (DESKTOP Y MÓVIL)
  // ========================================
  const noMessages = [
    "¿Segura? 🥺",
    "Piénsalo mejor 💭",
    "Dale una oportunidad 💕",
    "No seas así 😢",
    "¡Última chance! 🌹"
  ];

  function moveNoButton() {
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    
    // Calcular nueva posición aleatoria dentro del contenedor
    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;
    
    // Posición más amplia para móvil
    const randomX = Math.random() * Math.min(maxX * 3, 200) - 100;
    const randomY = Math.random() * Math.min(maxY * 3, 100) - 50;
    
    noButton.style.transform = `translate(${randomX}px, ${randomY}px)`;
    noButton.style.transition = 'transform 0.3s ease';
    
    // Cambiar texto del botón
    if (noButtonMoves < noMessages.length) {
      noButton.textContent = noMessages[noButtonMoves];
      noButtonMoves++;
    }
    
    // Hacer el botón "Sí" más grande
    yesSize += 5;
    yesButton.style.fontSize = yesSize + "px";
    yesButton.style.padding = yesSize / 2 + "px " + yesSize + "px";
    
    if (noButtonMoves >= 5) {
      yesButton.classList.add("full-size");
    }
  }

  // DESKTOP: Mover cuando el mouse se acerca
  let isNearButton = false;
  document.addEventListener('mousemove', (e) => {
    if (popup.classList.contains('show')) {
      const rect = noButton.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );
      
      // Si el mouse está a menos de 100px del botón
      if (distance < 100 && !isNearButton) {
        isNearButton = true;
        moveNoButton();
      } else if (distance >= 100) {
        isNearButton = false;
      }
    }
  });

  // MÓVIL: Mover cuando intentan tocarlo
  noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // También mover en click (como backup)
  noButton.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // ========================================
  // BOTÓN "SÍ" - EXPLOSIÓN DE CONFETTI
  // ========================================
  yesButton.addEventListener("click", function () {
    // Lanzar confetti
    launchConfetti();
    
    // Vibrar si está disponible (móvil)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Mostrar mensaje de éxito
    Swal.fire({
      title: "Te quiero mucho! ❤️",
      html: `
        <p style='font-size: 18px; margin-top: 20px; margin-bottom: 25px; line-height: 1.6; color: #555;'>
          Mientras esperas para vernos<br>te dedico estas canciones 🌹✨
        </p>
        <a href="https://www.youtube.com/watch?v=XVhqcmyne2A&list=PL2VQ3KXio_pqlWhqNBqRzASjwgl82SqJw" 
           target="_blank"
           style="
             display: inline-flex;
             align-items: center;
             gap: 12px;
             padding: 16px 32px;
             background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
             color: white;
             text-decoration: none;
             border-radius: 50px;
             font-weight: 700;
             font-size: 17px;
             box-shadow: 0 8px 20px rgba(255, 117, 140, 0.4);
             transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
             margin-top: 10px;
             position: relative;
             overflow: hidden;
           "
           onmouseover="
             this.style.transform='translateY(-3px) scale(1.05)'; 
             this.style.boxShadow='0 12px 28px rgba(255, 117, 140, 0.6)';
           "
           onmouseout="
             this.style.transform='translateY(0) scale(1)'; 
             this.style.boxShadow='0 8px 20px rgba(255, 117, 140, 0.4)';
           ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Escuchar Playlist</span>
          <span style="font-size: 18px;">🎵</span>
        </a>
      `,
      imageUrl: "image.webp",
      imageWidth: 300,
      imageAlt: "Imagen especial",
      confirmButtonText: "¡No puedo esperar! 💕",
      confirmButtonColor: "#ff758c",
      background: "#fff",
      color: "#333",
      backdrop: `
        rgba(255, 192, 203, 0.4)
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext y='50' font-size='50'%3E💕%3C/text%3E%3C/svg%3E")
        left top
        no-repeat
      `
    }).then(() => {
      // Lanzar más confetti al cerrar
      launchConfetti();
    });
  });

  // ========================================
  // ABRIR/CERRAR POPUP
  // ========================================
  flower.addEventListener("click", function () {
    popup.classList.add("show");
    overlay.classList.add("show");
    popup.style.display = "block";
    overlay.style.display = "block";
    
    // Resetear posición del botón "No"
    noButton.style.transform = 'translate(0, 0)';
    noButton.textContent = 'No';
    noButtonMoves = 0;
    
    // ESTRATEGIA 3: Activar música al hacer clic en la flor si no está sonando
    if (!musicPlaying) {
      startMusic();
    }
  });

  overlay.addEventListener("click", function () {
    popup.style.display = "none";
    overlay.style.display = "none";
    popup.classList.remove("show");
    overlay.classList.remove("show");
  });
});