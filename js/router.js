let siteVersions = {
    about: 'about',
    contact: 'contact',
    gallery: 'gallery'
};

function RenderDefaultPage() {
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">Hello</h1> 
        <p>Explore to learn more.</p>`;
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">About Me</h1> 
        <p>I am a student and creator of single page application.</p>`;
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery-grid"></div>

        <div id="modal" class="modal hidden">
            <span class="close-button">&times;</span>
            <img class="modal-content" id="modal-image">
        </div>
    `;

    const galleryGrid = document.getElementById('gallery-grid');
    const imageCount = 9;
    const imagesPerRow = 3;
    const rows = [];

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rowIndex = entry.target.dataset.rowIndex;
                const row = rows[rowIndex];
                row.forEach(img => {
                    fetch(img.dataset.src)
                        .then(res => res.blob())
                        .then(blob => {
                            img.src = URL.createObjectURL(blob);
                        });
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    for (let i = 0; i < imageCount; i += imagesPerRow) {
        const rowIndex = i / imagesPerRow;
        const rowContainer = document.createElement('div');
        rowContainer.className = 'images-row';
        
        const rowImages = [];
        for (let j = 0; j < imagesPerRow; j++) {
            const img = document.createElement('img');
            const number = i + j;
            img.dataset.src = `images/img${number}.jpg`;
            img.alt = `Image ${number}`;
            img.className = 'thumbnail';
            rowContainer.appendChild(img);
            rowImages.push(img);
        }
        
        rows[rowIndex] = rowImages;
        rowContainer.dataset.rowIndex = rowIndex;
        galleryGrid.appendChild(rowContainer);
        observer.observe(rowContainer);
    }


    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = modal.querySelector('.close-button');

    galleryGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            modalImg.src = e.target.src;
            modal.classList.remove('hidden');
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function removeBodyContentBelowHeader() {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    const bodyChildren = Array.from(body.children);

    bodyChildren.forEach((child,index) => {
        if (index>2) {
            body.removeChild(child);
        }
    });
}

function createRecaptchaScript() {
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
    script.async = true;
    script.defer = true;

    return script;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = 
    `<h1 class="title">Contact with me</h1>
    <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>

        <div id="g-recaptcha" data-sitekey="6Lfa7x8rAAAAAM5L3eK5ep5-nwjc9tEolUQkrbUp"></div>

        <button type="submit">Send</button>
    </form>`;

    document.querySelector('main').appendChild(createRecaptchaScript());

    const editedForm = document.getElementById('contact-form');

    editedForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = editedForm.name.value.trim();
        const email = editedForm.email.value.trim();
        const message = editedForm.message.value.trim();
        const recaptchaResponse = grecaptcha.getResponse();

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        if (recaptchaResponse.length === 0) {
            alert("Please verify that you are not a robot.");
            return;
        }

        editedForm.reset();
        grecaptcha.reset();
        alert('Form submitted!');
    });
}

function popStateHandler() {
    let loc = window.location.search.substring(1);
    console.log(loc);

    removeBodyContentBelowHeader();     // cleaning after recaptcha
    if (loc === siteVersions.contact) { RenderContactPage(); }
    else if (loc === siteVersions.about) { RenderAboutPage(); }
    else if (loc === siteVersions.gallery) { RenderGalleryPage(); }
    else RenderDefaultPage();
}

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});


window.onpopstate = popStateHandler;  

window.onloadCallback = function () {
    grecaptcha.render('g-recaptcha', {
        sitekey: '6Lfa7x8rAAAAAM5L3eK5ep5-nwjc9tEolUQkrbUp'
    });
};

popStateHandler();