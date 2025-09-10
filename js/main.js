/**
 * Gerçek Zamanlı Nabız İzleme Uygulaması Ana Dosyası
 *
 * Bu dosya uygulamanın ana mantığını, event handling'ini ve
 * kullanıcı arayüzü güncellemelerini yönetir.
 */

/**
 * Gerekli DOM elementlerini güvenli şekilde seçer
 * @returns {Object|null} Elementler objesi veya eksik element varsa null
 */
function getRequiredElements() {
    const elements = {
        maxBpmElement: document.getElementById('maxBpm'),
        avgBpmElement: document.getElementById('avgBpm'),
        minBpmElement: document.getElementById('minBpm'),
        timeButtons: document.querySelectorAll('.time-btn'),
        dateInput: document.getElementById('dateInput'),
        dateRow: document.querySelector('.date-row'),
        pdfBtn: document.getElementById('pdfBtn'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        errorMessage: document.getElementById('errorMessage'),
        errorText: document.getElementById('errorText'),
        panHint: document.getElementById('panHint'),
        chartNavigation: document.getElementById('chartNavigation'),
        zoomOutBtn: document.getElementById('zoomOutBtn'),
        panLeftBtn: document.getElementById('panLeftBtn'),
        resetViewBtn: document.getElementById('resetViewBtn'),
        panRightBtn: document.getElementById('panRightBtn'),
        zoomInBtn: document.getElementById('zoomInBtn'),
        playersList: document.getElementById('playersList')
    };

    // Kritik elementlerin varlığını kontrol et
    const criticalElements = [
        'maxBpmElement', 'avgBpmElement', 'minBpmElement', 'timeButtons', 'playersList'
    ];

    for (const elementName of criticalElements) {
        if (!elements[elementName] || (elementName === 'timeButtons' && elements[elementName].length === 0)) {
            console.error(`Kritik element bulunamadı: ${elementName}`);
            return null;
        }
    }

    return elements;
}

document.addEventListener('DOMContentLoaded', function() {
    // jsPDF ve html2canvas'ı global olarak tanımla
    window.jsPDF = window.jspdf.jsPDF;

    // DOM elementlerini güvenli şekilde seç
    const elements = getRequiredElements();

    if (!elements) {
        console.error('Gerekli DOM elementleri bulunamadı!');
        return;
    }

    const {
        maxBpmElement,
        avgBpmElement,
        minBpmElement,
        timeButtons,
        dateRow,
        dateInput,
        pdfBtn,
        loadingIndicator,
        errorMessage,
        errorText,
        panHint,
        chartNavigation,
        zoomOutBtn,
        panLeftBtn,
        resetViewBtn,
        panRightBtn,
        zoomInBtn,
        playersList
    } = elements;

    // Veri validasyonu fonksiyonları
    const validators = {
        isValidDate: (dateString) => {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        },

        isValidBpmData: (data, range = 'daily') => {
            if (!Array.isArray(data) || data.length === 0) {
                return false;
            }

            // Çoklu sporcu verisi kontrolü
            if (data.length > 0 && data[0].hasOwnProperty('playerData')) {
                // Çoklu sporcu formatı: [{playerId, playerData}, ...]
                return data.every(playerItem =>
                    playerItem &&
                    playerItem.playerData &&
                    Array.isArray(playerItem.playerData) &&
                    playerItem.playerData.length > 0 &&
                    validators.isValidBpmData(playerItem.playerData, range)
                );
            }

            // Tek sporcu formatı
            switch(range) {
                case 'daily':
                    return data.every(item => item &&
                        (typeof item.bpm === 'number' || item.bpm === null) &&
                        item.bpm !== undefined &&
                        item.time &&
                        typeof item.time === 'string');

                case 'weekly':
                case 'monthly':
                case 'yearly':
                    return data.every(item => item &&
                        typeof item.avgBpm === 'number' &&
                        item.avgBpm > 0);

                default:
                    return false;
            }
        },

        sanitizeInterval: (interval) => {
            const num = parseInt(interval);
            return isNaN(num) || num < 1 ? 10 : Math.min(num, 60); // 1-60 dakika arası
        }
    };

    // Uygulama state yönetimi
    let appState = {
        currentData: [],
        currentRange: 'daily',
        isLoading: false,
        selectedPlayers: [] // Çoklu seçim için array
    };

    // Varsayılan interval değeri (1 saat)
    const DEFAULT_INTERVAL = 60;
    
    // Grafik ve veri nesnelerini oluştur
    console.log('🔍 DEBUG: HeartRateChart sınıfı başlatılıyor...');
    const heartRateChart = new HeartRateChart();
    console.log('🔍 DEBUG: HeartRateChart nesnesi oluşturuldu:', heartRateChart);
    let currentData = [];
    let simulationInterval;

    // Bugünün tarihini varsayılan olarak ayarla
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
    dateInput.max = today.toISOString().split('T')[0]; // Gelecek tarihleri engelle

    // Sporcu listesini oluştur
    function initializePlayersList() {
        console.log('🔍 DEBUG: Sporcu listesi başlatılıyor...');

        if (!HeartRateData.players || !Array.isArray(HeartRateData.players)) {
            console.error('❌ ERROR: Sporcu listesi bulunamadı!');
            return;
        }

        // Sporcu listesini temizle
        playersList.innerHTML = '';

        // Her sporcu için element oluştur
        HeartRateData.players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'player-item';
            playerElement.setAttribute('data-player-id', player.id);

            // Avatar
            const avatarImg = document.createElement('img');
            avatarImg.className = 'player-avatar';
            avatarImg.src = player.avatar;
            avatarImg.alt = player.name;
            // Base64 SVG kullandığımız için fallback'e gerek yok

            // Sporcu bilgileri container
            const playerInfo = document.createElement('div');
            playerInfo.className = 'player-info';

            // İsim
            const playerName = document.createElement('div');
            playerName.className = 'player-name';
            playerName.textContent = player.name;

            // Detaylar
            const playerDetails = document.createElement('div');
            playerDetails.className = 'player-details';
            playerDetails.textContent = `${player.age} yaş • ${player.weight}kg • ${player.position}`;

            // Çoklu seçim göstergesi
            const multiSelectIndicator = document.createElement('div');
            multiSelectIndicator.className = 'multi-select-indicator';
            multiSelectIndicator.textContent = '✓';

            // Elementleri birleştir
            playerInfo.appendChild(playerName);
            playerInfo.appendChild(playerDetails);
            playerElement.appendChild(avatarImg);
            playerElement.appendChild(playerInfo);
            playerElement.appendChild(multiSelectIndicator);

            // İlk sporcuyu varsayılan olarak seç
            if (index === 0) {
                playerElement.classList.add('active');
                appState.selectedPlayers.push(player);
                console.log('✅ DEBUG: Sporcu varsayılan olarak seçildi:', player.name);
            }

            // Event listener ekle - çoklu seçim için
            playerElement.addEventListener('click', function(event) {
                handlePlayerSelection(player, event);
            });

            playersList.appendChild(playerElement);
        });

        console.log('✅ DEBUG: Sporcu listesi başarıyla oluşturuldu, toplam sporcu:', HeartRateData.players.length);
    }

    // Sporcu seçme fonksiyonu - çoklu seçim için
    function handlePlayerSelection(player, event) {
        console.log('🔍 DEBUG: Sporcu seçim işlemi:', {
            name: player.name,
            ctrlKey: event.ctrlKey,
            currentSelected: appState.selectedPlayers.length
        });

        const playerElement = playersList.querySelector(`[data-player-id="${player.id}"]`);
        const isCurrentlySelected = appState.selectedPlayers.some(p => p.id === player.id);

        if (event.ctrlKey) {
            // Ctrl+click: Çoklu seçim
            if (isCurrentlySelected) {
                // Seçiliyse kaldır
                appState.selectedPlayers = appState.selectedPlayers.filter(p => p.id !== player.id);
                playerElement.classList.remove('active');
                console.log('✅ DEBUG: Sporcu çoklu seçimden çıkarıldı:', player.name);
            } else {
                // Seçili değilse ekle
                appState.selectedPlayers.push(player);
                playerElement.classList.add('active');
                console.log('✅ DEBUG: Sporcu çoklu seçime eklendi:', player.name);
            }
        } else {
            // Normal click: Tek seçim
            // Tüm seçimleri kaldır
            playersList.querySelectorAll('.player-item.active').forEach(el => {
                el.classList.remove('active');
            });

            // Sadece bu sporcuyu seç
            appState.selectedPlayers = [player];
            playerElement.classList.add('active');
            console.log('✅ DEBUG: Tek seçim yapıldı:', player.name);
        }

        // En az bir sporcu seçili olduğundan emin ol
        if (appState.selectedPlayers.length === 0) {
            // Hiç seçili yoksa ilk sporcuyu seç
            const firstPlayer = HeartRateData.players[0];
            appState.selectedPlayers = [firstPlayer];
            const firstElement = playersList.querySelector(`[data-player-id="${firstPlayer.id}"]`);
            if (firstElement) {
                firstElement.classList.add('active');
            }
            console.log('✅ DEBUG: Hiç seçili sporcu kalmadı, ilk sporcu seçildi');
        }

        // Veriyi yeniden yükle
        const activeRange = document.querySelector('.time-btn.active').getAttribute('data-range');
        const currentDate = dateInput.value || new Date().toISOString().split('T')[0];
        loadChartData(activeRange, currentDate);
    }

    // Sporcu listesini başlat
    initializePlayersList();
    
    // PDF oluşturma fonksiyonu
    function generatePDF() {
        const canvas = document.getElementById('heartRateChart');
        const selectedDate = dateInput.value;
        const maxBpm = maxBpmElement.textContent;
        const avgBpm = avgBpmElement.textContent;
        const minBpm = minBpmElement.textContent;

        if (!canvas) {
            showErrorMessage('Grafik bulunamadı!');
            return;
        }

        // Loading göstergesi
        showLoadingIndicator();

        // Canvas'ı görüntüye dönüştür
        html2canvas(canvas, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvasImg => {
            // PDF oluştur
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Başlık - ASCII karakterler
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            const title = 'Gercek Zamanli Nabiz Izleme Raporu';
            pdf.text(title, pdfWidth / 2, 20, { align: 'center' });

            // Tarih
            pdf.setFontSize(12);
            pdf.text(`Tarih: ${selectedDate}`, 20, 35);

            // İstatistikler - ASCII
            pdf.text(`En Yuksek Nabiz: ${maxBpm} BPM`, 20, 45);
            pdf.text(`Ortalama Nabiz: ${avgBpm} BPM`, 20, 52);
            pdf.text(`En Dusuk Nabiz: ${minBpm} BPM`, 20, 59);

            // Oluşturulma tarihi - ASCII
            const now = new Date();
            pdf.text(`Rapor Olusturulma Tarihi: ${now.toLocaleString('tr-TR')}`, 20, 66);

            // Grafik görüntüsü
            const imgData = canvasImg.toDataURL('image/png');
            const imgWidth = pdfWidth - 40;
            const imgHeight = (canvasImg.height * imgWidth) / canvasImg.width;

            if (imgHeight > pdfHeight - 80) {
                // Görüntü çok büyükse küçült
                const scale = (pdfHeight - 80) / imgHeight;
                pdf.addImage(imgData, 'PNG', 20, 75, imgWidth * scale, imgHeight * scale);
            } else {
                pdf.addImage(imgData, 'PNG', 20, 75, imgWidth, imgHeight);
            }

            // PDF'i indir
            const fileName = `nabiz-raporu-${selectedDate}.pdf`;
            pdf.save(fileName);

            hideLoadingIndicator();
            showErrorMessage('PDF başarıyla oluşturuldu!', 'success');
        }).catch(error => {
            console.error('PDF oluşturma hatası:', error);
            hideLoadingIndicator();
            showErrorMessage('PDF oluşturulurken bir hata oluştu.');
        });
    }

    // Başlangıçta günlük veriyi yükle (bugün için)
    const initialDate = new Date().toISOString().split('T')[0];
    dateInput.value = initialDate; // Date input'u bugün olarak ayarla
    loadChartData('daily', initialDate);
    
    // Zaman aralığı butonlarına event listener ekle
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif butonu güncelle
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Veriyi yükle ve grafiği güncelle
            const range = this.getAttribute('data-range');
            const currentDate = dateInput.value || new Date().toISOString().split('T')[0];
            loadChartData(range, currentDate);
        });
    });
    
    // Tarih seçici event listener
    dateInput.addEventListener('change', function() {
        const activeRange = document.querySelector('.time-btn.active').getAttribute('data-range');
        const selectedDate = this.value;
        if (activeRange === 'daily') {
            loadChartData('daily', selectedDate);
        }
    });


    // PDF butonu için event listener
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            const activeRange = document.querySelector('.time-btn.active').getAttribute('data-range');
            if (activeRange === 'daily') {
                generatePDF();
            } else {
                showErrorMessage('PDF çıktısı sadece günlük görünüm için kullanılabilir.');
            }
        });
    }
    
    // Veri yükleme fonksiyonu
    function loadChartData(range, selectedDate = null) {
        console.log('🔍 DEBUG: loadChartData çağrıldı, range:', range, 'selectedDate:', selectedDate);

        // Loading göstergesi
        showLoadingIndicator();

        // Veri yükleme işlemini async olarak çalıştır
        setTimeout(() => {
            let data;

            try {
                let selectedDate = null;
                // Çoklu sporcu için player ID'lerini al
                const playerIds = appState.selectedPlayers.length > 0
                    ? appState.selectedPlayers.map(p => p.id)
                    : [1]; // Fallback

                switch(range) {
                    case 'daily':
                        selectedDate = dateInput.value;
                        const today = new Date().toISOString().split('T')[0];

                        if (selectedDate === today) {
                            // Bugün için 00:00'dan mevcut saate kadar göster
                            console.log('🔍 DEBUG: generateMultiPlayerFrom8AMToNowData çağrılıyor, interval:', DEFAULT_INTERVAL, 'playerIds:', playerIds);
                            data = HeartRateData.generateMultiPlayerFrom8AMToNowData(playerIds, DEFAULT_INTERVAL);
                            console.log('🔍 DEBUG: Günlük veri üretildi, uzunluk:', data.length, 'örnek:', data.slice(0, 3));
                        } else {
                            // Geçmiş gün için 00:00'dan 23:59'a kadar tüm saatleri göster
                            if (!validators.isValidDate(selectedDate)) {
                                showErrorMessage('Geçersiz tarih formatı!');
                                return;
                            }
                            console.log('🔍 DEBUG: generateMultiPlayerDataForDate çağrılıyor, tarih:', selectedDate, 'interval:', DEFAULT_INTERVAL, 'playerIds:', playerIds);
                            data = HeartRateData.generateMultiPlayerDataForDate(playerIds, selectedDate, DEFAULT_INTERVAL);
                            console.log('🔍 DEBUG: Geçmiş tarih verisi üretildi, uzunluk:', data.length);
                        }
                        break;
                    case 'weekly':
                        console.log('🔍 DEBUG: generateMultiPlayerWeeklyData çağrılıyor, playerIds:', playerIds);
                        data = HeartRateData.generateMultiPlayerWeeklyData(playerIds);
                        break;
                    case 'monthly':
                        console.log('🔍 DEBUG: generateMultiPlayerMonthlyData çağrılıyor, playerIds:', playerIds);
                        data = HeartRateData.generateMultiPlayerMonthlyData(playerIds);
                        break;
                    case 'yearly':
                        console.log('🔍 DEBUG: generateMultiPlayerYearlyData çağrılıyor, playerIds:', playerIds);
                        data = HeartRateData.generateMultiPlayerYearlyData(playerIds);
                        break;
                }

                appState.currentData = data;
                appState.currentRange = range;
        
                // Veri validasyonu
                if (!validators.isValidBpmData(data, range)) {
                    console.error(`Geçersiz veri formatı - Range: ${range}`, data);
                    showErrorMessage(`Geçersiz veri formatı alındı (${range}). Sayfa yenileniyor...`);
                    setTimeout(() => window.location.reload(), 2000);
                    return;
                }
        
                console.log('🔍 DEBUG: updateChartData çağrılıyor...');
                heartRateChart.updateChartData(data, range, selectedDate, DEFAULT_INTERVAL, appState.selectedPlayers);
                console.log('✅ DEBUG: Chart güncellendi, interval:', DEFAULT_INTERVAL, 'selectedPlayers:', appState.selectedPlayers.length);
                updateStats(data, range);

                // Günlük görünümde anlık değeri güncelleme kaldırıldı

                // Tarih seçiciyi sadece günlük görünümde göster
                if (range === 'daily') {
                    if (dateRow) {
                        dateRow.classList.add('show');
                    }
                    if (chartNavigation) {
                        chartNavigation.classList.add('show');
                    }
                    // İlk yükleme sonrasında pan hint'i göster
                    if (appState.currentRange !== 'daily') {
                        setTimeout(() => showPanHint(), 1000);
                    }
                } else {
                    if (dateRow) {
                        dateRow.classList.remove('show');
                    }
                    if (chartNavigation) {
                        chartNavigation.classList.remove('show');
                    }
                }
            } catch (error) {
                console.error('Veri yükleme hatası:', error);
                showErrorMessage('Veri yüklenirken bir hata oluştu.');
            } finally {
                hideLoadingIndicator();
            }
        }, 100); // Kısa gecikme ile daha iyi UX
    }
    
    // İstatistikleri güncelle - çoklu sporcu için
    function updateStats(data, range) {
        let max, avg, min;

        // Çoklu sporcu verisi kontrolü
        if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('playerData')) {
            // Çoklu sporcu: Tüm sporcuların verilerini birleştir
            let allBpms = [];

            if (range === 'daily') {
                // Tüm sporcuların günlük verilerini birleştir
                data.forEach(playerItem => {
                    const playerBpms = playerItem.playerData
                        .map(item => item.bpm)
                        .filter(bpm => bpm !== null && bpm !== undefined);
                    allBpms = allBpms.concat(playerBpms);
                });
            } else {
                // Haftalık, aylık, yıllık için
                data.forEach(playerItem => {
                    const playerBpms = playerItem.playerData
                        .map(item => item.avgBpm)
                        .filter(bpm => bpm !== null && bpm !== undefined);
                    allBpms = allBpms.concat(playerBpms);
                });
            }

            if (allBpms.length === 0) {
                max = 0;
                min = 0;
                avg = 0;
            } else {
                max = Math.max(...allBpms);
                min = Math.min(...allBpms);
                avg = Math.round(allBpms.reduce((sum, bpm) => sum + bpm, 0) / allBpms.length);
            }
        } else {
            // Tek sporcu (eski format)
            if (range === 'daily') {
                const bpms = data.map(item => item.bpm).filter(bpm => bpm !== null && bpm !== undefined);
                if (bpms.length === 0) {
                    max = 0;
                    min = 0;
                    avg = 0;
                } else {
                    max = Math.max(...bpms);
                    min = Math.min(...bpms);
                    avg = Math.round(bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length);
                }
            } else {
                const avgBpms = data.map(item => item.avgBpm);
                max = Math.max(...avgBpms);
                min = Math.min(...avgBpms);
                avg = Math.round(avgBpms.reduce((sum, bpm) => sum + bpm, 0) / avgBpms.length);
            }
        }

        // Seçili sporcu sayısını göster
        const selectedCount = appState.selectedPlayers.length;
        const playerText = selectedCount === 1 ? 'sporcu' : `${selectedCount} sporcu (ortalama)`;

        maxBpmElement.textContent = max;
        avgBpmElement.textContent = avg;
        minBpmElement.textContent = min;

        console.log(`✅ DEBUG: İstatistikler güncellendi - ${playerText}: Max:${max}, Avg:${avg}, Min:${min}`);
    }
    
    

    // Loading göstergesi fonksiyonları
    function showLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.add('show');
        }
    }

    function hideLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('show');
        }
    }

    // Hata mesajı fonksiyonları
    function showErrorMessage(message, type = 'error') {
        if (errorText && errorMessage) {
            errorText.textContent = message;

            // Mesaj tipine göre sınıf ekle
            errorMessage.className = 'error-message';
            if (type === 'success') {
                errorMessage.classList.add('success');
            }

            errorMessage.classList.add('show');

            // 5 saniye sonra otomatik gizle
            setTimeout(() => {
                hideErrorMessage();
            }, 5000);
        }
    }

    // Global fonksiyon olarak tanımla
    window.hideErrorMessage = function() {
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    };

    // Pan hint fonksiyonları
    function showPanHint() {
        if (panHint && !panHint.classList.contains('show')) {
            panHint.classList.add('show');
            // 4 saniye sonra otomatik gizle
            setTimeout(() => {
                hidePanHint();
            }, 4000);
        }
    }

    function hidePanHint() {
        if (panHint) {
            panHint.classList.remove('show');
        }
    }

    // Navigasyon butonları için event listener'lar
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            heartRateChart.zoomOut();
        });
    }

    if (panLeftBtn) {
        panLeftBtn.addEventListener('click', () => {
            heartRateChart.panLeft();
        });
    }

    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', () => {
            heartRateChart.resetView();
        });
    }

    if (panRightBtn) {
        panRightBtn.addEventListener('click', () => {
            heartRateChart.panRight();
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            heartRateChart.zoomIn();
        });
    }
});