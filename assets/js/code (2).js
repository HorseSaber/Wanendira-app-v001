// main.js - FASE 4.6 (FINAL FIX FOR ASPECT RATIO LOGIC)

// ===============================================
// BAGIAN 1: FUNGSI-FUNGSI HELPER (GLOBAL)
// ===============================================
function getPathPrefixForMain() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
}
function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPagePath = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (currentPagePath === linkPath) {
            link.classList.add('active');
        }
    });
    const isAppHomepage = currentPagePath.endsWith('/app.html') || currentPagePath.endsWith('/');
    if (isAppHomepage) {
        const homeLink = document.querySelector(`a[href$="app.html"]`);
        if (homeLink) homeLink.classList.add('active');
    }
}

// ===============================================
// BAGIAN 2: LOGIKA GENERATOR KONTEN YOUTUBE
// ===============================================
function buildPrompt() {
    const kutipanInput = document.getElementById('kutipan-input');
    const gayaBahasaSelect = document.getElementById('gaya-bahasa-select');
    const gayaVisualSelect = document.getElementById('gaya-visual-select');
    if (!kutipanInput || !gayaBahasaSelect || !gayaVisualSelect) return null;
    const kutipanText = kutipanInput.value;
    const gayaBahasa = gayaBahasaSelect.options[gayaBahasaSelect.selectedIndex].text;
    const gayaVisual = gayaVisualSelect.options[gayaVisualSelect.selectedIndex].text;
    if (kutipanText.trim() === '') {
        alert('Kolom kutipan atau ide tidak boleh kosong!');
        return null;
    }
    return `
Kamu adalah seorang pria dewasa, tenang, percaya diri, dan karismatik — berusia sekitar akhir 30-an hingga awal 40-an. Suaramu berat, hangat, dan penuh wibawa, seperti seorang pemimpin berpengalaman yang berbicara dengan tujuan, bukan dengan volume.
Setiap kata yang kamu ucapkan membawa ketegasan, kejelasan, dan pengaruh.
Nada bicaramu tenang tapi memimpin. Kamu tidak perlu membentak untuk didengar — kehadiranmu sudah cukup berbicara.
Gaya bicaramu adalah kombinasi dari kedewasaan seorang gentleman dan ketegasan jalanan. Kamu adalah sosok yang sudah melewati kerasnya hidup, belajar dari itu semua, dan kini berbagi pandangan — bukan untuk pamer, tapi untuk mengangkat mental pria lain.
Kamu sedang menjadi narator untuk video motivasi pendek yang ditujukan bagi pria modern. Jaga gaya bicaramu tetap realistis, padat, dan tegas — tanpa dramatisasi.
Hindari intonasi yang berlebihan. Gunakan jeda, penekanan pada kata-kata penting, dan tempo yang mantap.
Contoh gaya bicara yang diinginkan:
Dominasi tenang seperti CEO dalam rapat penting.
Kejernihan seorang guru bela diri saat menyampaikan satu filosofi hidup.
Intensitas kalem dari detektif noir yang sudah kenyang pengalaman.
Target suara:
100% maskulin
80% tenang
90% otoritatif
80% membumi
20% menyentuh secara emosional.Tugas Anda adalah mengubah kutipan berikut menjadi skrip narasi story telling YouTube Shorts berdurasi maksimal 60 detik.
**KUTIPAN/IDE UTAMA:**
"${kutipanText}"
**GAYA YANG DIMINTA:**
- Gaya bahasa narasi: ${gayaBahasa} (tetap dalam karakter pria maskulin dewasa)
- Gaya visual video: ${gayaVisual}
**FORMAT OUTPUT:**
Hasilkan dalam format JSON valid saja (tanpa markdown). Struktur output terdiri dari:
{
  "judul": "Judul pendek yang kuat, clickbait elegan, dan maksimal 70 karakter.",
  "deskripsi": "Deskripsi singkat, mengandung keyword relevan, dan gaya bicara pria dewasa. Tambahkan ajakan berinteraksi. Maksimal 300 karakter.",
  "hashtag": "3-5 hashtag relevan dalam format #hashtag",
  "tags": "5-10 kata kunci dipisahkan koma",
  "ide_thumbnail": "",
  "narasi_segmen": [
    { "segmen": "SEGMENT 01: HOOK MASKULIN", "durasi": "0-5s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 02: SETUP REALITA", "durasi": "6-10s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 03: PERNYATAAN KUTIPAN", "durasi": "11-17s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 04: INTERPRETASI MAKNA", "durasi": "18-25s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 05: ILUSTRASI KONFLIK", "durasi": "26-33s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 06: PEMBELAJARAN / SOLUSI", "durasi": "34-43s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 07: RESONANSI EMOSIONAL", "durasi": "44-52s", "narasi_teks": "", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 08: CLOSING & COMMAND", "durasi": "53-60s", "narasi_teks": "", "visual_prompt": "Visual subscribe sesuai dengan gaya '${gayaVisual}'" }
  ]
}
    `.trim();
}
function displayResults(data) {
    const outputWrapper = document.getElementById('output-wrapper');
    const outputPlaceholder = document.getElementById('output-placeholder');
    if (!outputWrapper || !outputPlaceholder) return;
    document.getElementById('output-judul').innerText = data.judul || '';
    document.getElementById('output-deskripsi').innerText = data.deskripsi || '';
    document.getElementById('output-hashtag').innerText = data.hashtag || '';
    document.getElementById('output-tags').innerText = data.tags || '';
    document.getElementById('output-thumbnail').innerText = data.ide_thumbnail || '';
    const outputNarasi = document.getElementById('output-narasi');
    outputNarasi.innerHTML = '';
    if (data.narasi_segmen && Array.isArray(data.narasi_segmen)) {
        data.narasi_segmen.forEach(item => {
            const segmentHTML = `<div class="segment"><div class="segment-title">${item.segmen || ''} [${item.durasi || ''}]</div><div class="segment-narasi" contenteditable="true">${item.narasi_teks || ''}</div><div class="segment-prompt" contenteditable="true">${item.visual_prompt || ''}</div></div>`;
            outputNarasi.innerHTML += segmentHTML;
        });
    }
    outputPlaceholder.style.display = 'none';
    outputWrapper.style.display = 'flex';
}
function generateTextForExport() {
    let textToExport = "";
    try {
        const judul = document.getElementById('output-judul').innerText;
        const deskripsi = document.getElementById('output-deskripsi').innerText;
        const hashtag = document.getElementById('output-hashtag').innerText;
        const tags = document.getElementById('output-tags').innerText;
        const thumbnail = document.getElementById('output-thumbnail').innerText;
        let narasiText = "";
        document.querySelectorAll('#output-narasi .segment').forEach(segment => {
            const title = segment.querySelector('.segment-title').innerText;
            const narasi = segment.querySelector('.segment-narasi').innerText;
            const prompt = segment.querySelector('.segment-prompt').innerText;
            narasiText += `${title}\nNarasi: ${narasi}\nVisual Prompt: ${prompt}\n\n`;
        });
        textToExport = `--- JUDUL ---\n${judul}\n\n--- DESKRIPSI ---\n${deskripsi}\n\n--- HASHTAG ---\n${hashtag}\n\n--- TAGS ---\n${tags}\n\n--- IDE THUMBNAIL ---\n${thumbnail}\n\n--- NARASI & PROMPT ---\n${narasiText.trim()}`.trim();
    } catch(e) { console.error("Error saat export teks:", e); }
    return textToExport;
}

