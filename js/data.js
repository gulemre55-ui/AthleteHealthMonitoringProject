// Sahte veri oluşturma fonksiyonları

// Anlık nabız değeri için rastgele veri üretici
function generateRandomBpm(playerId = 1) {
    // Sporcu ID'sine göre baz nabız değeri belirle
    const baseBpmByPlayer = {
        1: 72,  // Sporcu 1 - Normal
        2: 68,  // Sporcu 2 - Daha düşük
        3: 75,  // Sporcu 3 - Daha yüksek
        4: 70,  // Sporcu 4 - Normal-düşük
        5: 78,  // Sporcu 5 - Yüksek
        6: 65,  // Sporcu 6 - Düşük
        7: 80,  // Sporcu 7 - Çok yüksek
        8: 73,  // Sporcu 8 - Normal
        9: 69,  // Sporcu 9 - Normal-düşük
        10: 76  // Sporcu 10 - Yüksek
    };

    const baseBpm = baseBpmByPlayer[playerId] || 72; // Varsayılan
    const randomValue = Math.random();

    if (randomValue < 0.7) {
        // %70 olasılıkla normal aralık (baz ±15)
        return Math.floor(Math.random() * 31) + (baseBpm - 15);
    } else if (randomValue < 0.9) {
        // %20 olasılıkla düşük aralık (baz -20 ile baz -5 arası)
        return Math.floor(Math.random() * 16) + (baseBpm - 20);
    } else {
        // %10 olasılıkla yüksek aralık (baz +5 ile baz +25 arası)
        return Math.floor(Math.random() * 21) + (baseBpm + 5);
    }
}

// Nabız durumu belirleyici
function getBpmStatus(bpm) {
    if (bpm < 60) {
        return "low";
    } else if (bpm > 100) {
        return "high";
    } else {
        return "normal";
    }
}

// Son 3 saat için veri üretici - Kaydırılabilir sistem
function generateLast3HoursData() {
    const data = [];
    const now = new Date();
    
    // Son 3 saat için her 2 dakikada bir veri (toplam 90 veri noktası)
    const intervalMinutes = 2;
    const totalHours = 3;
    const totalDataPoints = (totalHours * 60) / intervalMinutes;
    
    for (let i = 0; i < totalDataPoints; i++) {
        // 3 saat öncesinden başlayarak şimdiye kadar
        const time = new Date(now.getTime() - ((totalDataPoints - 1 - i) * intervalMinutes * 60 * 1000));
        
        // Gerçekçi nabız paterni oluştur
        const hour = time.getHours();
        let baseBpm;
        
        // Günün saatine göre gerçekçi nabız değerleri
        if (hour >= 22 || hour <= 6) {
            // Gece: Daha düşük nabız (50-70)
            baseBpm = 50 + Math.random() * 20;
        } else if (hour >= 7 && hour <= 9) {
            // Sabah: Orta seviye (65-85)
            baseBpm = 65 + Math.random() * 20;
        } else if (hour >= 10 && hour <= 17) {
            // Gündüz: Aktif dönem (70-95)
            baseBpm = 70 + Math.random() * 25;
        } else {
            // Akşam: Dinlenme (60-80)
            baseBpm = 60 + Math.random() * 20;
        }
        
        // Küçük rastgele varyasyonlar ekle
        const variation = (Math.random() - 0.5) * 8;
        const bpm = Math.max(45, Math.min(130, Math.round(baseBpm + variation)));
        
        data.push({
            time: time.toISOString(),
            bpm: bpm
        });
    }
    
    return data;
}

// Tam günlük veri için sahte veri üretici - Kaydırılabilir sistem için
function generateDailyData() {
    const data = [];
    const now = new Date();
    
    // Bugünün başından (00:00) şu ana kadar her 2 dakikada bir veri
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const intervalMinutes = 2;
    const currentTime = now.getTime();
    const startTime = startOfDay.getTime();
    const totalMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
    const totalDataPoints = Math.floor(totalMinutes / intervalMinutes) + 1;
    
    for (let i = 0; i < totalDataPoints; i++) {
        const time = new Date(startTime + (i * intervalMinutes * 60 * 1000));
        
        // Gerçekçi günlük nabız paterni oluştur
        const hour = time.getHours();
        let baseBpm;
        
        // Günün saatine göre gerçekçi nabız değerleri
        if (hour >= 22 || hour <= 6) {
            // Gece: Daha düşük nabız (50-70)
            baseBpm = 50 + Math.random() * 20;
        } else if (hour >= 7 && hour <= 9) {
            // Sabah: Orta seviye (65-85)
            baseBpm = 65 + Math.random() * 20;
        } else if (hour >= 10 && hour <= 17) {
            // Gündüz: Aktif dönem (70-95)
            baseBpm = 70 + Math.random() * 25;
        } else {
            // Akşam: Dinlenme (60-80)
            baseBpm = 60 + Math.random() * 20;
        }
        
        // Küçük rastgele varyasyonlar ekle
        const variation = (Math.random() - 0.5) * 8;
        const bpm = Math.max(45, Math.min(130, Math.round(baseBpm + variation)));
        
        data.push({
            time: time.toISOString(),
            bpm: bpm
        });
    }
    
    return data;
}

