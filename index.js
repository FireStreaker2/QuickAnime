const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const api = "https://api.consumet.org/anime/gogoanime";
const cdn = "https://gogocdn.net";

// disqus
const website = process.env.WEBSITE || "https://quickanime.firestreaker2.gq";
const disqusShortName = process.env.DISQUS_SHORT_NAME || "quick-anime";

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.send(`<script>window.location.href = "https://github.com/FireStreaker2/QuickAnime";</script>`);
});

app.get("/watch/:anime", async (req, res) => {
    const anime = req.params.anime;
    const quality = req.query.quality;
    const title = anime.replace(/-/g, " ");
    const name = anime.slice(0, anime.indexOf("-episode-"));
  
    try {
        const response = await axios.get(`${api}/watch/${anime}`);
        const data = response.data;

        const info = await axios.get(`${api}/info/${name}`);
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

app.get("/watch/:anime/comments", (req, res) => {
    const anime = req.params.anime;
    const title = anime.replace(/-/g, " ");

    res.send(`
        <!-- https://github.com/FireStreaker2/QuickAnime -->
        <!DOCTYPE HTML>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="description" content="QuickAnime - View ${title}'s Comments">
                <meta name="keywords" content="QuickAnime />
                <meta name=”copyright” content=”FireStreaker2”>
                <meta property="og:title" content="QuickAnime" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://quickanime.firestreaker2.gq" />
                <meta property="og:description" content="QuickAnime - View ${title}'s Comments" />
                <meta name="theme-color" content="#000000">
                <meta name="twitter:card" content="summary_large_image">

                <title>${title} - Comments | QuickAnime</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/index.css" />
            </head>
    
            <body>
                <div id="disqus_thread"></div>

                <script>
                    var disqus_config = function () {
                        this.page.url = "${website}/watch/${anime}/comments";
                        this.page.identifier = "${anime}";
                    };

                    (function() {
                        var d = document, s = d.createElement("script");
                        s.src = "https://${disqusShortName}.disqus.com/embed.js";
                        s.setAttribute("data-timestamp", +new Date());
                        (d.head || d.body).appendChild(s);
                    })();
                </script>
            </body>
        </html>
    `);
});

app.get("/recent", async (req, res) => {
    try {
        const response = await axios.get(`${api}/recent-episodes`);
        let data = response.data;
        data = JSON.stringify(data);
        data = data.replace(/https:\/\/gogoanimehd.io/g, `${website}/watch`);
        data = data.replace(/https:\/\/gogocdn.net/g, `${website}`);
        data = JSON.parse(data);

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching data.");
    }
});

app.get("/top", async (req, res) => {
    try {
        const response = await axios.get(`${api}/top-airing`);
        let data = response.data;
        data = JSON.stringify(data);
        data = data.replace(/https:\/\/gogoanimehd.io/g, `${website}`);
        data = data.replace(/https:\/\/gogocdn.net/g, `${website}`);
        data = JSON.parse(data);

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching data.");
    }
});

app.get("/category/:anime", async (req, res) => {
    const anime = req.params.anime;

    try {
        const response = await axios.get(`${api}/info/${anime}`);
        let data = response.data;
        data = JSON.stringify(data);
        data = data.replace(/https:\/\/gogoanimehd.io\//g, `${website}/watch`);
        data = data.replace(/https:\/\/gogocdn.net/g, `${website}`);
        data = JSON.parse(data);

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching data.");
    }
});

app.get("/cover/:image", async (req, res) => {
    const image = req.params.image;
    
    try {
        const response = await axios.get(`${cdn}/cover/${image}`, { responseType: "arraybuffer" });
        const data = response.data;

        res.set("Content-Type", "image/png");
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching data.");
    }
});
  

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});