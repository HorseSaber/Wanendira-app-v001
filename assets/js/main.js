// main.js - FASE 3 (FINAL, BERSIH, DAN SUDAH DIAUDIT SEBENARNYA)

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

function buildPrompt() {
    const kutipanInput = document.getElementById('kutipan-input').value;
    const gayaBahasaSelect = document.getElementById('gaya-bahasa-select');
    const gayaVisualSelect = document.getElementById('gaya-visual-select');
    const gayaBahasa = gayaBahasaSelect.options[gayaBahasaSelect.selectedIndex].text;
    const gayaVisual = gayaVisualSelect.options[gayaVisualSelect.selectedIndex].text;

    if (kutipanInput.trim() === '') {
        alert('Kolom kutipan atau ide tidak boleh kosong!');
        return null;
    }

    return `
Anda adalah seorang pria maskulin yang berkelas dan karismatik. Gaya bicaramu tegas, elegan, dan berwibawa—bukan kasar, tapi penuh kendali dan keyakinan. Tugas Anda adalah mengubah kutipan berikut menjadi skrip narasi YouTube Shorts berdurasi maksimal 60 detik.

**KUTIPAN/IDE UTAMA:**
"${kutipanInput}"

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
  "ide_thumbnail": "Kalimat super singkat dan provokatif untuk thumbnail",
  "narasi_segmen": [
    { "segmen": "SEGMENT 01: HOOK MASKULIN", "durasi": "0-5s", "narasi_teks": "Kalimat pembuka super kuat dan menggugah rasa penasaran pria.", "visual_prompt": "Deskripsi visual sinematik sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 02: SETUP REALITA", "durasi": "6-10s", "narasi_teks": "Tunjukkan kenyataan yang biasa dihadapi pria dalam hidup.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 03: PERNYATAAN KUTIPAN", "durasi": "11-17s", "narasi_teks": "Kutipkan ide utama dengan nada dominan dan reflektif.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 04: INTERPRETASI MAKNA", "durasi": "18-25s", "narasi_teks": "Penjelasan atau refleksi singkat dari kutipan tersebut.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 05: ILUSTRASI KONFLIK", "durasi": "26-33s", "narasi_teks": "Tunjukkan realitas pahit atau dilema yang relate dengan pria sejati.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 06: PEMBELAJARAN / SOLUSI", "durasi": "34-43s", "narasi_teks": "Berikan solusi atau nilai kehidupan yang kuat dan to the point.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 07: RESONANSI EMOSIONAL", "durasi": "44-52s", "narasi_teks": "Kalimat klimaks yang menampar atau menyentuh emosi pria modern.", "visual_prompt": "Deskripsi visual sesuai gaya '${gayaVisual}'" },
    { "segmen": "SEGMENT 08: CLOSING & COMMAND", "durasi": "53-60s", "narasi_teks": "Akhiri dengan ajakan tegas (subscribe/follow) yang maskulin dan berkarisma.", "visual_prompt": "Visual subscribe sesuai dengan gaya '${gayaVisual}'" }
  ]
}
    `.trim();
}

function displayResults(data) {
    const outputWrapper = document.getElementById('output-wrapper');
    const outputPlaceholder = document.getElementById('output-placeholder');
    
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
    return `--- JUDUL ---\n${judul}\n\n--- DESKRIPSI ---\n${deskripsi}\n\n--- HASHTAG ---\n${hashtag}\n\n--- TAGS ---\n${tags}\n\n--- IDE THUMBNAIL ---\n${thumbnail}\n\n--- NARASI & PROMPT ---\n${narasiText.trim()}`.trim();
}

