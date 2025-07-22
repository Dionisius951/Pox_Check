# 🧪 Pox Check – Deteksi Penyakit Kulit dengan AI

Pox Check adalah aplikasi mobile berbasis **React Native (Expo)** yang dirancang untuk mendeteksi jenis penyakit kulit seperti:

- Cacar Air (Chickenpox)
- Cacar Monyet (Monkeypox)
- Jerawat (Acne)
- Campak (Measles)
- Kulit Normal

Aplikasi ini memanfaatkan model **SSD MobileNet V2** untuk melakukan deteksi secara real-time menggunakan kamera ponsel.

---

## 🎯 Latar Belakang

Penyakit kulit sering kali memiliki gejala yang serupa sehingga sulit dibedakan secara visual oleh orang awam. Oleh karena itu, diperlukan sistem pendeteksi otomatis berbasis *deep learning* yang dapat membantu dalam melakukan klasifikasi penyakit kulit secara cepat dan akurat.

---

## 🧠 Model yang Digunakan

- **SSD MobileNet V2**  
  Model deteksi objek ringan dan cepat, cocok untuk implementasi di perangkat mobile dengan performa terbatas.

Model dilatih untuk mendeteksi dan membedakan 5 jenis kondisi kulit secara langsung dari kamera.

---

## ⚙️ Teknologi

- **React Native (Expo)**
- **Vision Camera** – akses kamera secara efisien dan fleksibel
- **fast-tflite** – menjalankan model TensorFlow Lite secara lokal di perangkat
- **vision-camera-resize-plugin** – optimisasi ukuran frame kamera untuk inference real-time

---

## 📲 Fitur Utama

- 📷 Deteksi penyakit kulit secara real-time dari kamera
- ⚡ Proses cepat dan ringan langsung di perangkat (offline)
- 📦 Model terintegrasi menggunakan TensorFlow Lite
- 🎯 Bounding box untuk menandai area yang terdeteksi
- 📱 UI ringan dan mudah digunakan

---

## 🚀 Instalasi & Menjalankan

1. **Clone repo ini**
   ```bash
   git clone https://github.com/Dionisius951/Pox_Check.git
   cd Pox_Check
2. **Install Dependency**
   ```bash
   npm install
3. **Jalankan Server**
   ```bash
   npx expo start
