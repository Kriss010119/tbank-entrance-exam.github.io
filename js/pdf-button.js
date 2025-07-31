document.addEventListener("DOMContentLoaded", () => {
    const printBtn = document.querySelector(".pdf-btn");
    const editBtn = document.querySelector(".edit-btn");
    const resume = document.querySelector(".resume");
    const style = document.createElement('style');

    style.innerHTML = `@media print { .pdf-btn, .edit-btn { display: none !important; } }`;
    document.head.appendChild(style);

    printBtn.addEventListener("click", event => {
        event.preventDefault();
        printBtn.style.display = "none";
        editBtn.style.display = "none";
        window.print();
    }, false);

    resume.addEventListener("click", event => {
        printBtn.style.display = "flex";
        editBtn.style.display = "flex";
    }, false);

}, false);