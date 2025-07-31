class ResumeEditor {
    constructor() {
        this.editBtn = document.querySelector('.edit-btn');
        this.isEditMode = false;
        this.editableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li', 'span',
            '.interest-tag', '.experience-company',
            '.experience-date .date', '.year',
            '.contact-value'
        ];

        this.maxLengths = {
            'h1': 30,
            'h2': 40,
            'h3': 50,
            'h4': 60,
            'h5': 50,
            'p': 200,
            'li': 150,
            'span': 30,
            '.interest-tag': 50,
            '.experience-company': 50,
            '.experience-date .date': 20,
            '.year': 10,
            '.skill-tags': 100,
            '.contact-value': 40
        };

        this.init();
        this.originalContents = new Map();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.applyMaxLengths();
    }

    setupEventListeners() {
        this.editBtn.addEventListener('click', () => this.toggleEditMode());
        document.querySelectorAll('.contact-value').forEach(element => {
            element.addEventListener('blur', (e) => this.updateContactLink(e.target));
        });
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.enableEditing();
        } else {
            this.disableEditing();
        }
    }

    enableEditing() {
        this.editBtn.textContent = 'Сохранить';
        document.body.classList.add('edit-mode');
        this.editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.contentEditable = true;
                element.style.outline = '1px dashed #28D979FF';
            });
        });
    }

    disableEditing() {
        this.editBtn.textContent = 'Редактировать';
        document.body.classList.remove('edit-mode');
        this.editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.contentEditable = false;
                element.style.outline = 'none';
            });
        });
        this.applyMaxLengths();
        this.saveToLocalStorage();
        this.updateContactLinks();
    }

    updateContactLinks() {
        document.querySelectorAll('.contact-value').forEach(element => {
            this.updateContactLink(element);
        });
    }

    updateContactLink(element) {
        const text = element.textContent.trim();
        const parentLink = element.closest('a');

        if (!parentLink) {
            return;
        }
        if (element.textContent.includes('@')) {
            parentLink.href = `mailto:${text}`;
        } else {
            const phoneNumber = text.replace(/\D/g, '');
            parentLink.href = `tel:${phoneNumber}`;
        }
    }

    loadFromLocalStorage() {
        this.editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                const parentId = this.getParentIdentifier(element);
                const key = `${selector}-${parentId}-${index}`;
                const savedContent = localStorage.getItem(key);
                if (savedContent) {
                    element.innerHTML = savedContent;
                    if (selector === '.contact-value') {
                        this.updateContactLink(element);
                    }
                }
            });
        });
    }

    saveToLocalStorage() {
        this.editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                const parentId = this.getParentIdentifier(element);
                const key = `${selector}-${parentId}-${index}`;
                localStorage.setItem(key, element.innerHTML);
            });
        });
    }

    getParentIdentifier(element) {
        let parent = element.parentNode;
        let identifier = '';

        while (parent && parent !== document) {
            if (parent.id) {
                identifier = parent.id + '-' + identifier;
            } else if (parent.className && typeof parent.className === 'string') {
                identifier = parent.className.split(' ')[0] + '-' + identifier;
            }
            parent = parent.parentNode;
        }

        return identifier || 'root';
    }

    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    applyMaxLengths() {
        for (const [selector, maxLength] of Object.entries(this.maxLengths)) {
            document.querySelectorAll(selector).forEach(element => {
                if (element.textContent.length > maxLength) {
                    element.textContent = this.truncateText(element.textContent, maxLength);
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ResumeEditor();
});