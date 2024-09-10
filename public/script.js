document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');

    function checkVisibility() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + scrollY;
            const sectionHeight = section.offsetHeight;

            if (scrollY + windowHeight > sectionTop + sectionHeight / 4) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
});
