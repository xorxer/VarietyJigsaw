from flask import Flask
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

def get_html(url):
    page = requests.get(url)
    html = BeautifulSoup(page.text, 'html.parser')
    return html

@app.route('/')
def get_img():
    # Getting the link to the daily image (gets a bigger image than the current one)
    init_html = get_html("https://bing.gifposter.com/")

    # Getting the biggest possible image for the daily image
    IMG_URL = 'https://bing.gifposter.com' + init_html.select_one('section', {'class': 'dayimg'}).select_one('a')['href']
    img_html = get_html(IMG_URL)

    img = img_html.find('div', class_='wp-wrapper').find_all('img')[1]
    return str(img)

if __name__ == '__main__':
    app.debug = True
    app.run()