import os
import requests
from PIL import Image
from io import BytesIO

# Google Custom Search API anahtarınız ve arama motoru kimliğiniz
API_KEY = ''
CX = ''

# Fotoğraf isimleri
search_queries = [
    'kısır',
    'menemen',
    'ezogelin',
    'patates salatası',
    'tavuk sote',
    'iskender',
    'makarna salatası',
    'mücver',
    'bulgur pilavı',
    'kuzu kapama',
    'pizza',
    'sebze yemeği',
    'börek',
    'kuzu tandır',
    'sarmalar',
    'mangal köfte',
    'zeytinyağlı enginar',
    'tavuk şiş',
    'kuzu güveç',
    'fırın makarna'
]

# İndirme klasörü
download_folder = 'downloaded_images'

if not os.path.exists(download_folder):
    os.makedirs(download_folder)

def download_image(search_query):
    search_url = 'https://www.googleapis.com/customsearch/v1'
    params = {
        'key': API_KEY,
        'cx': CX,
        'q': search_query,
        'searchType': 'image',
        'num': 1,  # İndirmek istediğiniz resim sayısı
        'fileType': 'jpg',
        'imgType': 'photo',
        'alt': 'json'
    }

    response = requests.get(search_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'items' in data:
            for item in data['items']:
                img_url = item['link']
                img_response = requests.get(img_url)
                if img_response.status_code == 200:
                    try:
                        img = Image.open(BytesIO(img_response.content))
                        img_filename = os.path.join(download_folder, f"{search_query}.jpg")
                        img.save(img_filename)
                        print(f'{search_query} için resim başarıyla indirildi.')
                    except Exception as e:
                        print(f'{search_query} için resim indirilemedi. Hata: {e}')
                else:
                    print(f'{search_query} için görsel bulunamadı.')
        else:
            print(f'{search_query} için arama sonuçları boş.')
    else:
        print(f'{search_query} için arama yapılamadı. HTTP durum kodu: {response.status_code}')

# Resimleri indir
for query in search_queries:
    download_image(query)
