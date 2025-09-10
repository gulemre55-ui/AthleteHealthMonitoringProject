# Gerçek Zamanlı Nabız İzleme Paneli

Bu proje, kalp atış hızını gerçek zamanlı olarak izleyen ve görselleştiren bir web dashboard'udur. Modern web teknolojileri kullanılarak geliştirilmiş olup, responsive tasarımı sayesinde tüm cihazlarda mükemmel çalışır.

## 🚀 Özellikler

### Ana Özellikler
- **Gerçek Zamanlı Nabız İzleme**: 2 saniye aralıklarla güncellenen anlık nabız değeri
- **Dinamik Durum Göstergesi**: Nabız değerine göre renk kodlaması (Düşük/Normal/Yüksek)
- **İnteraktif Grafik Görselleştirme**: Chart.js ile güçlendirilmiş dinamik çizgi grafikleri
- **Çoklu Zaman Aralığı**: Günlük, Haftalık, Aylık ve Yıllık görünümler
- **İstatistiksel Analiz**: En yüksek, ortalama ve en düşük nabız değerleri
- **Responsive Tasarım**: Masaüstü, tablet ve mobil cihazlarda uyumlu

### Görsel Özellikler
- **Modern UI/UX**: Koyu tema ile göz yormayan tasarım
- **Animasyonlar**: Kalp ikonu için nabız animasyonu
- **Renk Kodlaması**: 
  - 🟢 Normal (60-100 BPM): Yeşil
  - 🔴 Yüksek (>100 BPM): Kırmızı  
  - 🔵 Düşük (<60 BPM): Mavi

## 📁 Proje Yapısı

```
GerçekZamanlıNabızPaneli/
│
├── index.html              # Ana dashboard sayfası
├── README.md               # Proje dokümantasyonu
├── PLAN.md                 # Detaylı proje planı
├── css/
│   └── style.css           # Ana stil dosyası
├── js/
│   ├── main.js             # Ana uygulama mantığı
│   ├── chart.js            # Grafik yönetimi
│   └── data.js             # Sahte veri üretimi
```

## 🛠️ Teknolojiler

- **HTML5**: Semantik yapı
- **CSS3**: Modern styling, Flexbox, Grid, Animasyonlar
- **JavaScript (ES6+)**: Modüler kod yapısı
- **Chart.js**: Grafik görselleştirme kütüphanesi

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- HTTP sunucusu (opsiyonel, yerel dosya olarak da çalışır)

### Hızlı Başlangıç

1. **Projeyi İndirin**
   ```bash
   git clone [repository-url]
   cd GerçekZamanlıNabızPaneli
   ```

2. **Tarayıcıda Açın**
   - `index.html` dosyasını doğrudan tarayıcıda açın
   - Veya yerel sunucu kullanın:
   ```bash
   # Python ile
   python -m http.server 8000
   
   # Node.js ile
   npx serve .
   ```

3. **Uygulamayı Kullanın**
   - Tarayıcınızda `http://localhost:8000` adresine gidin
   - Dashboard otomatik olarak gerçek zamanlı simülasyonu başlatacaktır

## 📊 Kullanım

### Zaman Aralığı Seçimi
- **Günlük**: Son 24 saatin saatlik nabız verileri
- **Haftalık**: Son 7 günün günlük ortalama değerleri
- **Aylık**: Ayın her günü için ortalama değerler
- **Yıllık**: 12 ayın aylık ortalama değerleri

### Gerçek Zamanlı İzleme
- Uygulama otomatik olarak 2 saniyede bir yeni nabız değeri üretir
- Anlık değer büyük puntoda görüntülenir
- Durum göstergesi nabız aralığına göre renk değiştirir
- Grafik gerçek zamanlı olarak güncellenir

### İstatistikler
- **En Yüksek**: Seçilen zaman aralığındaki maksimum nabız
- **Ortalama**: Seçilen zaman aralığındaki ortalama nabız
- **En Düşük**: Seçilen zaman aralığındaki minimum nabız

## 🎨 Tasarım Sistemi

### Renk Paleti
```css
/* Ana renkler */
--background: #0a192f      /* Koyu mavi arka plan */
--card-bg: #112240         /* Kart arka planları */
--text: #ccd6f6           /* Ana metin rengi */
--accent: #64ffda         /* Vurgu rengi (teal) */

/* Durum renkleri */
--normal: #64ffda         /* Normal nabız (yeşil-teal) */
--high: #ff6b6b          /* Yüksek nabız (kırmızı) */
--low: #4d96ff           /* Düşük nabız (mavi) */
```

### Responsive Breakpoints
- **Desktop**: > 768px
- **Tablet**: 768px - 481px  
- **Mobile**: ≤ 480px

## 🔧 Geliştirme

### Kod Yapısı

#### main.js
- Ana uygulama mantığı
- Event listener'lar
- Gerçek zamanlı simülasyon
- İstatistik hesaplamaları

#### chart.js
- Chart.js entegrasyonu
- Grafik güncelleme mantığı
- Farklı zaman aralıkları için veri formatlaması

#### data.js
- Sahte veri üretimi
- Gerçekçi nabız değerleri
- Zaman aralığına göre veri formatları

### Özelleştirme

#### Nabız Aralıklarını Değiştirme
```javascript
// data.js dosyasında
function getBpmStatus(bpm) {
    if (bpm < 60) return "low";      // Düşük eşik
    if (bpm > 100) return "high";    // Yüksek eşik
    return "normal";
}
```

#### Güncelleme Sıklığını Değiştirme
```javascript
// main.js dosyasında
simulationInterval = setInterval(() => {
    // Kod...
}, 2000); // 2000ms = 2 saniye
```

## 🧪 Test Edilen Özellikler

✅ **Fonksiyonel Testler**
- Gerçek zamanlı veri güncellemeleri
- Zaman aralığı buton geçişleri
- Grafik veri görselleştirme
- İstatistik hesaplamaları
- Durum renk kodlaması

✅ **Responsive Testler**
- Desktop görünüm (1200px+)
- Tablet görünüm (768px)
- Mobil görünüm (480px)

✅ **UI/UX Testler**
- Kalp animasyonu
- Buton hover efektleri
- Grafik etkileşimleri

## 🚀 Gelecek Geliştirmeler

- [ ] Gerçek IoT cihaz entegrasyonu
- [ ] Kullanıcı hesapları ve veri saklama
- [ ] Nabız hedefleri ve bildirimler
- [ ] Veri dışa aktarma (PDF, CSV)
- [ ] PWA (Progressive Web App) desteği
- [ ] Çoklu dil desteği

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu proje eğitim ve demo amaçlı geliştirilmiştir. Gerçek tıbbi kullanım için uygun değildir.