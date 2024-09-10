document.addEventListener("DOMContentLoaded", function() {
    const isMobile = window.innerWidth <= 768;
    const background = document.getElementById('background');
    const maxObjects = isMobile ? 8 : 20;
    const spawnInterval = isMobile ? 800 : 300;
    const recentPositions = [];
    const recentImages = [];
    const maxRecent = 5;
    const minDistance = isMobile ? 10 : 100;
    let lastSpawnTime = 0;

    function getRandomImage() {
        const images = [
            'animation/1.png',
            'animation/2.png',
            'animation/3.png',
            'animation/4.png',
            'animation/5.png',
            'animation/6.png',
            'animation/7.png',
            'animation/8.png',
            'animation/9.png',
            'animation/10.png',
            'animation/11.png',
            'animation/12.png',
            'animation/13.png',
            'animation/14.png'
        ];
        
        let randomImage;
        do {
            randomImage = images[Math.floor(Math.random() * images.length)];
        } while (recentImages.includes(randomImage));

        recentImages.push(randomImage);
        if (recentImages.length > maxRecent) {
            recentImages.shift();
        }

        return randomImage;
    }

    function createFallingObject() {
        if (document.querySelectorAll('.falling-object').length >= maxObjects) {
            console.warn('Maximum objects reached');
            return;
        }

        const img = document.createElement('img');
        img.src = getRandomImage();
        img.classList.add('falling-object');
        img.style.width = Math.random() * 40 + 45 + 'px';
        img.style.height = img.style.width;
        img.style.opacity = Math.random() * 0.5 + 0.5;

        const screenWidth = window.innerWidth;
        let left, top;

        let validPosition = false;
        const maxAttempts = 100;
        let attempts = 0;

        while (!validPosition && attempts < maxAttempts) {
            left = Math.random() * (screenWidth - parseInt(img.style.width));
            top = -parseInt(img.style.height);
            validPosition = true;

            for (const pos of recentPositions) {
                const distance = Math.sqrt(Math.pow(left - pos.left, 2) + Math.pow(top - pos.top, 2));
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn('Failed to find a valid position for the object');
            return;
        }

        img.style.left = left + 'px';
        img.style.top = top + 'px';

        recentPositions.push({ left, top });
        if (recentPositions.length > maxRecent) {
            recentPositions.shift();
        }

        background.appendChild(img);

        const animationDuration = Math.random() * 5 + 5 + 's';
        img.style.animation = `fall ${animationDuration} linear`;

        img.addEventListener('animationend', () => {
            console.log('Object removed');
            img.remove();
        });
    }

    function spawnObjects() {
        const currentTime = Date.now();
        if (currentTime - lastSpawnTime >= spawnInterval) {
            createFallingObject();
            lastSpawnTime = currentTime;
        }
        setTimeout(spawnObjects, spawnInterval);
    }

    spawnObjects();
});