// ===============================================
// BAGIAN 2: FUNGSI UTAMA (EVENT LISTENER)
// ===============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA UI UMUM (BERJALAN DI SEMUA HALAMAN) ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const appOverlay = document.getElementById('app-overlay');
    if (menuToggle && sidebar && appOverlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); appOverlay.classList.toggle('visible'); });
        appOverlay.addEventListener('click', () => { sidebar.classList.remove('open'); appOverlay.classList.remove('visible'); });
    }
    const profileToggle = document.getElementById('user-profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileToggle && profileDropdown) { profileToggle.addEventListener('click', () => { profileDropdown.classList.toggle('open'); }); }
    window.addEventListener('click', (e) => { if (profileToggle && profileDropdown && !profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) { profileDropdown.classList.remove('open'); } });
    const apiKeyModal = document.getElementById('api-key-modal');
    const manageApiKeyBtn = document.getElementById('manage-api-key');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    if (manageApiKeyBtn && apiKeyModal) {
        manageApiKeyBtn.addEventListener('click', () => {
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) { apiKeyInput.value = savedApiKey; }
            apiKeyModal.classList.add('open');
        });
    }
    if (closeModalBtn && apiKeyModal) { closeModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('open')); }
    if (apiKeyModal) { apiKeyModal.addEventListener('click', (e) => { if (e.target === apiKeyModal) apiKeyModal.classList.remove('open'); }); }
    if (saveApiKeyBtn && apiKeyInput) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey === '') { alert('API Key tidak boleh kosong!'); return; }
            localStorage.setItem('geminiApiKey', apiKey);
            alert('API Key berhasil disimpan!');
            apiKeyModal.classList.remove('open');
        });
    }
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        const showTab = (tabId) => { tabContents.forEach(c => c.classList.remove('active')); tabLinks.forEach(l => l.classList.remove('active')); const tc = document.getElementById(tabId); const tl = document.querySelector(`.tab-link[data-tab="${tabId}"]`); if (tc && tl) { tc.classList.add('active'); tl.classList.add('active'); } };
        const initialActiveTab = document.querySelector('.tabs .tab-link.active');
        if (initialActiveTab) { showTab(initialActiveTab.dataset.tab); }
        tabLinks.forEach(tab => { tab.addEventListener('click', () => { showTab(tab.dataset.tab); }); });
    }

    // --- LOGIKA KHUSUS HALAMAN GENERATOR ---
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                alert('API Key belum diatur.');
                document.getElementById('api-key-modal')?.classList.add('open');
                return;
            }
            const prompt = buildPrompt();
            if (!prompt) return;

            const outputPlaceholder = document.getElementById('output-placeholder');
            const outputWrapper = document.getElementById('output-wrapper');
            
            outputPlaceholder.innerHTML = `<div class="loading-spinner"></div><p style="margin-top: 1rem; color: var(--text-secondary);">AI sedang berpikir...</p>`;
            outputPlaceholder.style.display = 'flex';
            outputWrapper.style.display = 'none';

            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
                const requestBody = {
                    contents: [{ parts: [{ text: prompt }] }]
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `HTTP error! Status: ${response.status}`);
                }

                const responseData = await response.json();
                
                if (!responseData.candidates || responseData.candidates.length === 0) {
                    throw new Error("AI tidak memberikan jawaban yang valid.");
                }
                
                const text = responseData.candidates[0].content.parts[0].text;
                
                // Blok pembersih JSON
                let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const startIndex = cleanedText.indexOf('{');
                const endIndex = cleanedText.lastIndexOf('}');
                if (startIndex === -1 || endIndex === -1) {
                    throw new Error("Tidak dapat menemukan format JSON yang valid dalam respons AI.");
                }
                cleanedText = cleanedText.substring(startIndex, endIndex + 1);

                const data = JSON.parse(cleanedText);
                
                displayResults(data);
                
            } catch (error) {
                console.error("Error saat menghubungi AI:", error);
                let errorMessage = "Terjadi kesalahan saat memproses jawaban dari AI. Ini mungkin karena format JSON dari AI tidak sempurna. Coba generate lagi.";
                if (error instanceof SyntaxError) {
                    errorMessage = "Error Parsing JSON: " + error.message;
                } else if (error.message) {
                    errorMessage = "Error: " + error.message;
                }
                alert(errorMessage);
                outputPlaceholder.innerHTML = `<p style="color: #ff6b6b;">Gagal memproses jawaban AI. Silakan coba lagi.</p>`;
            }
        });

        // Event Listener untuk Tombol Aksi
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
                } catch (error) {
                    console.error('Gagal men-download file:', error);
                    alert('Gagal men-download file.');
                }
            });
        }
    }
});