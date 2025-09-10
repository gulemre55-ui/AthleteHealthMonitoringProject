# Gerçek Zamanlı Nabız İzleme Paneli - Planlama Dokümanı

## Proje Özeti

Bu proje, kalp atış hızını ölçen bir cihazdan gelen verileri gerçek zamanlı olarak görselleştiren bir web dashboard'u oluşturmayı amaçlamaktadır. Dashboard, kullanıcı dostu bir arayüz ile anlık nabız değerini ve zaman içindeki değişimleri göstermelidir.

## Proje Yapısı

```
GerçekZamanlıNabızPaneli/
│
├── index.html              # Ana dashboard sayfası
├── css/
│   └── style.css           # Stil dosyaları
├── js/
│   ├── main.js             # Ana JavaScript dosyası
│   ├── chart.js            # Grafik işlemleri
│   └── data.js             # Sahte veri oluşturma
└── assets/                 # Görseller ve diğer varlıklar
    └── icons/
```

## Teknik Gereksinimler

### Frontend Teknolojileri
- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js (grafik görselleştirme için)

### Özellikler

#### 1. Ana Sayfa (Dashboard)
- Sayfanın ortasında büyük puntoda anlık kalp atış hızı (BPM) göstergesi
- Dinamik çizgi grafik (zaman içinde nabız değişimi)
- Zaman aralığı butonları: Günlük, Haftalık, Aylık, Yıllık
- Bilgi kartları: En yüksek, en düşük ve ortalama nabız değerleri
- Renk kodlaması: Normal (yeşil), Yüksek (kırmızı), Düşük (mavi)

#### 2. Veri Sunumu
- Günlük Görünüm: Saatlik veya dakikalık detaylı veriler
- Haftalık Görünüm: Her günün ortalama nabız değeri
- Aylık Görünüm: Her günün ortalama nabız değeri
- Yıllık Görünüm: Her ayın ortalama nabız değeri

#### 3. Gerçek Zamanlı Veri
- WebSocket veya benzeri teknoloji ile gerçek zamanlı veri alımı
- Test amacıyla sahte veri üretimi

## UI/UX Tasarımı

### Renk Paleti
- Ana arka plan: Koyu mavi (#0a192f)
- Kart arka planları: Açık mavi (#112240)
- Metin: Açık gri (#ccd6f6)
- Vurgu renkleri:
  * Normal nabız: Yeşil (#64ffda)
  * Yüksek nabız: Kırmızı (#ff6b6b)
  * Düşük nabız: Mavi (#4d96ff)

### Tipografi
- Başlıklar: 24-48px
- Gövde metni: 16px
- Nabız değeri: 64-96px (çok büyük puntoda)

### Bileşenler
1. **Nabız Göstergesi**
   - Büyük puntoda anlık BPM değeri
   - Nabız simgesi
   - Renkli durum göstergesi

2. **Zaman Aralığı Seçici**
   - 4 buton: Günlük, Haftalık, Aylık, Yıllık
   - Aktif buton vurgulanır

3. **Nabız Grafiği**
   - Çizgi grafik
   - X ekseni: Zaman
   - Y ekseni: BPM değeri
   - Dinamik olarak güncellenir

4. **İstatistik Kartları**
   - En Yüksek BPM
   - En Düşük BPM
   - Ortalama BPM

## Veri Yapısı

### Gerçek Zamanlı Veri Formatı
```json
{
  "timestamp": "2025-08-27T14:30:00Z",
  "bpm": 72,
  "status": "normal" // "low", "normal", "high"
}
```

### Günlük Veri Formatı
```json
[
  {
    "time": "00:00",
    "bpm": 65
  },
  {
    "time": "01:00",
    "bpm": 63
  }
]
```

### Haftalık Veri Formatı
```json
[
  {
    "day": "Pazartesi",
    "avgBpm": 72
  },
  {
    "day": "Salı",
    "avgBpm": 75
  }
]
```

### Aylık Veri Formatı
```json
[
  {
    "date": "2025-08-01",
    "avgBpm": 70
  },
  {
    "date": "2025-08-02",
    "avgBpm": 73
  }
]
```

### Yıllık Veri Formatı
```json
[
  {
    "month": "Ocak",
    "avgBpm": 71
  },
  {
    "month": "Şubat",
    "avgBpm": 74
  }
]
```

## Uygulama Akışı

1. Sayfa yüklendiğinde:
   - UI bileşenleri oluşturulur
   - WebSocket bağlantısı kurulur (veya sahte veri üretimi başlatılır)
   - Varsayılan görünüm (Günlük) yüklenir

2. Gerçek zamanlı veri geldiğinde:
   - Anlık BPM değeri güncellenir
   - Grafik yeni veriyle güncellenir
   - Renk kodlaması uygulanır
   - İstatistikler güncellenir

3. Zaman aralığı butonlarına tıklandığında:
   - İlgili zaman aralığı verisi yüklenir
   - Grafik yeniden çizilir
   - İstatistikler güncellenir

## Test Senaryoları

1. Anlık nabız değerinin doğru görüntülenmesi
2. Grafiklerin doğru çizilmesi ve güncellenmesi
3. Zaman aralığı butonlarının doğru çalışması
4. İstatistik kartlarının doğru hesaplanması
5. Renk kodlamasının doğru uygulanması
6. Sahte veri üretiminin gerçekçi olması

## Geliştirme Aşamaları

1. HTML yapısının oluşturulması
2. CSS stil dosyalarının yazılması
3. Grafik kütüphanesinin entegrasyonu
4. Sahte veri üreticinin yazılması
5. Gerçek zamanlı veri işleme mekanizmasının oluşturulması
6. UI bileşenlerinin entegrasyonu
7. Test ve hata ayıklama
8. Son rafinmanlar ve optimizasyonlar

## Potansiyel Zorluklar ve Çözümler

1. **Gerçek zamanlı veri işleme**: Chart.js ile dinamik grafik güncellemeleri
2. **Farklı zaman aralıklarında veri gösterimi**: Veri formatlarını dönüştürme fonksiyonları
3. **Performans optimizasyonu**: Veri noktalarını sınırlama, gereksiz yeniden çizimleri önleme
4. **Responsive tasarım**: Farklı ekran boyutlarında uyumlu görünüm sağlama

## Ek Geliştirmeler (İsteğe Bağlı)

1. Nabız geçmişi için detaylı raporlar
2. Kullanıcı ayarları (nabız hedefleri, bildirimler)
3. Veri dışa aktarma (PDF, CSV)
4. Mobil uygulama versiyonu