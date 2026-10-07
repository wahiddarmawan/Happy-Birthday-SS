# Birthday

Satu proyek website ulang tahun, dengan kode dan aset terpisah untuk setiap slide.

```text
Birthday/
  index.html                 Halaman utama: semua slide tersambung
  serve.cjs                  Server lokal
  shared/
    app.js                   Penghubung keempat slide
    motion.js                Kontrol pemutaran video
    base.css                 Tema dasar dan aksesibilitas
    navigation.html          Satu template navigasi bersama
    favicon.svg
  slides/
    slide1/
      section.html           Konten Slide 1 yang dapat diedit
      index.html             Preview hasil build
      slide1.css
      assets/
    slide2/
      section.html           Konten Slide 2 yang dapat diedit
      index.html             Preview hasil build
      slide2.css
      slide2.js
      assets/
    slide3/
      section.html           Konten Slide 3 yang dapat diedit
      index.html             Preview hasil build
      slide3.css
      slide3.js
      assets/
    slide4/
      section.html           Konten Slide 4 yang dapat diedit
      index.html             Preview hasil build
      slide4.css
      slide4.js
      media.js               Daftar foto dan video
      assets/
```

Jalankan `node build.cjs`, `node check.cjs`, lalu `node serve.cjs` dari folder Birthday. Buka http://localhost:4173.
Gunakan server lokal agar JavaScript modules bekerja; jangan buka langsung melalui file://.

Edit konten pada `slides/slideN/section.html`, lalu jalankan `node build.cjs`. Halaman utama dan empat preview dibuat dari template yang sama sehingga tidak perlu memperbarui teks dua kali. Edit navigasi pada `shared/navigation.html`. Setiap slide menyimpan aturan responsif pada CSS miliknya sendiri; tidak ada lembar override tambahan. Slide 1 memakai tautan HTML asli sehingga tidak memerlukan JavaScript sendiri.

Slide 1 dan Slide 3 memakai gambar dengan teks yang sudah menyatu dalam artwork. Ubah gambar sumber untuk mengganti teks artwork. Daftar galeri Slide 4 dapat diedit di `slides/slide4/media.js`.

Birthday.zip memuat seluruh folder Birthday. Proyek sebelumnya dan arsip sumber tetap tersedia.

Hasil pemeriksaan dan daftar perubahan lengkap tersedia pada `QA-REPORT.md`. Jalankan `node qa-media.cjs` untuk pengujian pengendali media dan fast-start MP4. Untuk uji kegagalan media, jalankan server utama lalu `node qa-failure-server.cjs`; port 4174 sengaja menolak MP4 dan hanya digunakan untuk QA.

## Viewport dan Slide 4
Halaman utama menampilkan satu slide aktif setinggi viewport dinamis (100dvh). Navigasi chapter dan tombol Back/Forward browser mengganti panel. Scroll hanya tersedia di rail memori, bukan halaman. Slide 1 dan 3 mempertahankan seluruh artwork dengan latar penuh dari master yang sama. Slide 4 menggunakan font lokal Nothing You Could Do (lisensi OFL), teks dan kartu poster sesuai referensi, serta enam media asli. Edit daftar judul di slides/slide4/media.js. Poster PNG Slide 3 milik pengguna dipertahankan; footage yang hilang dipulihkan dari arsip asli.

## Navigasi horizontal
Gunakan tombol kiri/kanan di bawah atau tombol keyboard ArrowLeft/ArrowRight untuk berpindah Slides 1–4. Tombol berhenti pada slide pertama/terakhir. Saat fokus berada di rail memori, tombol panah memilih memori; di luar rail, panah mengganti slide. Transisi horizontal menghormati preferensi reduced motion. Toolbar pencarian Slide 4 dihapus sesuai revisi. Hero foto/video memakai contain agar frame dan wajah tidak terpotong.

## Jalankan di VS Code dengan npm

Buka folder Birthday langsung di VS Code. Node.js yang didukung: 20.19+ atau 22.12+ (24 LTS juga didukung). Dari terminal di folder Birthday:

```powershell
npm install
npm run dev
```

Buka http://localhost:5173. Port bersifat strict: jika sedang dipakai, hentikan server lama dengan Ctrl+C sebelum memulai server lain.

```powershell
npm run build
npm run preview
```

Build berada di dist; preview production menggunakan http://localhost:4175. npm run check memeriksa source/path dan npm run qa:media memeriksa playback serta integritas footage.

Edit slides/slideN/section.html, slideN.css, slideN.js, dan media.js Slide 4. Vite mengompilasi template saat startup/build dan memuat ulang perubahan template. Halaman index.html merupakan hasil generator. Shared controller tetap shared/app.js; style bersama shared/base.css; aset asli tetap pada slide masing-masing. Struktur yang ada dipertahankan untuk memenuhi permintaan perubahan minimal dan tidak membuat proyek bersarang. Dokumen baru berada di docs/. node_modules dan dist bukan bagian source delivery; jangan masukkan ke Git. Tidak ada ZIP baru.

Referensi konfigurasi: [Vite guide](https://vite.dev/guide/) dan [multi-page production build](https://vite.dev/guide/build#multi-page-app).