// Haftalık veri için sahte veri üretici
function generateWeeklyData(playerId = 1) {
    const data = [];
    const now = new Date();

    // Son 7 gün için günlük ortalama veri
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Günlük ortalama için birkaç ölçüm al
        let totalBpm = 0;
        const measurements = 8; // Her gün için 8 ölçüm

        for (let j = 0; j < measurements; j++) {
            totalBpm += generateRandomBpm(playerId);
        }

        const avgBpm = Math.round(totalBpm / measurements);

        data.push({
            date: date.toISOString().split('T')[0], // Sadece tarih kısmı
            day: getDayName(date.getDay()),
            avgBpm: avgBpm
        });
    }

    return data;
}

// Aylık veri için sahte veri üretici
function generateMonthlyData(playerId = 1) {
    const data = [];
    const now = new Date();
    const currentDay = now.getDate();

    // Bu ayın 1. gününden bugüne kadar günlük ortalama veri
    for (let i = 1; i <= currentDay; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);

        // Günlük ortalama için birkaç ölçüm al
        let totalBpm = 0;
        const measurements = 6; // Her gün için 6 ölçüm

        for (let j = 0; j < measurements; j++) {
            totalBpm += generateRandomBpm(playerId);
        }

        const avgBpm = Math.round(totalBpm / measurements);

        data.push({
            date: date.toISOString().split('T')[0],
            day: i,
            dayName: getDayName(date.getDay()),
            monthName: getMonthName(date.getMonth()),
            avgBpm: avgBpm
        });
    }

    return data;
}

// Yıllık veri için sahte veri üretici
function generateYearlyData(playerId = 1) {
    const data = [];
    const now = new Date();
    const currentMonth = now.getMonth();

    // Bu yılın Ocak ayından bu aya kadar aylık ortalama veri
    for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(now.getFullYear(), i, 1);

        // Aylık ortalama için birkaç ölçüm al
        let totalBpm = 0;
        const measurements = 15; // Her ay için 15 ölçüm

        for (let j = 0; j < measurements; j++) {
            totalBpm += generateRandomBpm(playerId);
        }

        const avgBpm = Math.round(totalBpm / measurements);

        data.push({
            month: getMonthName(i),
            date: date.toISOString().split('T')[0],
            avgBpm: avgBpm
        });
    }

    console.log('✅ DEBUG: generateYearlyData tamamlandı, veri sayısı:', data.length);
    return data;
}

// Yardımcı fonksiyonlar
function getDayName(dayIndex) {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[dayIndex];
}

function getMonthName(monthIndex) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthIndex];
}

// Belirli bir tarih için gerçekçi veri üretici (tam gün görünümü + kesintili veri)
function generateDataForDate(selectedDate, intervalMinutes = 10, playerId = 1) {
    console.log('🔍 DEBUG: generateDataForDate çağrıldı, tarih:', selectedDate, 'interval:', intervalMinutes, 'playerId:', playerId);
    const data = [];
    const baseDate = new Date(selectedDate);

    // 00:00'dan 24:00'e kadar her saat için kontrol et
    for (let hour = 0; hour < 24; hour++) {
        // Her saat için %75 şansla veri üret (yani %25 şansla o saat hiç veri yok)
        if (Math.random() < 0.75) {
            // Bu saatte veri üret
            const hourData = generateDataForHour(baseDate, hour, intervalMinutes, playerId);
            data.push(...hourData);
        } else {
            console.log(`🔍 DEBUG: Saat ${hour}:00 için veri üretilmeyecek (cihaz takılı değil)`);
            // Veri olmayan saat için de zaman damgası ekle (grafikte boş görünsün)
            const emptyHourTime = new Date(baseDate);
            emptyHourTime.setHours(hour, 0, 0, 0);
            data.push({
                time: emptyHourTime.toISOString(),
                bpm: null // Chart.js null değerleri boş gösterir
            });
        }
    }

    // Veriyi zamana göre sırala
    data.sort((a, b) => new Date(a.time) - new Date(b.time));

    console.log('🔍 DEBUG: Toplam veri noktası:', data.length);
    return data;
}

