const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const Manga = require('./models/Manga');
const Chapter = require('./models/Chapter');
const Page = require('./models/Page');



app.use(express.static(path.join(__dirname, 'images')));

const options = {
  uri: 'https://www.scan-vf.net/one_piece/chapitre-1081/5',
  transform: function (body) {
    return cheerio.load(body);
  }
};

let manga = new Manga('One Piece');
let chapter = new Chapter(parseInt(options.uri.substring(options.uri.indexOf("scan-")+ 4),10) );


rp(options)
  .then(($) => {
    $('img').each(function (i, elem) {
      const imgUrl = $(elem).attr('src');
      const imgAlt= $(elem).attr('alt');

      const imgName = imgAlt.substring(imgAlt.indexOf("Page")+ 4);
      //turn imgName into a number
      const imgNumber = parseInt(imgName,10);
      
      if(imgNumber >= 0){
        const page = new Page(imgNumber, imgUrl, imgAlt);
        chapter.addPage(page);
      }
      
      setTimeout(() => {
        console.log(`Waiting 1 second before making the next request...`);
      }, 1000);
    });
    manga.addChapter(chapter);
    const mangaData = JSON.stringify(manga, null, 2);
    fs.writeFileSync('one-piece-scans.json', mangaData);
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
  
  

  app.get('/', (req, res) => {
    // Récupérer la liste des fichiers images dans le dossier "images"
    const fs = require('fs');
    const data = fs.readFileSync('one-piece-scans.json');
    const dataparse = JSON.parse(data);
    let firstCHapter = dataparse.chapters[0];
  
    // Afficher les images dans la page HTML
    let html = '<html><head><title>One Piece : Chapitre 1081</title></head><body>';
    html += '<h1>Chapitre 1081</h1>';
    html += '<ul>';
    firstCHapter.pages.forEach(page => {
      html += '<li><img src="' + page.source + '"  width="500"></li>';

    });
    html += '</ul>';
    html += '</body></html>';
  
    res.send(html);
  });
  
  app.listen(3000, () => {
    console.log('Serveur lancé sur le port 3000');
  });