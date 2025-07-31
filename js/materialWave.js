const buttons = document.querySelectorAll('.ripple');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        if (document.body.classList.contains('edit-mode')) {
            return;
        }

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.top = y + 'px';
        circle.style.left = x + 'px';

        this.appendChild(circle);
        setTimeout(() => circle.remove(), 500);
    });
});