// Belirli bir saat için veri üret
function generateDataForHour(baseDate, hour, intervalMinutes, playerId = 1) {
    const data = [];
    const startTime = new Date(baseDate);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(baseDate);
    endTime.setHours(hour + 1, 0, 0, 0);

    const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const totalDataPoints = Math.floor(totalMinutes / intervalMinutes) + 1;

    for (let i = 0; i < totalDataPoints; i++) {
        const time = new Date(startTime.getTime() + (i * intervalMinutes * 60 * 1000));

        // Sporcu bazlı nabız değeri üret
        const bpm = generateRandomBpm(playerId);

        data.push({
            time: time.toISOString(),
            bpm: bpm
        });
    }

    return data;
}

// Veri dizisinden null değerleri temizle (Chart.js için)
function cleanDataForChart(rawData) {
    return rawData.filter(item => item.bpm !== null);
}

// Bugünün 00:00'ından şu ana kadar olan gerçekçi veri üretici (kesintili)
function generateFrom8AMToNowData(intervalMinutes = 10, playerId = 1) {
    console.log('🔍 DEBUG: generateFrom8AMToNowData çağrıldı, interval:', intervalMinutes, 'playerId:', playerId);
    const data = [];
    const now = new Date();
    const currentHour = now.getHours();
    console.log('🔍 DEBUG: Şu anki zaman:', now.toISOString(), 'aktif saat:', currentHour);

    // Bugünün 00:00'ını başlangıç olarak al
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);

    // 00:00'dan aktif saate kadar her saat için kontrol et
    for (let hour = 0; hour <= currentHour; hour++) {
        // Her saat için %80 şansla veri üret (yani %20 şansla o saat hiç veri yok)
        if (Math.random() < 0.80) {
            // Bu saatte veri üret
            const hourData = generateDataForHour(baseDate, hour, intervalMinutes, playerId);
            data.push(...hourData);
        } else {
            console.log(`🔍 DEBUG: Bugün saat ${hour}:00 için veri üretilmeyecek (cihaz çıkarıldı)`);
            // Veri olmayan saat için de zaman damgası ekle (grafikte boş görünsün)
            const emptyHourTime = new Date(baseDate);
            emptyHourTime.setHours(hour, 0, 0, 0);
            data.push({
                time: emptyHourTime.toISOString(),
                bpm: null // Chart.js null değerleri boş gösterir
            });
        }
    }

    // Veriyi zamana göre sırala
    data.sort((a, b) => new Date(a.time) - new Date(b.time));

    console.log('🔍 DEBUG: Bugün için toplam veri noktası:', data.length);
    return data;
}

// Bugünün tüm gününün verisini üret (00:00'den itibaren)
function generateTodayFullData(intervalMinutes = 10) {
    const data = [];
    const now = new Date();

    // Bugünün 00:00'ını başlangıç olarak al
    const startTime = new Date(now);
    startTime.setHours(0, 0, 0, 0);

    // Bugünün 23:59'unu bitiş olarak al
    const endTime = new Date(now);
    endTime.setHours(23, 59, 0, 0);

    const totalMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const totalDataPoints = Math.floor(totalMinutes / intervalMinutes) + 1;

    // Veri sayısı çok fazla ise aralığı artır (max 150 veri noktası)
    const maxDataPoints = 150;
    if (totalDataPoints > maxDataPoints) {
        const newInterval = Math.ceil(totalMinutes / maxDataPoints);
        return generateTodayFullData(newInterval);
    }

    for (let i = 0; i < totalDataPoints; i++) {
        const time = new Date(startTime.getTime() + (i * intervalMinutes * 60 * 1000));

        // Gerçekçi nabız paterni oluştur
        const hour = time.getHours();
        let baseBpm;

        // Günün saatine göre gerçekçi nabız değerleri
        if (hour >= 22 || hour <= 6) {
            // Gece: Daha düşük nabız (50-70)
            baseBpm = 50 + Math.random() * 20;
        } else if (hour >= 7 && hour <= 9) {
            // Sabah: Orta seviye (65-85)
            baseBpm = 65 + Math.random() * 20;
        } else if (hour >= 10 && hour <= 17) {
            // Gündüz: Aktif dönem (70-95)
            baseBpm = 70 + Math.random() * 25;
        } else {
            // Akşam: Dinlenme (60-80)
            baseBpm = 60 + Math.random() * 20;
        }

        // Küçük rastgele varyasyonlar ekle
        const variation = (Math.random() - 0.5) * 8;
        const bpm = Math.max(45, Math.min(130, Math.round(baseBpm + variation)));

        data.push({
            time: time.toISOString(),
            bpm: bpm
        });
    }

    return data;
}

