document.addEventListener('DOMContentLoaded', () => {
    const tabaklar = document.querySelectorAll('.tabak');
    const overlay = document.querySelector('.overlay');
    const ekGoruntu = document.querySelector('.ek-goruntu');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const tarifListe = document.querySelector('.tarif-liste');
    const tarifDetay = document.getElementById('tarifDetay');
    const closeDetail = document.getElementById('closeDetail');

    tabaklar.forEach(tabak => {
        tabak.addEventListener('click', () => {
            const malzemeSayisi = parseInt(tabak.textContent);

            overlay.style.background = `url('assets/arkaplan2.png') no-repeat center center fixed`;
            overlay.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center top';

            tabaklar.forEach(t => t.style.display = 'none');

            ekGoruntu.style.transform = `translate(-50%, -50%)`;
            ekGoruntu.style.top = '61%';
            ekGoruntu.style.left = '50%';

            loadingOverlay.style.display = 'flex';

            const mevcutTarifler = document.querySelectorAll('.tarif-item');
            mevcutTarifler.forEach(tarif => tarif.remove());

            setTimeout(() => {
                loadingOverlay.style.display = 'none';

                fetch('yemektarifi.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ağ hatası');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const tarifler = data.filter(tarif => tarif.malzemeSayisi === malzemeSayisi);

                        if (tarifler.length > 0) {
                            tarifler.forEach(tarif => {
                                const tarifElementi = document.createElement('div');
                                tarifElementi.className = 'tarif-item';
                                tarifElementi.innerHTML = `
                                    <img src="${tarif.fotoğraf}" alt="${tarif.ad}" />
                                    <h3>${tarif.ad}</h3>
                                    <p>${tarif.aciklama}</p>
                                `;
                                tarifElementi.addEventListener('click', () => {
                                    tarifDetay.querySelector('img').src = tarif.fotoğraf;
                                    tarifDetay.querySelector('h3').textContent = tarif.ad;
                                    tarifDetay.querySelector('p').textContent = tarif.aciklama;

                                    const malzemeler = tarif.malzemeler.map(m => `<li>${m}</li>`).join('');
                                    tarifDetay.querySelector('ul').innerHTML = malzemeler;
                                    tarifDetay.querySelector('p').textContent = tarif.yapilis;

                                    tarifDetay.style.display = 'block';
                                });
                                tarifListe.appendChild(tarifElementi);
                            });
                        } else {
                            const noResult = document.createElement('div');
                            noResult.className = 'tarif-item';
                            noResult.innerHTML = `<p>Bu malzeme sayısına sahip tarif bulunamadı.</p>`;
                            tarifListe.appendChild(noResult);
                        }
                    })
                    .catch(error => console.error('Tarifler yüklenirken bir hata oluştu:', error));
            }, 5000);
        });
    });

    closeDetail.addEventListener('click', () => {
        tarifDetay.style.display = 'none';
    });
});
