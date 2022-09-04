from flask import Flask
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app)

def get_html(url):
    page = requests.get(url)
    html = BeautifulSoup(page.text, 'html.parser')
    return html

# Gets the daily bing image by going to the main page first 
# then getting a link to the enlarged image
@app.route('/img')
def get_img():
    # Main page HTML page
    main_html = get_html("https://bing.gifposter.com/")

    # Enlarged image URL and HTML page
    IMG_URL = 'https://bing.gifposter.com' + main_html.select_one('section', {'class': 'dayimg'}).select_one('a')['href']
    img_html = get_html(IMG_URL)

    img = img_html.find('div', class_='wp-wrapper').find_all('img')[1]
    return str(img)

if __name__ == '__main__':
    app.debug = True
    app.run()