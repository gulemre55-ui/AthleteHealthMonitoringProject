// Grafik işlemleri

class HeartRateChart {
    constructor() {
        this.chart = null;
        this.currentRange = 'daily';
        this.currentInterval = 10; // Varsayılan interval (dakika)
        this.initChart();
    }

    initChart() {
        console.log('🔍 DEBUG: initChart() fonksiyonu çağrıldı');

        // Chart.js kütüphanesinin yüklenip yüklenmediğini kontrol et
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js kütüphanesi henüz yüklenmedi. Tekrar denenecek...');
            // 100ms sonra tekrar dene
            setTimeout(() => this.initChart(), 100);
            return;
        }
        console.log('✅ DEBUG: Chart.js kütüphanesi yüklendi');

        const canvasElement = document.getElementById('heartRateChart');
        console.log('🔍 DEBUG: Canvas elementi:', canvasElement);

        if (!canvasElement) {
            console.error('❌ DEBUG: heartRateChart canvas elementi bulunamadı!');
            return;
        }

        const ctx = canvasElement.getContext('2d');
        console.log('🔍 DEBUG: Canvas context:', ctx);
        console.log('🔍 DEBUG: Canvas element boyutları:', canvasElement.offsetWidth, 'x', canvasElement.offsetHeight);

        console.log('🔍 DEBUG: Chart oluşturma başlatılıyor...');
        console.log('🔍 DEBUG: ChartZoom plugin kaldırıldı (test için)');

