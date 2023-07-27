const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const api = "https://api.consumet.org/anime/gogoanime/watch";
const infoAPI = "https://api.consumet.org/anime/gogoanime/info";

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/watch/:anime", async (req, res) => {
    const anime = req.params.anime;
    const quality = req.query.quality;
    const title = anime.replace(/-/g, " ");
    const name = anime.slice(0, anime.indexOf("-episode-"));
  
    try {
        const response = await axios.get(`${api}/${anime}`);
        const data = response.data;

        const info = await axios.get(`${infoAPI}/${name}`);
        const description = info.data.description;
        const image = info.data.image;

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
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="description" content="QuickAnime - Watch ${title} online free, english subbed.\n${description}">
                    <meta name="keywords" content="QuickAnime />
                    <meta name=”copyright” content=”FireStreaker2”>
                    <meta property="og:title" content="QuickAnime" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://quickanime.firestreaker2.gq" />
                    <meta property="og:image" content=${image} />
                    <meta property="og:description" content="QuickAnime - Watch ${title} online free, english subbed.\n${description}" />
                    <meta name="theme-color" content="#000000">
                    <meta name="twitter:card" content="summary_large_image">

                    <title>${title} | QuickAnime</title>
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
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