// 1. DEFINICIÓN DE DATOS
const LORENA_DATA = { 
    titulo: "Antonio de la Rosa Miranda", 
    logros: ["Excelencia en el servicio.", "Innovación automotriz.", "Atención personalizada.", "Calidad garantizada."] 
};

const PERSONAL_IMGS = ['agencia1', 'agencia2', 'agencia3']; 

const CONFIG = { 
    schoolName: "TOP CARS SHOP", 
    siteUrl: window.location.href, 
    allowedExt: ['.jpg', '.jpeg', '.png', '.webp', '.JPG'] 
};

const ALUMNOS = ["", "", "", "", ""]; 

let currentPersonalIdx = 0, photoSources = [], audioIniciado = false, himnoMutedManual = false;

// 2. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('lorena-title');
    if(title) title.textContent = LORENA_DATA.titulo;
    
    const list = document.getElementById('lorena-logros');
    if(list) {
        list.innerHTML = ''; 
        LORENA_DATA.logros.forEach(l => { 
            const p = document.createElement('p'); 
            p.textContent = l; 
            list.appendChild(p); 
        });
    }
    
    loadProfilePhoto('1');
    loadCarouselPhoto(0);
    
    const qrImg = document.getElementById('qr-code-img');
    if(qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONFIG.siteUrl)}`;
    
    const DIARY_PHOTOS = [];
    [2, 3, 4, 5, 'poster'].forEach((val, idx) => {
        DIARY_PHOTOS.push({ id: val, baseName: val.toString(), caption: ALUMNOS[idx] || "" });
    });
    loadAllPhotos(DIARY_PHOTOS);
});

// 3. LÓGICA DE CARGA ROBUSTA
function loadProfilePhoto(name) {
    const imgEl = document.getElementById('profile-pic-img');
    tryLoadAnyExt(name, (path) => { if(imgEl) imgEl.src = path; });
}

function loadCarouselPhoto(idx) {
    const imgEl = document.getElementById('main-personal-img');
    tryLoadAnyExt(PERSONAL_IMGS[idx], (path) => { if(imgEl) imgEl.src = path; });
}

function tryLoadAnyExt(baseName, callback) {
    let extIdx = 0;
    const tryNext = () => {
        if (extIdx >= CONFIG.allowedExt.length) return;
        const path = `assets/imagenes/${baseName}${CONFIG.allowedExt[extIdx]}`;
        const img = new Image();
        img.onload = () => callback(path);
        img.onerror = () => { extIdx++; tryNext(); };
        img.src = path;
    };
    tryNext();
}

function loadAllPhotos(photosArray) {
    let loadedCount = 0;
    photosArray.forEach((item, index) => {
        tryLoadAnyExt(item.baseName, (src) => {
            photoSources[index] = { src: src || 'assets/imagenes/logo.png', item: item };
            loadedCount++;
            if (loadedCount === photosArray.length) renderJournal();
        });
    });
}

// 4. INTERFAZ Y NAVEGACIÓN (CORREGIDA SIN QUITAR LÍNEAS)
function renderJournal() {
    const p1 = document.getElementById('panel-1');
    const p2 = document.getElementById('panel-2');
    if(!p1 || !p2) return;
    p1.innerHTML = ''; p2.innerHTML = '';
    
    photoSources.forEach((data) => {
        const photoDiv = document.createElement('div');
        if (data.item.id === 'poster') {
            photoDiv.className = `photo-note promo-container`;
            photoDiv.innerHTML = `<img src="${data.src}" alt="Promo">`;
            p2.appendChild(photoDiv);
        } else {
            photoDiv.className = `photo-note`;
            photoDiv.innerHTML = `<img src="${data.src}" alt="img">`;
            p1.appendChild(photoDiv);
        }
        photoDiv.onclick = () => { openLightbox(data); };
    });
}

function enterAnuario() { 
    // CORRECCIÓN: Usamos la clase CSS de fuerza bruta
    document.getElementById('portada-lorena').classList.add('hidden-portada'); 
    document.getElementById('journal-layout').style.display = 'flex'; 
    window.scrollTo(0, 0);
    playClick(); 
}

function regresarAPortada() { 
    document.getElementById('portada-lorena').classList.remove('hidden-portada'); 
    document.getElementById('journal-layout').style.display = 'none'; 
    window.scrollTo(0, 0);
    playClick(); 
}

function openLightbox(data) {
    activarAudioFondo();
    document.getElementById('lightbox-image').src = data.src;
    document.getElementById('zoom-text').textContent = data.item.caption; 
    document.getElementById('lightbox').style.display = 'flex';
    playClick();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function changePersonalPhoto(dir) {
    playClick();
    currentPersonalIdx = (currentPersonalIdx + dir + PERSONAL_IMGS.length) % PERSONAL_IMGS.length;
    loadCarouselPhoto(currentPersonalIdx);
}

// 5. AUDIO Y UTILIDADES
function playClick() { 
    const snd = document.getElementById('sndFxClick'); 
    if (snd) { snd.currentTime = 0; snd.play().catch(()=>{}); } 
}

function activarAudioFondo() { 
    const himno = document.getElementById('sndFondoLoop'); 
    if (!audioIniciado && !himnoMutedManual && himno) { 
        himno.play().then(() => { audioIniciado = true; }).catch(e => {}); 
    } 
}

function toggleMuteHimno() { 
    const himno = document.getElementById('sndFondoLoop'); 
    if(!himno) return; 
    activarAudioFondo(); 
    himnoMutedManual = !himnoMutedManual; 
    himno.muted = himnoMutedManual; 
    document.getElementById('mute-text').textContent = himnoMutedManual ? "MÚSICA / OFF" : "MÚSICA / ON"; 
    document.getElementById('mute-icon').className = himnoMutedManual ? "fas fa-volume-mute" : "fas fa-music"; 
}

async function shareExperienceRobust() { 
    playClick(); 
    try { 
        await navigator.share({title: 'TOP CARS SHOP', url: window.location.href}); 
    } catch(e) { 
        alert("Enlace copiado al portapapeles."); 
    } 
}

function openMarketing() { 
    activarAudioFondo(); 
    document.getElementById('marketing-modal').style.display = 'flex'; 
    playClick(); 
}

function closeMarketing() { 
    document.getElementById('marketing-modal').style.display = 'none'; 
}