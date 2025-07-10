// ui-loader.js - VERSI FINAL LEBIH CERDAS (Bisa menangani banyak level folder)

document.addEventListener('DOMContentLoaded', () => {
    
    // Fungsi untuk menghitung kedalaman path
    const getPathPrefix = () => {
        // Hitung jumlah '/' dalam path, kurangi 1
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        if (depth <= 0) {
            return './'; // Jika di root, gunakan ./
        }
        // Ulangi '../' sebanyak kedalaman folder
        return '../'.repeat(depth);
    };

    const pathPrefix = getPathPrefix();

    fetch(`${pathPrefix}assets/data/menu.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal memuat menu.json, status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const mainNav = document.getElementById('main-nav');
            if (!mainNav) return;

            mainNav.innerHTML = '';
            if (!data.menuItems || !Array.isArray(data.menuItems)) {
                console.error('Format data di menu.json salah.');
                return;
            }

            data.menuItems.forEach(item => {
                const link = document.createElement('a');
                // Selalu buat link dari root path agar konsisten
                link.href = `${pathPrefix}${item.link}`;
                link.className = 'nav-link';
                link.id = `nav-${item.id}`;
                link.textContent = item.name;
                mainNav.appendChild(link);
            });
            
            if (typeof setActiveLink === 'function') {
                setActiveLink();
            }
        })
        .catch(error => console.error('Error saat memuat menu:', error));
});