
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;


app.get('/weather', async (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ error: 'Devi fornire una località' });
        }

    
        const apiKey = '7312079c3dc37927932ce2f6d144c670'; 
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);

      
        const webcamUrl = `https://www.dovesciare.it/webcam/${location}`;
        const webcamResponse = await axios.get(webcamUrl);
        const $ = cheerio.load(webcamResponse.data);
        const webcamImageUrl = $('div.row:nth-child(2) img.img-responsive').attr('src');

  
        const responseData = {
            weather: weatherResponse.data,
            webcamImageUrl: `https://www.dovesciare.it${webcamImageUrl}`
        };


        res.json(responseData);
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        res.status(500).json({ error: 'Si è verificato un errore durante la richiesta' });
    }
});


app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