// ===============================================
// BAGIAN 3: FUNGSI-FUNGSI UTAMA (EVENT LISTENER)
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // --- UI UMUM ---
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
        profileToggle.addEventListener('click', () => { profileDropdown.classList.toggle('open'); });
    }
    window.addEventListener('click', (e) => { 
        if (profileToggle && profileDropdown && !profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('open');
        } 
    });
    
    // --- MODAL API KEY ---
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
                const input = button.previousElementSibling.querySelector('input');
                if (!keyType || !input) return;
                const apiKey = input.value.trim();
                if (apiKey === '') { alert('API Key tidak boleh kosong!'); return; }
                localStorage.setItem(keyType, apiKey);
                alert(`${keyType.replace('ApiKey', '')} API Key berhasil disimpan!`);
                apiKeyModal.classList.remove('open');
            });
        });
    }

    // --- LOGIKA TAB ---
    const tabsContainers = document.querySelectorAll('.tabs');
    tabsContainers.forEach(container => {
        const tabLinks = container.querySelectorAll('.tab-link');
        const tabWrapper = container.nextElementSibling;
        if (!tabWrapper) return;
        const tabContents = tabWrapper.querySelectorAll('.tab-content');
        const showTab = (tabId) => {
            tabContents.forEach(c => c.classList.remove('active'));
            tabLinks.forEach(l => l.classList.remove('active'));
            const tc = tabWrapper.querySelector(`#${tabId}`);
            const tl = container.querySelector(`.tab-link[data-tab="${tabId}"]`);
            if (tc && tl) { tc.classList.add('active'); tl.classList.add('active'); }
        };
        const initialActiveTab = container.querySelector('.tab-link.active');
        if (initialActiveTab) { showTab(initialActiveTab.dataset.tab); }
        tabLinks.forEach(tab => { tab.addEventListener('click', () => { showTab(tab.dataset.tab); }); });
    });

    // ===============================================
    // --- GENERATOR KONTEN YOUTUBE ---
    // ===============================================
    const youtubeGenerateBtn = document.getElementById('generate-youtube-btn');
    if (youtubeGenerateBtn) {
        youtubeGenerateBtn.addEventListener('click', async () => {
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                alert('API Key Gemini belum diatur. Silakan atur di menu profil.');
                document.getElementById('api-key-modal')?.classList.add('open');
                return;
            }
            const prompt = buildPrompt();
            if (!prompt) return;
            const outputPlaceholder = document.getElementById('output-placeholder');
            const outputWrapper = document.getElementById('output-wrapper');
            if (!outputPlaceholder || !outputWrapper) return;
            outputPlaceholder.innerHTML = `<div class="loading-spinner"></div><p style="margin-top: 1rem; color: var(--text-secondary);">AI sedang berpikir...</p>`;
            outputPlaceholder.style.display = 'flex';
            outputWrapper.style.display = 'none';
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
                const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                    body: JSON.stringify(requestBody),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                if (!responseData.candidates || responseData.candidates.length === 0) { throw new Error("AI tidak memberikan jawaban yang valid."); }
                const text = responseData.candidates[0].content.parts[0].text;
                let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const startIndex = cleanedText.indexOf('{');
                const endIndex = cleanedText.lastIndexOf('}');
                if (startIndex === -1 || endIndex === -1) { throw new Error("Tidak dapat menemukan format JSON yang valid dalam respons AI."); }
                cleanedText = cleanedText.substring(startIndex, endIndex + 1);
                const data = JSON.parse(cleanedText);
                displayResults(data);
            } catch (error) {
                console.error("Error saat menghubungi AI:", error);
                let errorMessage = "Terjadi kesalahan saat memproses jawaban dari AI. Coba generate lagi.";
                if (error instanceof SyntaxError) { errorMessage = "Error Parsing JSON: " + error.message; }
                else if (error.message) { errorMessage = "Error: " + error.message; }
                alert(errorMessage);
                outputPlaceholder.innerHTML = `<p style="color: #ff6b6b;">Gagal memproses jawaban AI. Silakan coba lagi.</p>`;
            }
        });
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = generateTextForExport();
                navigator.clipboard.writeText(textToCopy).then(() => { alert('Semua teks berhasil disalin!'); }).catch(err => { console.error('Gagal menyalin teks: ', err); alert('Gagal menyalin. Coba lagi.'); });
            });
        }
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                try {
                    const textToDownload = generateTextForExport();
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'wanendira_hasil_generate.txt';
                    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToDownload);
                    downloadLink.href = dataUri;
                    downloadLink.click();
                } catch (error) { console.error('Gagal men-download file:', error); alert('Gagal men-download file.'); }
            });
        }
    }

    // ===============================================
    // --- GENERATOR GAMBAR (VERSI PERBAIKAN FINAL) ---
    // ===============================================
    const imageGenerateBtn = document.getElementById('generate-image-btn');
    if (imageGenerateBtn) {
        const promptInput = document.getElementById('prompt-input');
        const negativePromptInput = document.getElementById('negative-prompt-input');
        const numImagesSelect = document.getElementById('num-images-select');
        const aspectRatioSelect = document.getElementById('aspect-ratio-select');
        const resultGrid = document.getElementById('image-result-grid');

        const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

        const generateSingleImage = async (apiKey, userPrompt, negativePrompt, width, height) => {
            const requestBody = { 
                inputs: userPrompt,
                parameters: { width: width, height: height }
            };
            if (negativePrompt) {
                requestBody.parameters.negative_prompt = negativePrompt;
            }
            const response = await fetch(MODEL_URL, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 503) throw new Error(`Model sedang dimuat (Error 503). Ini normal. Coba lagi dalam 1 menit.`);
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }
            return await response.blob();
        };

        imageGenerateBtn.addEventListener('click', async () => {
            const apiKey = localStorage.getItem('huggingfaceApiKey');
            if (!apiKey) {
                alert('API Key Hugging Face belum diatur. Silakan atur di menu profil.');
                document.getElementById('api-key-modal')?.classList.add('open');
                return;
            }

            const userPrompt = promptInput.value.trim();
            const negativePrompt = negativePromptInput.value.trim();
            const numImages = parseInt(numImagesSelect.value, 10);
            const aspectRatio = aspectRatioSelect.value;

            // ==============================================
            // ===== INI ADALAH PERBAIKAN FINAL UNTUK LOGIKA ASPEK RASIO =====
            // ==============================================
            let width = 1024;
            let height = 1024; // Default 1:1

            if (aspectRatio === '16:9') {
                // Landscape: Lebar > Tinggi
                width = 1344;
                height = 768;
            } else if (aspectRatio === '9:16') {
                // Potrait: Tinggi > Lebar
                width = 768;
                height = 1344;
            }
            // Jika 1:1, maka akan menggunakan nilai default 1024x1024

            if (!userPrompt) {
                alert("Prompt utama tidak boleh kosong.");
                return;
            }

            imageGenerateBtn.disabled = true;
            imageGenerateBtn.innerHTML = '<span>🎨</span> Memproses...';
            resultGrid.innerHTML = `
                <div class="output-placeholder" style="grid-column: 1 / -1;">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 1rem; color: var(--text-secondary);">AI sedang menggambar ${numImages} gambar... Harap tunggu.</p>
                </div>
            `;

            try {
                const imagePromises = [];
                for (let i = 0; i < numImages; i++) {
                    imagePromises.push(generateSingleImage(apiKey, userPrompt, negativePrompt, width, height));
                }
                const imageBlobs = await Promise.all(imagePromises);

                resultGrid.innerHTML = ''; 
                imageBlobs.forEach(blob => {
                    const imageUrl = URL.createObjectURL(blob);
                    const imageCard = document.createElement('div');
                    imageCard.className = 'image-card';
                    imageCard.innerHTML = `
                        <img src="${imageUrl}" alt="Generated Image">
                        <div class="image-card-overlay">
                            <div class="image-actions">
                                <a href="${imageUrl}" download="wanendira-image-${Date.now()}.png" class="image-action-btn" title="Download">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                </a>
                            </div>
                        </div>
                    `;
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

});