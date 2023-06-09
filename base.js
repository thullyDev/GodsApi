import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import { ManganatoParser, NineAnimeParser } from "./resources/parser.js";
import { PORT, SERVER_MSG, USER_AGENT, SUCESSFUL, NOT_FOUND, NOT_FOUND_MSG, print } from "./resources/utilities.js";

const app = express();
const mnt_parser = new ManganatoParser();
const nine_anime_parser = new NineAnimeParser();

app.use(express.json());

app.listen(PORT, function () {
  print("GodsScraper-v1.0.0 ===> http://localhost:" + PORT);
});

app.get("/", function (req, res) {
  res.status(SUCESSFUL).json(SERVER_MSG);
});

/************* MANGAS ****************/
app.get("/manga/read/:manga_id/:chapter", async function (req, res) {
  const manga_id = req.params.manga_id;
  const chapter = req.params.chapter;
  const site = req.query.s;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_panels(manga_id, chapter, site, function (results) {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/panel/:src", async function (req, res) {
  const source = req.params.src;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_panel(source, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/:manga_id/", async function (req, res) {
  const manga_id = req.params.manga_id;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_manga_info(manga_id, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/latest", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = req.query.status;
  await mnt_parser.get_latest(status, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/newest", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = req.query.status;
  await mnt_parser.get_newest(status, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/alltimes", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = req.query.status;
  await mnt_parser.get_alltimes(status, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/genres", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const cache = req.query.cache;
  await mnt_parser.get_genres(cache, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/filter/:genre", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = req.query.status;
  const genre = req.params.genre;
  await mnt_parser.filter(genre, status, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/top_mangas", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_top_mangas((results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});
/************* MANGAS=>end ****************/

/************* ANIME ****************/
app.get("/anime/:site/sliders", async function (req, res) {
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_slider_animes((results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/top_animes", async function (req, res) {
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_top_animes((results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/recent", async function (req, res) {
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_recent_animes((results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/watch_types", async function (req, res) {
  const site = req.params.site;
  const cache = req.query.cache;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_watch_types(cache, (results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/watch_types", async function (req, res) {
  const site = req.params.site;
  const cache = req.query.cache;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_watch_types(cache, (results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/schedule/days", async function (req, res) {
  const site = req.params.site;
  const tz_offset = req.query.tz_offset;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    if (tz_offset) {
      await nine_anime_parser.get_schedule_days(tz_offset, (results) => {
        data = results;
      });
    }
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/schedule/animes", async function (req, res) {
  const site = req.params.site;
  const date = req.query.date;
  const tz_offset = req.query.tz_offset;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    if (tz_offset && date) {
      await nine_anime_parser.get_schedule_animes(tz_offset, date, (results) => {
        data = results;
      });
    }
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/:slug", async function (req, res) {
  const slug = req.params.slug;
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_anime_info(slug, (results) => {
      data = results;
    });
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});
/************* ANIME=>end ****************/

//? keep this route last
app.get("*", function (req, res) {
  res.status(NOT_FOUND).json(NOT_FOUND_MSG);
});
