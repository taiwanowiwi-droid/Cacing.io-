Berikut teks yang bisa langsung kamu salin.

**1. Deskripsi repository (kolom "About" di GitHub)**

```
Game cacing arena ala slither.io yang berjalan offline di browser, dibuat dengan HTML, CSS, dan JavaScript murni. Lawan bot, kumpulkan makanan, dan raih skor tertinggi!
```

**2. Topics (tags)**

```
snake-game, worms, slither-io, html5-canvas, javascript, browser-game, game-development, offline-game, vanilla-js, indonesia
```

**3. Isi README.md**

````markdown
# 🐍 Snake Worms

Game cacing arena (terinspirasi dari slither.io) yang berjalan **offline** langsung di browser. Kumpulkan makanan, besarkan cacingmu, dan hindari kepala cacing bot lain. Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa library atau framework).

## ✨ Fitur

- Arena luas (2600 × 2600) dengan kamera yang mengikuti pemain
- 9 cacing bot dengan AI sederhana yang mencari makanan
- Boost kecepatan
- Skor, panjang cacing, dan rekor tertinggi (tersimpan di browser lewat `localStorage`)
- Menu mulai, jeda, dan layar permainan selesai
- Mendukung PC (mouse + keyboard) dan HP (joystick virtual + tombol boost)
- Tampilan responsif

## 🎮 Cara Bermain

| Perangkat | Gerak | Boost |
|-----------|-------|-------|
| PC | Gerakkan mouse untuk mengarahkan | Tahan klik atau tekan spasi |
| HP | Geser joystick di kiri bawah | Tahan tombol BOOST di kanan bawah |

Makan titik berwarna untuk menambah skor dan panjang. Kamu kalah jika kepalamu menabrak tubuh cacing lain.

## 📁 Struktur Proyek

```
snake-worms/
├── index.html   # Struktur halaman (HUD, menu, dialog, canvas)
├── style.css    # Seluruh tampilan dan layout responsif
├── script.js    # Logika game (loop, AI bot, tabrakan, kontrol, skor)
└── README.md    # Dokumentasi proyek
```

| File | Fungsi |
|------|--------|
| `index.html` | Kerangka halaman: canvas game, panel skor, tombol jeda dan suara, joystick, dan layar menu |
| `style.css` | Warna tema, panel HUD, dialog, tombol, joystick, dan aturan untuk layar kecil |
| `script.js` | Membuat cacing dan makanan, menggerakkan pemain dan bot, mendeteksi tabrakan, menggambar ke canvas, serta menangani input mouse, keyboard, dan sentuh |

## 🚀 Menjalankan

**Lokal:** buka `index.html` di browser. Tidak perlu instalasi atau server.

**GitHub Pages:**
1. Upload semua file ke repository.
2. Buka **Settings → Pages**.
3. Pilih branch `main` dan folder `/ (root)`, lalu **Save**.
4. Game bisa dimainkan di `https://username.github.io/nama-repository/`.

## 🔧 Kustomisasi Cepat

Semua pengaturan ada di bagian atas `script.js`:

- `WORLD`: ukuran arena
- `FOOD_MAX`: jumlah makanan di arena
- Jumlah bot: ubah angka `9` pada perulangan di fungsi `reset()`
- Kecepatan: nilai `150` (normal) dan `230` (boost) di fungsi `steer()`
- `colors`: daftar warna cacing dan makanan

## 📝 Catatan

- Fitur suara belum tersedia (tombol masih placeholder).
- Mode multiplayer online belum ada; game saat ini hanya melawan bot.
````
