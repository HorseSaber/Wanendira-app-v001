// main.js - FASE 8.1 (FINAL FIX - All Functions Restored)

// ===============================================
// BAGIAN 1: FUNGSI-FUNGSI HELPER (GLOBAL)
// ===============================================
function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
}
function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPagePath = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (currentPagePath.endsWith(linkPath.substring(linkPath.lastIndexOf('/')))) {
             link.classList.add('active');
        }
    });
    if (currentPagePath.endsWith('/app.html') || currentPagePath.endsWith('/')) {
        const homeLink = document.querySelector('a[href$="app.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // INISIALISASI FUNGSI-FUNGSI SPESIFIK
    // ===============================================
    
    function initGlobalUI() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const appOverlay = document.getElementById('app-overlay');
        if (menuToggle && sidebar && appOverlay) {
            menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); appOverlay.classList.toggle('visible'); });
            appOverlay.addEventListener('click', () => { sidebar.classList.remove('open'); appOverlay.classList.remove('visible'); });
        }
        const profileToggle = document.getElementById('user-profile-toggle');
        const profileDropdown = document.getElementById('profile-dropdown');
        if (profileToggle && profileDropdown) {
            profileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('open');
            });
        }
        window.addEventListener('click', () => { 
            if (profileDropdown && profileDropdown.classList.contains('open')) {
                profileDropdown.classList.remove('open');
            }
        });
        const apiKeyModal = document.getElementById('api-key-modal');
        if (apiKeyModal) {
            const manageApiKeyBtn = document.getElementById('manage-api-key');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const saveApiButtons = apiKeyModal.querySelectorAll('.modal-action-btn');
            if (manageApiKeyBtn) {
                manageApiKeyBtn.addEventListener('click', () => {
                    const geminiKey = localStorage.getItem('geminiApiKey') || '';
                    const hfKey = localStorage.getItem('huggingfaceApiKey') || '';
                    const geminiInput = apiKeyModal.querySelector('#gemini-api-key-input');
                    const hfInput = apiKeyModal.querySelector('#hf-api-key-input');
                    if(geminiInput) geminiInput.value = geminiKey;
                    if(hfInput) hfInput.value = hfKey;
                    apiKeyModal.classList.add('open');
                });
            }
            if (closeModalBtn) { closeModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('open')); }
            apiKeyModal.addEventListener('click', (e) => { if (e.target === apiKeyModal) apiKeyModal.classList.remove('open'); });
            saveApiButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const keyType = button.dataset.keyType;
                    const inputContainer = button.closest('.tab-content');
                    if (!keyType || !inputContainer) return;
                    const input = inputContainer.querySelector('input');
                    if (!input) return;
                    const apiKey = input.value.trim();
                    if (apiKey === '') { alert('API Key tidak boleh kosong!'); return; }
                    localStorage.setItem(keyType, apiKey);
                    alert(`${keyType.replace('ApiKey', '')} API Key berhasil disimpan!`);
                    apiKeyModal.classList.remove('open');
                });
            });
        }
        const tabsContainers = document.querySelectorAll('.tabs');
        tabsContainers.forEach(container => {
            const tabLinks = container.querySelectorAll('.tab-link');
            const tabWrapper = container.nextElementSibling;
            if (!tabWrapper) return;
            const tabContents = tabWrapper.querySelectorAll(':scope > .tab-content');
            const showTab = (tabId) => {
                tabContents.forEach(c => c.classList.remove('active'));
                tabLinks.forEach(l => l.classList.remove('active'));
                const tc = tabWrapper.querySelector(`#${tabId}`);
                const tl = container.querySelector(`.tab-link[data-tab="${tabId}"]`);
                if (tc && tl) { tc.classList.add('active'); tl.classList.add('active'); }
            };
            const initialActiveTab = container.querySelector('.tab-link.active');
            if (initialActiveTab) { showTab(initialActiveTab.dataset.tab); }
            tabLinks.forEach(tab => { tab.addEventListener('click', (e) => { e.preventDefault(); showTab(tab.dataset.tab); }); });
        });
    }

    function initImageGenerator() {
        const imageGeneratorControls = document.getElementById('image-generator-controls');
        if (!imageGeneratorControls) return;

        const promptInput = document.getElementById('prompt-input');
        const negativePromptInput = document.getElementById('negative-prompt-input');
        const promptParts = document.querySelectorAll('.prompt-part');
        const pillButtons = document.querySelectorAll('.pill-btn');

        const populateDropdowns = async () => {
            const pathPrefix = getPathPrefix();
            try {
                const response = await fetch(`${pathPrefix}assets/data/prompt_builder_data.json`);
                if (!response.ok) throw new Error('Gagal memuat data prompt builder.');
                const data = await response.json();
                const fillSelect = (id, items) => {
                    const select = document.getElementById(id);
                    if (!select || !items) return;
                    items.forEach(item => { const option = new Option(item.display, item.value); select.add(option); });
                };
                fillSelect('profesi-select', data.profesi);
                fillSelect('item-select', data.itemUnik);
                fillSelect('outfit-select', data.outfitKhas);
                fillSelect('ekspresi-select', data.ekspresiWajah);
                fillSelect('aksi-select', data.aksi);
                fillSelect('lokasi-select', data.lokasi);
                fillSelect('gaya-visual-select', data.gayaVisual);
            } catch (error) { console.error(error); }
        };
        const buildPromptFromParts = () => {
            const parts = [];
            promptParts.forEach(select => { if (select.value) { parts.push(select.value); } });
            promptInput.value = parts.join(', ');
        };
        populateDropdowns();
        promptParts.forEach(select => { select.addEventListener('change', buildPromptFromParts); });
        pillButtons.forEach(button => {
            button.addEventListener('click', () => {
                const valueToAdd = button.dataset.value;
                if (negativePromptInput.value.trim() === '') {
                    negativePromptInput.value = valueToAdd;
                } else if (!negativePromptInput.value.includes(valueToAdd)) {
                    negativePromptInput.value += `, ${valueToAdd}`;
                }
            });
        });
        
        // =========================================================
        // === BAGIAN YANG HILANG SEBELUMNYA SUDAH DIKEMBALIKAN ===
        // =========================================================
        const imageGenerateBtn = document.getElementById('generate-image-btn');
        const numImagesSelect = document.getElementById('num-images-select');
        const aspectRatioSelect = document.getElementById('aspect-ratio-select');
        const resultGrid = document.getElementById('image-result-grid');
        const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
        
        const generateSingleImage = async (apiKey, finalPrompt, negativePrompt, width, height) => {
            const requestBody = { inputs: finalPrompt, parameters: { width: width, height: height }};
            if (negativePrompt) { requestBody.parameters.negative_prompt = negativePrompt; }
            const response = await fetch(MODEL_URL, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 503) throw new Error(`Model sedang dimuat (Error 503).`);
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }
            return await response.blob();
        };

        if (imageGenerateBtn) {
            imageGenerateBtn.addEventListener('click', async () => {
                const apiKey = localStorage.getItem('huggingfaceApiKey');
                if (!apiKey) {
                    alert('API Key Hugging Face belum diatur.');
                    document.getElementById('api-key-modal')?.classList.add('open');
                    return;
                }
                const finalPrompt = promptInput.value.trim();
                const negativePromptText = negativePromptInput.value.trim();
                const numImages = parseInt(numImagesSelect.value, 10);
                const aspectRatio = aspectRatioSelect.value;
                let width = 1024, height = 1024;
                if (aspectRatio === '16:9') { width = 1344; height = 768; } 
                else if (aspectRatio === '9:16') { width = 768; height = 1344; }
                if (!finalPrompt) { alert("Prompt tidak boleh kosong."); return; }
                imageGenerateBtn.disabled = true;
                imageGenerateBtn.innerHTML = '<span>🎨</span> Memproses...';
                resultGrid.innerHTML = `<div class="output-placeholder" style="grid-column: 1 / -1;"><div class="loading-spinner"></div><p>AI sedang menggambar ${numImages} gambar...</p></div>`;
                try {
                    const imagePromises = [];
                    for (let i = 0; i < numImages; i++) {
                        imagePromises.push(generateSingleImage(apiKey, finalPrompt, negativePromptText, width, height));
                    }
                    const imageBlobs = await Promise.all(imagePromises);
                    resultGrid.innerHTML = ''; 
                    imageBlobs.forEach(blob => {
                        const imageUrl = URL.createObjectURL(blob);
                        const imageCard = document.createElement('div');
                        imageCard.className = 'image-card';
                        imageCard.innerHTML = `<img src="${imageUrl}" alt="Generated Image"><div class="image-card-overlay"><div class="image-actions"><a href="${imageUrl}" download="wanendira-image-${Date.now()}.png" class="image-action-btn" title="Download"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></a></div></div>`;
                        resultGrid.appendChild(imageCard);
                    });
                } catch (error) {
                    console.error('Error saat generate gambar:', error);
                    resultGrid.innerHTML = `<div class="output-placeholder" style="grid-column: 1 / -1; color: #ff6b6b;"><strong>Gagal:</strong> ${error.message}</div>`;
                } finally {
                    imageGenerateBtn.disabled = false;
                    imageGenerateBtn.innerHTML = '<span>🎨</span> Generate Gambar';
                }
            });
        }
    }

    function initDirectorAI() {
        const directorWorkspace = document.querySelector('.director-workspace');
        if (!directorWorkspace) return;

        const charNameInput = document.getElementById('char-name');
        const charGenderSelect = document.getElementById('char-gender');
        const charAppearanceTextarea = document.getElementById('char-appearance');
        const charOutfitTextarea = document.getElementById('char-outfit');
        const characterLockOutput = document.getElementById('character-lock-output');
        if (charNameInput && charGenderSelect && charAppearanceTextarea && charOutfitTextarea && characterLockOutput) {
            const buildCharacterLock = () => {
                const name = charNameInput.value.trim();
                const gender = charGenderSelect.value;
                const appearance = charAppearanceTextarea.value.trim();
                const outfit = charOutfitTextarea.value.trim();
                const parts = [];
                if (appearance || outfit || name) { parts.push(`a ${gender}`); }
                if (appearance) { parts.push(appearance); }
                if (name) { parts.push(`named ${name}`); }
                if (outfit) { parts.push(`wearing ${outfit}`); }
                const resultText = parts.join(', ');
                if (resultText) {
                    characterLockOutput.textContent = resultText;
                } else {
                    characterLockOutput.innerHTML = `<p class="placeholder-text">Kunci Karakter akan terbentuk di sini...</p>`;
                }
            };
            charNameInput.addEventListener('input', buildCharacterLock);
            charGenderSelect.addEventListener('change', buildCharacterLock);
            charAppearanceTextarea.addEventListener('input', buildCharacterLock);
            charOutfitTextarea.addEventListener('input', buildCharacterLock);
        }
        
        const addSceneBtn = document.getElementById('add-scene-btn');
        const sceneListContainer = document.getElementById('scene-list');
        let directorData = null;
        let sceneCounter = 0;
        const loadDirectorData = async () => {
            if (directorData) return directorData;
            try {
                const pathPrefix = getPathPrefix();
                const response = await fetch(`${pathPrefix}assets/data/director_data.json`);
                if (!response.ok) throw new Error(`Gagal memuat data sutradara. Status: ${response.status}`);
                directorData = await response.json();
                return directorData;
            } catch (error) { console.error("Error di loadDirectorData:", error); return null; }
        };
        const createSelectElement = (items) => {
            const select = document.createElement('select');
            select.className = 'control-select';
            select.add(new Option('Pilih...', ''));
            items.forEach(item => select.add(new Option(item.display, item.value)));
            return select;
        };
        const addSceneCard = async () => {
            const data = await loadDirectorData();
            if (!data) { alert('Gagal memuat data yang dibutuhkan untuk membuat adegan. Cek console untuk detail.'); return; }
            sceneCounter++;
            const placeholder = sceneListContainer.querySelector('.placeholder-text');
            if(placeholder) placeholder.remove();
            const card = document.createElement('div');
            card.className = 'scene-card';
            card.innerHTML = `<div class="scene-card-header"><h4 class="scene-card-title">Adegan ${sceneCounter}</h4><button class="delete-scene-btn" title="Hapus Adegan"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></div><div class="form-group"><label class="sub-control-label">Aksi & Setting</label><textarea class="control-textarea scene-action" rows="2" placeholder="Contoh: berlari di pasar malam yang ramai..."></textarea></div><div class="character-sheet-grid"><div class="form-group"><label class="sub-control-label">Jenis Shot</label></div><div class="form-group"><label class="sub-control-label">Sudut Kamera</label></div><div class="form-group"><label class="sub-control-label">Gerakan Kamera</label></div><div class="form-group"><label class="sub-control-label">Gaya Pencahayaan</label></div></div>`;
            const grid = card.querySelector('.character-sheet-grid');
            grid.children[0].appendChild(createSelectElement(data.shotTypes));
            grid.children[1].appendChild(createSelectElement(data.cameraAngles));
            grid.children[2].appendChild(createSelectElement(data.cameraMovements));
            grid.children[3].appendChild(createSelectElement(data.lightingStyles));
            card.querySelector('.delete-scene-btn').addEventListener('click', () => {
                card.remove();
                if(sceneListContainer.childElementCount === 0) {
                    sceneListContainer.innerHTML = `<p class="placeholder-text">Belum ada adegan. Klik tombol di bawah untuk memulai.</p>`;
                }
            });
            sceneListContainer.appendChild(card);
        };
        if(addSceneBtn) { addSceneBtn.addEventListener('click', addSceneCard); }

        const generateStoryboardBtn = document.getElementById('generate-storyboard-btn');
        const finalOutputContainer = document.getElementById('final-output-container');
        if (generateStoryboardBtn) {
            generateStoryboardBtn.addEventListener('click', () => {
                const characterLock = characterLockOutput.textContent.trim();
                const sceneCards = sceneListContainer.querySelectorAll('.scene-card');
                if (!characterLock) { alert('Definisikan Karakter Utama terlebih dahulu di Langkah 1.'); return; }
                if (sceneCards.length === 0) { alert('Buat setidaknya satu adegan di Langkah 3.'); return; }
                finalOutputContainer.innerHTML = '';
                sceneCards.forEach((card) => {
                    const sceneTitle = card.querySelector('.scene-card-title').textContent;
                    const actionText = card.querySelector('.scene-action').value.trim();
                    const selects = card.querySelectorAll('.control-select');
                    const promptParts = [characterLock];
                    if (actionText) promptParts.push(actionText);
                    selects.forEach(select => {
                        if (select.value) { promptParts.push(select.value); }
                    });
                    const finalPrompt = promptParts.join(', ');
                    const resultCard = document.createElement('div');
                    resultCard.className = 'prompt-result-card';
                    resultCard.innerHTML = `<h4 class="scene-card-title">${sceneTitle}</h4><pre>${finalPrompt}</pre>`;
                    finalOutputContainer.appendChild(resultCard);
                });
            });
        }
    }

    // ===============================================
    // EKSEKUSI SCRIPT
    // ===============================================
    initGlobalUI();
    initImageGenerator();
    initDirectorAI();
});