        try {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Nabız (BPM)',
                        data: [],
                        borderColor: '#64ffda',
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#64ffda',
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        fill: true,
                        tension: 0.4
                    }]
                },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                spanGaps: false, // Null değerler arasında çizgi çekme
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#ccd6f6',
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 34, 64, 0.9)',
                        titleColor: '#64ffda',
                        bodyColor: '#ccd6f6',
                        borderColor: '#233554',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                // Aylık görünüm için özel tooltip başlığı
                                if (context[0] && context[0].label && context[0].label.includes(' ')) {
                                    return context[0].label; // "1 Ağustos Pazartesi" formatında
                                }
                                return context[0].label;
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return `${datasetLabel}: ${value} BPM`;
                            }
                        }
                    }
                    // Zoom plugin geçici olarak kaldırıldı
                    /*
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: null,
                            threshold: 10, // Minimum hareket miktarı
                            onPanStart: function(context) {
                                console.log('Pan başladı');
                                // Pan başladığında cursor'ı değiştir
                                context.chart.canvas.style.cursor = 'grabbing';
                            },
                            onPanComplete: function(context) {
                                console.log('Pan tamamlandı');
                                // Pan tamamlandığında cursor'ı geri getir
                                context.chart.canvas.style.cursor = 'grab';
                            }
                        },
                        zoom: {
                            wheel: {
                                enabled: false,
                            },
                            pinch: {
                                enabled: false
                            },
                            mode: 'x',
                        },
                        limits: {
                            x: {min: 'original', max: 'original'}
                        }
                    }
                    */
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(35, 53, 84, 0.5)'
                        },
                        ticks: {
                            color: '#8892b0',
                            maxTicksLimit: 20, // Daha fazla etiket göster
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 0
                        },
                        type: 'category',
                        offset: true
                    },
                    y: {
                        grid: {
                            color: 'rgba(35, 53, 84, 0.5)'
                        },
                        ticks: {
                            color: '#8892b0'
                        },
                        min: 40,
                        max: 160,
                        beginAtZero: false
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            },
                // plugins: [window.ChartZoom] // Zoom plugin geçici olarak kaldırıldı
            });

            console.log('✅ DEBUG: Chart başarıyla oluşturuldu:', this.chart);

        } catch (error) {
            console.error('❌ DEBUG: Chart oluşturma hatası:', error);
            return;
        }
    }

    updateChartData(data, range, selectedDate = null, intervalMinutes = 10, selectedPlayers = []) {
        this.currentRange = range;
        this.currentInterval = intervalMinutes;

        console.log('🔍 DEBUG: updateChartData çağrıldı', {
            range,
            selectedDate,
            intervalMinutes,
            selectedPlayersCount: selectedPlayers.length,
            dataType: Array.isArray(data) ? 'array' : typeof data
        });

        // Çoklu sporcu verisi için datasets oluştur
        if (selectedPlayers.length > 1 && Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('playerData')) {
            // Çoklu sporcu: Her sporcu için ayrı dataset
            this.updateMultiPlayerChartData(data, range, selectedDate, intervalMinutes, selectedPlayers);
        } else {
            // Tek sporcu veya eski format: Tek dataset
            this.updateSinglePlayerChartData(data, range, selectedDate, intervalMinutes, selectedPlayers);
        }
    }

    updateSinglePlayerChartData(data, range, selectedDate, intervalMinutes, selectedPlayers = []) {
        let labels = [];
        let values = [];

        switch(range) {
            case 'daily':
                labels = data.map(item => {
                    const date = new Date(item.time);
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                });
                values = data.map(item => item.bpm);

                // Orijinal veriyi sakla (kaydırma için gerekli)
                this.originalData = {
                    labels: [...labels],
                    data: [...values]
                };
                break;

            case 'weekly':
                labels = data.map(item => item.day);
                values = data.map(item => item.avgBpm);
                break;

            case 'monthly':
                labels = data.map(item => `${item.day} ${item.monthName} ${item.dayName}`);
                values = data.map(item => item.avgBpm);
                break;

            case 'yearly':
                labels = data.map(item => item.month);
                values = data.map(item => item.avgBpm);
                break;
        }

        // Seçili sporcunun adını al (tek sporcu için)
        const selectedPlayer = selectedPlayers.length > 0 ? selectedPlayers[0] : null;
        const label = selectedPlayer ? selectedPlayer.name : 'Nabız (BPM)';

        // Chart'ı tek dataset ile güncelle
        this.chart.data.labels = labels;
        this.chart.data.datasets = [{
            label: label,
            data: values,
            borderColor: '#64ffda',
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#64ffda',
            pointRadius: 2,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.4
        }];

        // Legend'ı aktif et (tek sporcu için de)
        this.chart.options.plugins.legend.display = true;

        // Günlük görünümde 8 saatlik pencere sistemi
        if (range === 'daily') {
            this.chart.update();
            console.log('🔍 DEBUG: Günlük veri chart\'a yüklendi, şimdi enableFullDataScrolling çağrılıyor...');
            this.enableFullDataScrolling(selectedDate);
        } else {
            this.chart.update();
            this.resetChartWidth();
        }
    }

    updateMultiPlayerChartData(data, range, selectedDate, intervalMinutes, selectedPlayers) {
        console.log('🔍 DEBUG: Çoklu sporcu chart güncellemesi başladı');

        // Renk paleti
        const colors = [
            '#64ffda', // Yeşil-mavi
            '#ff6b6b', // Kırmızı
            '#4d96ff', // Mavi
            '#ff9f43', // Turuncu
            '#a29bfe', // Mor
            '#fd79a8', // Pembe
            '#00b894', // Yeşil
            '#e17055', // Kırmızı-turuncu
            '#6c5ce7', // Lacivert
            '#fdcb6e'  // Sarı
        ];

        // Labels'ı ilk sporcudan al
        let labels = [];
        switch(range) {
            case 'daily':
                labels = data[0].playerData.map(item => {
                    const date = new Date(item.time);
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                });
                break;
            case 'weekly':
                labels = data[0].playerData.map(item => item.day);
                break;
            case 'monthly':
                labels = data[0].playerData.map(item => `${item.day} ${item.monthName} ${item.dayName}`);
                break;
            case 'yearly':
                labels = data[0].playerData.map(item => item.month);
                break;
        }

        // Her sporcu için dataset oluştur
        const datasets = data.map((playerData, index) => {
            const player = selectedPlayers[index];
            const color = colors[index % colors.length];

            let values = [];
            switch(range) {
                case 'daily':
                    values = playerData.playerData.map(item => item.bpm);
                    break;
                case 'weekly':
                case 'monthly':
                case 'yearly':
                    values = playerData.playerData.map(item => item.avgBpm);
                    break;
            }

            return {
                label: player.name,
                data: values,
                borderColor: color,
                backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
                borderWidth: 2,
                pointBackgroundColor: color,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false,
                tension: 0.4,
                spanGaps: true
            };
        });

        // Chart'ı güncelle
        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;

        console.log('✅ DEBUG: Çoklu sporcu datasets oluşturuldu:', datasets.length);

        // Legend'ı aktif et
        this.chart.options.plugins.legend.display = true;

        if (range === 'daily') {
            this.chart.update();
            this.enableMultiPlayerScrolling(selectedDate, data, selectedPlayers);
        } else {
            this.chart.update();
            this.resetChartWidth();
        }
    }

    enableMultiPlayerScrolling(selectedDate, data, selectedPlayers) {
        const dataLength = this.chart.data.labels.length;
        const maxVisibleHours = 8;
        const pointsPerHour = Math.floor(60 / this.currentInterval) + 1; // Doğru hesaplama
        const maxVisiblePoints = maxVisibleHours * pointsPerHour;

        console.log('🔍 DEBUG: enableMultiPlayerScrolling çağrıldı');

        // Bugünün tarihi
        const today = new Date().toISOString().split('T')[0];
        const isToday = selectedDate === today || selectedDate === null;

        let startIndex, endIndex;

        if (isToday) {
            // Bugün için: 00:00'dan aktif saate kadar
            const currentHour = new Date().getHours();
            startIndex = 0;
            endIndex = Math.min(dataLength, (currentHour + 1) * pointsPerHour);
        } else {
            // Geçmiş günler için: 00:00'dan 24:00'e kadar tüm gün
            startIndex = 0;
            endIndex = dataLength;
        }

        // Labels'ı sınırla
        const limitedLabels = this.chart.data.labels.slice(startIndex, endIndex);

        // Her dataset'in verisini sınırla
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.slice(startIndex, endIndex);
        });

        // Labels'ı güncelle
        this.chart.data.labels = limitedLabels;

        // Kaydırma için pozisyonları sakla
        this.currentStartIndex = startIndex;
        this.totalDataLength = dataLength;
        this.maxVisiblePoints = maxVisiblePoints;

        console.log('✅ DEBUG: Çoklu sporcu scrolling aktif edildi');
        this.chart.update('none');
    }

    // 8 saatlik pencere görünümünü etkinleştir
    enableFullDataScrolling(selectedDate = null) {
        const dataLength = this.chart.data.labels.length;
        const maxVisibleHours = 8;
        const pointsPerHour = Math.floor(60 / this.currentInterval) + 1; // Doğru hesaplama
        const maxVisiblePoints = maxVisibleHours * pointsPerHour; // 8 saat * (60/interval) veri/saat

        console.log('🔍 DEBUG: enableFullDataScrolling çağrıldı');
        console.log('🔍 DEBUG: dataLength:', dataLength, 'maxVisiblePoints:', maxVisiblePoints);
        console.log('🔍 DEBUG: selectedDate:', selectedDate);

        // Bugünün tarihi
        const today = new Date().toISOString().split('T')[0];
        const isToday = selectedDate === today || selectedDate === null;

        // 8 saatlik pencere için veriyi sınırla
        let startIndex, endIndex;
        
        if (isToday) {
            // Bugün için: 00:00'dan aktif saate kadar (gelecek saatler görünmesin)
            const currentHour = new Date().getHours();
            startIndex = 0; // 00:00'dan başla
            endIndex = Math.min(dataLength, (currentHour + 1) * 6); // Aktif saate kadar
        } else {
            // Geçmiş günler için: 00:00'dan 24:00'e kadar tüm gün
            startIndex = 0;
            endIndex = dataLength; // Tüm veriyi göster
        }

        // Veriyi pencere ile sınırla
        const limitedLabels = this.chart.data.labels.slice(startIndex, endIndex);
        const limitedData = this.chart.data.datasets[0].data.slice(startIndex, endIndex);

        console.log('🔍 DEBUG: Sınırlandırılmış veri - startIndex:', startIndex, 'endIndex:', endIndex);
        console.log('🔍 DEBUG: limitedLabels uzunluk:', limitedLabels.length, 'limitedData uzunluk:', limitedData.length);
        console.log('🔍 DEBUG: İlk birkaç label:', limitedLabels.slice(0, 3));
        console.log('🔍 DEBUG: İlk birkaç data:', limitedData.slice(0, 3));

        // Chart'a sınırlı veriyi yükle
        this.chart.data.labels = limitedLabels;
        this.chart.data.datasets[0].data = limitedData;

        // Kaydırma için mevcut pozisyonu sakla
        this.currentStartIndex = startIndex;
        this.totalDataLength = dataLength;
        this.maxVisiblePoints = maxVisiblePoints;

        console.log('🔍 DEBUG: Chart güncelleniyor...');
        this.chart.update('none');
        console.log('✅ DEBUG: Chart güncelleme tamamlandı');
    }

    // Grafik genişliğini scroll için ayarla
    adjustChartWidthForScroll(dataLength, selectedDate = null) {
        // Bu fonksiyon artık enableFullDataScrolling tarafından hallediliyor
        // Sadece etiket optimizasyonunu yapıyoruz
        this.optimizeXAxisLabels(dataLength);
    }

    // X ekseni etiketlerini veri miktarına göre optimize et
    optimizeXAxisLabels(dataLength) {
        const chart = this.chart;
        const maxVisibleHours = 8;
        const pointsPerHour = Math.floor(60 / this.currentInterval) + 1;
        const maxVisiblePoints = maxVisibleHours * pointsPerHour; // 8 saat * (60/interval) veri noktası

        // 8 saatlik görünüm için optimize edilmiş etiket aralıkları
        const calculateLabelStep = (totalLabels) => {
            if (totalLabels <= 20) return 1; // Her etiketi göster
            if (totalLabels <= 60) return 5; // Her 5 dakikada bir (12 etiket/saat)
            if (totalLabels <= 120) return 10; // Her 10 dakikada bir (6 etiket/saat)
            if (totalLabels <= 240) return 15; // Her 15 dakikada bir (4 etiket/saat)
            if (totalLabels <= 480) return 30; // Her 30 dakikada bir (2 etiket/saat)
            return Math.ceil(totalLabels / 16); // Maksimum 16 etiket göster
        };

        const labelStep = calculateLabelStep(dataLength);

        if (dataLength > 30) {
            // Çok fazla veri varsa akıllı etiket seçimi
            this.chart.options.scales.x.ticks.callback = function(value, index, values) {
                // Sadece belirli aralıklarla etiket göster
                if (index % labelStep !== 0) return '';

                const label = chart.data.labels[value];
                if (!label) return '';

                const [hours, minutes] = label.split(':').map(Number);

                // Saat başlarını ve yarım saatleri tercih et
                if (minutes === 0) {
                    return `${hours.toString().padStart(2, '0')}:00`;
                } else if (minutes === 30) {
                    return `${hours.toString().padStart(2, '0')}:30`;
                }

                // Diğer durumlarda sadece saat başlarını göster
                return '';
            };
        } else {
            // Az veri için tüm etiketleri göster
            this.chart.options.scales.x.ticks.callback = function(value, index, values) {
                return chart.data.labels[value] || '';
            };
        }
    }

    // Grafik genişliğini sıfırla
    resetChartWidth() {
        const canvas = document.getElementById('heartRateChart');
        canvas.style.width = '100%';
        canvas.style.minWidth = 'auto';

        // Chart'ı yeniden boyutlandır
        this.chart.resize();
    }

    // Grafik navigasyon fonksiyonları - 8 saatlik pencere kaydırma
    panLeft() {
        if (!this.originalData) return;

        const moveAmount = Math.floor(60 / this.currentInterval) + 1; // 1 saat = (60/interval) veri nokta
        const newStartIndex = Math.max(0, this.currentStartIndex - moveAmount);

        if (newStartIndex !== this.currentStartIndex) {
            this.slideWindow(newStartIndex);
        }
    }

    panRight() {
        if (!this.originalData) return;

        const moveAmount = Math.floor(60 / this.currentInterval) + 1; // 1 saat = (60/interval) veri nokta
        const maxStartIndex = Math.max(0, this.totalDataLength - this.maxVisiblePoints);
        const newStartIndex = Math.min(maxStartIndex, this.currentStartIndex + moveAmount);

        if (newStartIndex !== this.currentStartIndex) {
            this.slideWindow(newStartIndex);
        }
    }

    // 8 saatlik pencereyi kaydır
    slideWindow(newStartIndex) {
        if (!this.originalData) return;
        
        this.currentStartIndex = newStartIndex;
        const endIndex = Math.min(this.totalDataLength, newStartIndex + this.maxVisiblePoints);
        
        // Yeni pencere verilerini al
        const limitedLabels = this.originalData.labels.slice(newStartIndex, endIndex);
        const limitedData = this.originalData.data.slice(newStartIndex, endIndex);
        
        // Chart'ı güncelle
        this.chart.data.labels = limitedLabels;
        this.chart.data.datasets[0].data = limitedData;
        this.chart.update('none');
    }

    zoomIn() {
        // Zoom devre dışı
        console.log('Zoom özelliği devre dışı');
    }

    zoomOut() {
        // Zoom devre dışı
        console.log('Zoom özelliği devre dışı');
    }

    resetView() {
        // Başlangıç görünümüne geri dön
        this.enableFullDataScrolling();
    }

    // Gerçek zamanlı veri ekleme fonksiyonu kaldırıldı
    // Real-time data point addition function removed
}

// HeartRateChart sınıfını global olarak erişilebilir yap
window.HeartRateChart = HeartRateChart;