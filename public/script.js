document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        let html = section.innerHTML;
        const regex = /\{#([0-9a-fA-F]{6}):([^}]+)\}/g;
        html = html.replace(regex, function(match, color, text) {
            return `<span class="highlight" style="border-color:#${color};">${text}</span>`;
        });
        section.innerHTML = html;
    });


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
