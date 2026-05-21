// Анимациялар және функционал
document.addEventListener('DOMContentLoaded', function() {
    // Hero слайдер
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000);

    // Статистика сандарын анимациялау
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const current = parseInt(stat.innerText);
            const increment = target / 50;
            
            if (current < target) {
                stat.innerText = Math.ceil(current + increment);
                setTimeout(animateStats, 20);
            } else {
                stat.innerText = target;
            }
        });
    }

    // Статистика секциясы көрінгенде анимацияны бастау
    const statsSection = document.querySelector('.stats');
    let animated = false;

    window.addEventListener('scroll', function() {
        if (statsSection && !animated) {
            const statsPosition = statsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (statsPosition < screenPosition) {
                animated = true;
                animateStats();
            }
        }
    });

    // Мобильді мәзір
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('fa-times');
        });
    }

    // Турларды фильтрлеу (егер турлар бетінде болса)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                tourCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Брондау формасы
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Форма деректерін жинау
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Тексеру
            let isValid = true;
            let errors = [];
            
            if (!data.name || data.name.length < 2) {
                isValid = false;
                errors.push('Аты-жөніңізді дұрыс енгізіңіз');
            }
            
            if (!data.email || !data.email.includes('@')) {
                isValid = false;
                errors.push('Email дұрыс енгізілмеген');
            }
            
            if (!data.phone || data.phone.length < 10) {
                isValid = false;
                errors.push('Телефон нөмірі дұрыс енгізілмеген');
            }
            
            if (!data.date) {
                isValid = false;
                errors.push('Күнді таңдаңыз');
            }
            
            if (!data.tour) {
                isValid = false;
                errors.push('Турды таңдаңыз');
            }
            
            if (isValid) {
                // Сәтті жіберу
                showNotification('Тапсырыс сәтті қабылданды!', 'success');
                this.reset();
            } else {
                // Қателерді көрсету
                showNotification(errors.join('\n'), 'error');
            }
        });
    }

    // Хабарландыру көрсету
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Скролл анимациясы
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    function checkAOS() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkAOS);
    checkAOS();

    // Карта (егер map.html бетінде болса)
    function initMap() {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            // Алматы координаттары
            const almaty = { lat: 43.2220, lng: 76.8512 };
            
            // Яндекс картасын қосу
            const map = new ymaps.Map('map', {
                center: [almaty.lat, almaty.lng],
                zoom: 12
            });
            
            // Маркерлерді қосу
            const places = [
                { coords: [43.2220, 76.8512], name: 'TravelEase Office' },
                { coords: [43.2389, 76.9455], name: 'Медеу' },
                { coords: [43.0571, 76.9826], name: 'Шымбұлақ' }
            ];
            
            places.forEach(place => {
                const placemark = new ymaps.Placemark(place.coords, {
                    balloonContent: place.name
                });
                map.geoObjects.add(placemark);
            });
        }
    }

    // Яндекс картасын жүктеу
    if (document.getElementById('map')) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_ключ&lang=ru_RU';
        script.onload = function() {
            ymaps.ready(initMap);
        };
        document.head.appendChild(script);
    }
});

// Анимациялар үшін қосымша стильдер
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s;
        box-shadow: var(--shadow-lg);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: var(--success-color);
    }
    
    .notification.error {
        background: var(--danger-color);
    }
    
    .notification.warning {
        background: var(--warning-color);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        background: white;
        padding: 20px;
        box-shadow: var(--shadow);
    }
    
    .aos-animate {
        animation: fadeInUp 0.6s forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);