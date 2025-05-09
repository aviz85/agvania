document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timerDisplay = document.querySelector('.timer-display');
    const taskDisplay = document.querySelector('.task-display');
    const taskInput = document.getElementById('task-input');
    const startBtn = document.getElementById('start-btn');
    const completeBtn = document.getElementById('complete-btn');
    const resetBtn = document.getElementById('reset-btn');
    const streakCount = document.querySelector('.streak-count');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const confettiContainer = document.getElementById('confetti-container');
    const tomato = document.querySelector('.tomato');

    // Variables
    let timeLeft = 20 * 60; // 20 minutes in seconds
    let timerInterval;
    let isRunning = false;
    let streak = 0;
    
    // Audio for timer completion
    const alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    // Encouraging messages
    const encouragingMessages = [
        "Amazing job! You're on fire!",
        "Fantastic work! Keep it up!",
        "Great productivity! You're crushing it!",
        "Impressive! You're ahead of schedule!",
        "Superb work! You're making great progress!"
    ];
    
    const streakMessages = [
        "You're building momentum!",
        "You're on a roll! Keep going!",
        "Consistency is your superpower!",
        "Unstoppable streak! Amazing discipline!",
        "You're breaking records! Incredible focus!"
    ];

    // Functions
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add animation class for last minute
        if (timeLeft <= 60) {
            timerDisplay.classList.add('last-minute');
        } else {
            timerDisplay.classList.remove('last-minute');
        }
    }

    function startTimer() {
        if (isRunning) return;
        
        if (!taskInput.value.trim()) {
            showNotification("Please enter a task first!");
            return;
        }
        
        isRunning = true;
        taskDisplay.textContent = taskInput.value.trim();
        startBtn.disabled = true;
        completeBtn.disabled = false;
        taskInput.disabled = true;
        
        // Add animation classes when timer starts
        timerDisplay.classList.add('ticking');
        tomato.classList.add('running');
        
        // Change background color slightly while running
        document.body.style.backgroundColor = '#f0f0f0';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alarmSound.play();
                showNotification("Time's up! Great work!");
                resetTimer();
            }
        }, 1000);
    }

    function completeEarly() {
        if (!isRunning) return;
        
        clearInterval(timerInterval);
        isRunning = false;
        
        // Increment streak and update display
        streak++;
        streakCount.textContent = `Streak: ${streak}`;
        
        // Add animation class to streak counter
        streakCount.classList.add('increased');
        setTimeout(() => {
            streakCount.classList.remove('increased');
        }, 1000);
        
        // Show confetti and encouraging message
        createConfetti();
        
        // Choose message based on streak
        let message;
        if (streak > 3) {
            message = streakMessages[Math.floor(Math.random() * streakMessages.length)];
        } else {
            message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        }
        
        showNotification(message);
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = 20 * 60;
        updateTimerDisplay();
        startBtn.disabled = false;
        completeBtn.disabled = true;
        taskInput.disabled = false;
        taskDisplay.textContent = "Enter your task";
        
        // Remove animation classes
        timerDisplay.classList.remove('ticking');
        timerDisplay.classList.remove('last-minute');
        tomato.classList.remove('running');
        
        // Reset background color
        document.body.style.backgroundColor = '#f5f5f5';
    }

    function createConfetti() {
        confettiContainer.innerHTML = '';
        
        const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            
            // Random size between 5px and 15px
            const size = 5 + Math.random() * 10;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // Random shape (circle, square, or star)
            const shape = Math.random();
            if (shape > 0.7) {
                confetti.style.borderRadius = '50%';
            } else if (shape > 0.4) {
                confetti.style.borderRadius = '0';
            } else {
                confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            }
            
            confettiContainer.appendChild(confetti);
            
            // Animate falling with wobble effect
            const fallSpeed = 3 + Math.random() * 5;
            const horizontalMovement = Math.random() * 10 - 5; // Random left/right movement
            
            const fallingAnimation = confetti.animate(
                [
                    { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
                    { transform: `translateY(50vh) translateX(${horizontalMovement}vw) rotate(${180 + Math.random() * 180}deg)`, opacity: 0.8 },
                    { transform: `translateY(100vh) translateX(${horizontalMovement * 2}vw) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
                ],
                {
                    duration: fallSpeed * 1000,
                    easing: 'cubic-bezier(0.55, 0, 0.1, 1)'
                }
            );
            
            fallingAnimation.onfinish = () => {
                confetti.remove();
            };
        }
    }

    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        // Animation will handle the removal via keyframes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3500);
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    completeBtn.addEventListener('click', completeEarly);
    resetBtn.addEventListener('click', () => {
        if (isRunning) {
            // Reset streak if timer was active
            streak = 0;
            streakCount.textContent = `Streak: ${streak}`;
        }
        resetTimer();
    });
    
    // Add hover animations
    taskInput.addEventListener('focus', () => {
        tomato.style.transform = 'scale(1.02)';
    });
    
    taskInput.addEventListener('blur', () => {
        tomato.style.transform = 'scale(1)';
    });
    
    // Initialize display
    updateTimerDisplay();
}); 