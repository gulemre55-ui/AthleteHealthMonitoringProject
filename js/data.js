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
        10: 76, // Sporcu 10 - Yüksek
        11: 71, 12: 74, 13: 67, 14: 79, 15: 66, 16: 81, 17: 69, 18: 75, 19: 68, 20: 77,
        21: 70, 22: 73, 23: 76, 24: 65, 25: 82, 26: 72, 27: 78, 28: 67, 29: 80, 30: 71,
        31: 74, 32: 69, 33: 75, 34: 68, 35: 79, 36: 66, 37: 81, 38: 73, 39: 77, 40: 70,
        41: 76, 42: 65, 43: 82, 44: 72, 45: 78, 46: 67, 47: 80, 48: 71, 49: 74, 50: 69
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
    // Türkçe karakterleri de dahil et
    const cleanInitials = initials.replace(/[^A-Za-zÇçĞğİıÖöŞşÜü]/g, '').substring(0, 2).toUpperCase();

    // Basit SVG oluştur - daha küçük font ile
    const svgContent = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="25" fill="${bgColor}"/><text x="25" y="30" font-size="12" font-weight="bold" text-anchor="middle" fill="${textColor}">${cleanInitials}</text></svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
}

// Sporcu listesi - Detaylı bilgilerle
const players = [
    {
        id: 1,
        name: "Ahmet Yılmaz",
        age: 25,
        weight: 75,
        position: "Orta Saha",
        avatar: createAvatarSVG("AY", "#3b82f6", "#ffffff")
    },
    {
        id: 2,
        name: "Mehmet Kaya",
        age: 28,
        weight: 82,
        position: "Defans",
        avatar: createAvatarSVG("MK", "#1d4ed8", "#ffffff")
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
        name: "Burak Özkan",
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
        name: "Ali Yıldız",
        age: 26,
        weight: 80,
        position: "Defans",
        avatar: createAvatarSVG("AY", "#a29bfe", "#0a192f")
    },
    {
        id: 7,
        name: "Mustafa Çelik",
        age: 29,
        weight: 85,
        position: "Forvet",
        avatar: createAvatarSVG("MÇ", "#fd79a8", "#0a192f")
    },
    {
        id: 8,
        name: "Hakan Şahin",
        age: 27,
        weight: 76,
        position: "Orta Saha",
        avatar: createAvatarSVG("HŞ", "#00b894", "#ffffff")
    },
    {
        id: 9,
        name: "Ömer Koç",
        age: 23,
        weight: 70,
        position: "Forvet",
        avatar: createAvatarSVG("ÖK", "#e17055", "#ffffff")
    },
    {
        id: 10,
        name: "Kemal Aydın",
        age: 31,
        weight: 83,
        position: "Defans",
        avatar: createAvatarSVG("KA", "#6c5ce7", "#ffffff")
    },
    {
        id: 11,
        name: "Serkan Yıldırım",
        age: 26,
        weight: 79,
        position: "Orta Saha",
        avatar: createAvatarSVG("SY", "#ff7675", "#ffffff")
    },
    {
        id: 12,
        name: "Tolga Akın",
        age: 29,
        weight: 81,
        position: "Forvet",
        avatar: createAvatarSVG("TA", "#74b9ff", "#ffffff")
    },
    {
        id: 13,
        name: "Uğurcan Çetin",
        age: 24,
        weight: 77,
        position: "Kaleci",
        avatar: createAvatarSVG("UÇ", "#a29bfe", "#ffffff")
    },
    {
        id: 14,
        name: "Barış Alper",
        age: 27,
        weight: 74,
        position: "Defans",
        avatar: createAvatarSVG("BA", "#fdcb6e", "#0a192f")
    },
    {
        id: 15,
        name: "Furkan Korkmaz",
        age: 23,
        weight: 71,
        position: "Orta Saha",
        avatar: createAvatarSVG("FK", "#e17055", "#ffffff")
    },
    {
        id: 16,
        name: "Mert Günok",
        age: 30,
        weight: 84,
        position: "Kaleci",
        avatar: createAvatarSVG("MG", "#00b894", "#ffffff")
    },
    {
        id: 17,
        name: "Cengiz Ünder",
        age: 25,
        weight: 73,
        position: "Forvet",
        avatar: createAvatarSVG("CÜ", "#6c5ce7", "#ffffff")
    },
    {
        id: 18,
        name: "Okay Yokuşlu",
        age: 28,
        weight: 80,
        position: "Orta Saha",
        avatar: createAvatarSVG("OY", "#fd79a8", "#ffffff")
    },
    {
        id: 19,
        name: "Çağlar Söyüncü",
        age: 26,
        weight: 82,
        position: "Defans",
        avatar: createAvatarSVG("ÇS", "#e84393", "#ffffff")
    },
    {
        id: 20,
        name: "Hakan Çalhanoğlu",
        age: 29,
        weight: 76,
        position: "Orta Saha",
        avatar: createAvatarSVG("HÇ", "#0984e3", "#ffffff")
    },
    {
        id: 21,
        name: "Burak Yılmaz",
        age: 37,
        weight: 87,
        position: "Forvet",
        avatar: createAvatarSVG("BY", "#d63031", "#ffffff")
    },
    {
        id: 22,
        name: "Arda Turan",
        age: 36,
        weight: 78,
        position: "Orta Saha",
        avatar: createAvatarSVG("AT", "#00cec9", "#ffffff")
    },
    {
        id: 23,
        name: "Selçuk İnan",
        age: 38,
        weight: 79,
        position: "Orta Saha",
        avatar: createAvatarSVG("Sİ", "#e17055", "#ffffff")
    },
    {
        id: 24,
        name: "Gökhan Gönül",
        age: 39,
        weight: 75,
        position: "Defans",
        avatar: createAvatarSVG("GG", "#fdcb6e", "#0a192f")
    },
    {
        id: 25,
        name: "Volkan Demirel",
        age: 42,
        weight: 88,
        position: "Kaleci",
        avatar: createAvatarSVG("VD", "#a29bfe", "#ffffff")
    },
    {
        id: 26,
        name: "Semih Kaya",
        age: 32,
        weight: 85,
        position: "Defans",
        avatar: createAvatarSVG("SK", "#00b894", "#ffffff")
    },
    {
        id: 27,
        name: "Ozan Tufan",
        age: 28,
        weight: 74,
        position: "Orta Saha",
        avatar: createAvatarSVG("OT", "#6c5ce7", "#ffffff")
    },
    {
        id: 28,
        name: "Cenk Tosun",
        age: 32,
        weight: 83,
        position: "Forvet",
        avatar: createAvatarSVG("CT", "#fd79a8", "#ffffff")
    },
    {
        id: 29,
        name: "Hasan Ali Kaldırım",
        age: 33,
        weight: 78,
        position: "Defans",
        avatar: createAvatarSVG("HK", "#e84393", "#ffffff")
    },
    {
        id: 30,
        name: "Yunus Mallı",
        age: 31,
        weight: 75,
        position: "Orta Saha",
        avatar: createAvatarSVG("YM", "#0984e3", "#ffffff")
    },
    {
        id: 31,
        name: "Nihat Kahveci",
        age: 33,
        weight: 72,
        position: "Orta Saha",
        avatar: createAvatarSVG("NK", "#d63031", "#ffffff")
    },
    {
        id: 32,
        name: "Emre Belözoğlu",
        age: 43,
        weight: 76,
        position: "Orta Saha",
        avatar: createAvatarSVG("EB", "#00cec9", "#ffffff")
    },
    {
        id: 33,
        name: "Arda Güler",
        age: 18,
        weight: 68,
        position: "Orta Saha",
        avatar: createAvatarSVG("AG", "#e17055", "#ffffff")
    },
    {
        id: 34,
        name: "Kerem Aktürkoğlu",
        age: 24,
        weight: 70,
        position: "Forvet",
        avatar: createAvatarSVG("KA", "#fdcb6e", "#0a192f")
    },
    {
        id: 35,
        name: "Enes Ünal",
        age: 26,
        weight: 78,
        position: "Forvet",
        avatar: createAvatarSVG("EÜ", "#a29bfe", "#ffffff")
    },
    {
        id: 36,
        name: "Orkun Kökçü",
        age: 22,
        weight: 73,
        position: "Orta Saha",
        avatar: createAvatarSVG("OK", "#00b894", "#ffffff")
    },
    {
        id: 37,
        name: "İrfan Can Kahveci",
        age: 27,
        weight: 71,
        position: "Orta Saha",
        avatar: createAvatarSVG("İK", "#6c5ce7", "#ffffff")
    },
    {
        id: 38,
        name: "Abdülkadir Ömür",
        age: 24,
        weight: 69,
        position: "Orta Saha",
        avatar: createAvatarSVG("AÖ", "#fd79a8", "#ffffff")
    },
    {
        id: 39,
        name: "Dorukhan Toköz",
        age: 27,
        weight: 74,
        position: "Orta Saha",
        avatar: createAvatarSVG("DT", "#e84393", "#ffffff")
    },
    {
        id: 40,
        name: "Umut Bozok",
        age: 27,
        weight: 79,
        position: "Forvet",
        avatar: createAvatarSVG("UB", "#0984e3", "#ffffff")
    },
    {
        id: 41,
        name: "Kenan Karaman",
        age: 29,
        weight: 77,
        position: "Forvet",
        avatar: createAvatarSVG("KK", "#d63031", "#ffffff")
    },
    {
        id: 42,
        name: "Halil Dervişoğlu",
        age: 23,
        weight: 75,
        position: "Forvet",
        avatar: createAvatarSVG("HD", "#00cec9", "#ffffff")
    },
    {
        id: 43,
        name: "Efecan Karaca",
        age: 23,
        weight: 72,
        position: "Orta Saha",
        avatar: createAvatarSVG("EK", "#e17055", "#ffffff")
    },
    {
        id: 44,
        name: "İsmail Yüksek",
        age: 24,
        weight: 76,
        position: "Orta Saha",
        avatar: createAvatarSVG("İY", "#fdcb6e", "#0a192f")
    },
    {
        id: 45,
        name: "Salih Özcan",
        age: 25,
        weight: 80,
        position: "Orta Saha",
        avatar: createAvatarSVG("SÖ", "#a29bfe", "#ffffff")
    },
    {
        id: 46,
        name: "Kaan Ayhan",
        age: 28,
        weight: 84,
        position: "Defans",
        avatar: createAvatarSVG("KA", "#00b894", "#ffffff")
    },
    {
        id: 47,
        name: "Zeki Çelik",
        age: 26,
        weight: 78,
        position: "Defans",
        avatar: createAvatarSVG("ZÇ", "#6c5ce7", "#ffffff")
    },
    {
        id: 48,
        name: "Mert Müldür",
        age: 24,
        weight: 76,
        position: "Defans",
        avatar: createAvatarSVG("MM", "#fd79a8", "#ffffff")
    },
    {
        id: 49,
        name: "Rıdvan Yılmaz",
        age: 22,
        weight: 74,
        position: "Defans",
        avatar: createAvatarSVG("RY", "#e84393", "#ffffff")
    },
    {
        id: 50,
        name: "Altay Bayındır",
        age: 25,
        weight: 82,
        position: "Kaleci",
        avatar: createAvatarSVG("AB", "#0984e3", "#ffffff")
    }
];

// DEBUG: Mevcut sporcu sayısını logla
console.log('🔍 DEBUG: Mevcut sporcu sayısı:', players.length);
console.log('🔍 DEBUG: Sporcu ID\'ler:', players.map(p => p.id));

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