![QuickAnime](https://socialify.git.ci/FireStreaker2/QuickAnime/image?description=1&forks=1&issues=1&name=1&owner=1&pulls=1&stargazers=1&theme=Dark)

# About
QuickAnime is a way to quickly watch anime. It was built with Node.js, and utilizes the <a href="https://github.com/consumet/api.consumet.org">Consumet API</a>. It also uses <a href="https://github.com/sampotts/plyr">Plyr</a> as a way to view the videos.

# Usage
At the core, QuickAnime comes with a couple routes, which are shown below.
| Route                        | Usage                |
|------------------------------|----------------------|
| /                            | Redirect             |
| /watch/${episodeid}          | Watch anime          |
| /watch/${episodeid}/comments | See comments         |
| /recent                      | See recent episodes  |
| /top                         | See top airing anime |
| /category/${anime}           | Extra Anime Info     |
| /cover/${image}              | Anime Cover Image    | 

Base URL: ``https://quickanime.firestreaker2.gq``   

The ``episodeid`` variable should be in the format of ``${name}-episode-${episode-number}``, where everything is lowercase and spaces are replaced with hyphens (``-``).  
Example: ``https://quickanime.firestreaker2.gq/watch/oshi-no-ko-episode-1``

You can also specify the ``quality`` query parameter to change the video resolution. The options are: ``360p``, ``480p``, ``720p``, and ``1080p``.  
Example: ``https://quickanime.firestreaker2.gq/watch/horimiya-episode-10?quality=1080p``  

> If the quality query parameter is not specified, it will automatically use the default provided file.

# Selfhosting
If you would like to selfhost this project, you may.
```bash
$ git clone https://github.com/FireStreaker2/QuickAnime.git
$ cd QuickAnime
$ npm i
$ npm start
```

> If you would like to have your own comment section whilst selfhosting this project, be sure to setup a [disqus](https://disqus.com/) account and set the ``website`` and ``disqusShortName`` environment variables to match your own.

# License
<a href="https://github.com/FireStreaker2/QuickAnime/blob/main/LICENSE">MIT</a>