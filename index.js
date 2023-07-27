const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const api = "https://api.consumet.org/anime/gogoanime/watch";

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/watch/:anime", async (req, res) => {
    const anime = req.params.anime;
    const quality = req.query.quality;
    const title = anime.replace(/-/g, " ");
    const url = `${api}/${anime}`;
  
    try {
        const response = await axios.get(url);
        const data = response.data;

        let index;

        switch (quality) {
            case "360p":
                index = 0;
                break;
                
            case "480p":
                index = 1;
                break;

            case "720p":
                index = 2;
                break;

            case "1080p":
                index = 3;
                break;

            default:
                index = 4;
                break;
        }
    
        const streamURL = data.sources[index].url;
    
        res.send(`
            <!-- https://github.com/FireStreaker2/QuickAnime -->
            <!DOCTYPE HTML>
            <html>
                <head>
                    <title>${title} | QuickAnime</title>
                    <link rel="stylesheet" href="/index.css" />
                </head>
        
                <body>
                    <video controls autoplay crossorigin playsinline>
                        <source src=${streamURL} type="application/x-mpegURL"></source>
                    </video>

                    <script src="/index.js"></script>

                </body>
            </html>
        `);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching data.");
    }
});
  

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});