// SVG Avatar oluşturma fonksiyonu
function createAvatarSVG(initials, bgColor, textColor) {
    // Sadece ASCII karakterler kullan
    const cleanInitials = initials.replace(/[^A-Za-z]/g, '').substring(0, 2).toUpperCase();

    // Basit SVG oluştur - daha küçük font ile
    const svgContent = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="25" fill="${bgColor}"/><text x="25" y="30" font-size="12" font-weight="bold" text-anchor="middle" fill="${textColor}">${cleanInitials}</text></svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
}

// Sporcu listesi - Detaylı bilgilerle
const players = [
    {
        id: 1,
        name: "Ahmet Yilmaz",
        age: 25,
        weight: 75,
        position: "Orta Saha",
        avatar: createAvatarSVG("AY", "#64ffda", "#0a192f")
    },
    {
        id: 2,
        name: "Mehmet Kaya",
        age: 28,
        weight: 82,
        position: "Defans",
        avatar: createAvatarSVG("MK", "#4dd0b4", "#0a192f")
    },
    {
        id: 3,
        name: "Caner Erkin",
        age: 22,
        weight: 68,
        position: "Forvet",
        avatar: createAvatarSVG("CE", "#ff6b6b", "#ffffff")
    },
    {
        id: 4,
        name: "Burak Ozkan",
        age: 30,
        weight: 78,
        position: "Kaleci",
        avatar: createAvatarSVG("BO", "#4d96ff", "#ffffff")
    },
    {
        id: 5,
        name: "Emre Demir",
        age: 24,
        weight: 72,
        position: "Orta Saha",
        avatar: createAvatarSVG("ED", "#ff9f43", "#0a192f")
    },
    {
        id: 6,
        name: "Ali Yildiz",
        age: 26,
        weight: 80,
        position: "Defans",
        avatar: createAvatarSVG("AY", "#a29bfe", "#0a192f")
    },
    {
        id: 7,
        name: "Mustafa Celik",
        age: 29,
        weight: 85,
        position: "Forvet",
        avatar: createAvatarSVG("MC", "#fd79a8", "#0a192f")
    },
    {
        id: 8,
        name: "Hakan Sahin",
        age: 27,
        weight: 76,
        position: "Orta Saha",
        avatar: createAvatarSVG("HS", "#00b894", "#ffffff")
    },
    {
        id: 9,
        name: "Omer Koc",
        age: 23,
        weight: 70,
        position: "Forvet",
        avatar: createAvatarSVG("OK", "#e17055", "#ffffff")
    },
    {
        id: 10,
        name: "Kemal Aydin",
        age: 31,
        weight: 83,
        position: "Defans",
        avatar: createAvatarSVG("KA", "#6c5ce7", "#ffffff")
    }
];

// Çoklu sporcu için ayrı çizgiler - veri birleştirme fonksiyonları
function generateMultiPlayerData(dataFunction, playerIds, ...args) {
    if (playerIds.length === 1) {
        // Tek sporcu için normal fonksiyonu çağır
        return dataFunction(...args, playerIds[0]);
    }

    // Çoklu sporcu için her sporcu ayrı veri döndür
    const playerData = playerIds.map(playerId => ({
        playerId: playerId,
        playerData: dataFunction(...args, playerId)
    }));

    return playerData;
}

// Çoklu sporcu için wrapper fonksiyonlar
function generateMultiPlayerFrom8AMToNowData(playerIds, intervalMinutes = 10) {
    return generateMultiPlayerData(generateFrom8AMToNowData, playerIds, intervalMinutes);
}

function generateMultiPlayerDataForDate(playerIds, selectedDate, intervalMinutes = 10) {
    return generateMultiPlayerData(generateDataForDate, playerIds, selectedDate, intervalMinutes);
}

function generateMultiPlayerWeeklyData(playerIds) {
    return generateMultiPlayerData(generateWeeklyData, playerIds);
}

function generateMultiPlayerMonthlyData(playerIds) {
    return generateMultiPlayerData(generateMonthlyData, playerIds);
}

function generateMultiPlayerYearlyData(playerIds) {
    return generateMultiPlayerData(generateYearlyData, playerIds);
}

// Veri oluşturma fonksiyonlarını dışa aktar
window.HeartRateData = {
    generateRandomBpm,
    getBpmStatus,
    generateLast3HoursData,
    generateFrom8AMToNowData,
    generateTodayFullData,
    generateDataForDate,
    generateDailyData,
    generateWeeklyData,
    generateMonthlyData,
    generateYearlyData,
    // Çoklu sporcu fonksiyonları
    generateMultiPlayerFrom8AMToNowData,
    generateMultiPlayerDataForDate,
    generateMultiPlayerWeeklyData,
    generateMultiPlayerMonthlyData,
    generateMultiPlayerYearlyData,
    players
};