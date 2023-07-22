import express from "express";
import morgan from "morgan";
import axios from "axios";
import favicon from "serve-favicon";
import path from "path";
import {
  ManganatoParser,
  NineAnimeParser,
  ZoroAnimeParser,
  KaidoAnimeParser,
  get_episode_sources,
  get_anime_episode_servers,
} from "./resources/parser.js";
import {
  PORT,
  SERVER_MSG,
  USER_AGENT,
  SUCESSFUL,
  NOT_FOUND,
  NOT_FOUND_MSG,
  print,
  safify,
} from "./resources/utilities.js";

const app = express();
const mnt_parser = new ManganatoParser();
const nine_anime_parser = new NineAnimeParser();
const zoro_anime_parser = new ZoroAnimeParser();
const kaido_anime_parser = new KaidoAnimeParser();
const __dirname = path.resolve();

app.use(favicon(__dirname + "/images/icon.jpg"));
app.use(express.json());
app.use(morgan("tiny"));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

app.listen(PORT, function () {
  print("GodsApi-v1.0.0 ===> http://localhost:" + PORT);
});

app.get("/", function (req, res) {
  res.status(SUCESSFUL).json(SERVER_MSG);
});

/************* MANGAS ****************/
app.get("/manga/search/:query/", async function (req, res) {
  const query = req.params.query;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_searches(query, page, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/read/:manga_id/", async function (req, res) {
  const manga_id = req.params.manga_id;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_manga_info(manga_id, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/read/:manga_id/:chapter/", async function (req, res) {
  const manga_id = req.params.manga_id;
  const chapter = req.params.chapter;
  const site = safify(req.query.s);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_panels(manga_id, chapter, site, function (results) {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/panel/:src/", async function (req, res) {
  const source = req.params.src;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_panel(source, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/latest/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = safify(req.query.status);
  const page = safify(req.query.page);
  await mnt_parser.get_latest(status, page, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/newest/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = safify(req.query.status);
  const page = safify(req.query.page);
  await mnt_parser.get_newest(status, page, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/alltimes/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = safify(req.query.status);
  const page = safify(req.query.page);
  await mnt_parser.get_alltimes(status, page, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/genres/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const cache = req.query.cache;
  await mnt_parser.get_genres(cache, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/filter/:genre/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  const status = safify(req.query.status);
  const page = safify(req.query.page);
  const genre = req.params.genre;
  await mnt_parser.filter(genre, status, page, (results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});

app.get("/manga/top_mangas/", async function (req, res) {
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };
  await mnt_parser.get_top_mangas((results) => {
    data = results;
  });
  res.status(data.status_code).json(data);
});
/************* MANGAS=>end ****************/

/************* ANIME ****************/
//? 9animetv.to site = 1
//? kaido.to site = 2
//? zoro.to site = 3

app.get("/anime/:site/az-list/:letter/", async function (req, res) {
  const site = req.params.site;
  const letter = req.params.letter;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_letter_animes(letter, page, (results) => {
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

app.get("/anime/:site/filter/", async function (req, res) {
  const site = req.params.site;
  const keyword = req.query.keyword;
  const type = req.query.type;
  const status = "all";
  const language = req.query.language;
  const sort = "default";
  const year = req.query.year;
  const season = req.query.season;
  const genre = req.query.genre;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_search_animes(
      {
        keyword: safify(keyword),
        type: safify(type),
        status: safify(status),
        season: safify(season),
        language: safify(language),
        sort: safify(sort),
        year: safify(year),
        genre: safify(genre),
      },
      (results) => {
        data = results;
      }
    );
  }

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/results/", async function (req, res) {
  const site = req.params.site;
  let keyword = safify(req.query.keyword) != "" ? encodeURI(safify(req.query.keyword)) : "";
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_search_animes(keyword, (results) => {
  // data = results;
  // }
  // );
  // }

  if (site == 2) {
    await zoro_anime_parser.get_anime_results(keyword, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/sliders/", async function (req, res) {
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_slider_animes((results) => {
      data = results;
    });
  }

  if (site == 2) {
    await zoro_anime_parser.get_slider_animes((results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_slider_animes((results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/top_animes/", async function (req, res) {
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

app.get("/anime/:site/recent/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_recent_animes((results) => {
      data = results;
    });
  }

  if (site == 2) {
    await zoro_anime_parser.get_recent_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_recent_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/sub/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_sub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_sub_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_sub_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/dub/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_dub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_dub_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_dub_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/popular/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_dub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_popular_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_popular_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/top_airing/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_dub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_top_airing_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_top_airing_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/new/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_new_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_new_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_new_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/upcoming/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_dub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_upcoming_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_upcoming_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/complete/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_dub_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_complateed_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_complateed_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/movies/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_movies_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_movies_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_movies_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/tv/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_tv_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_tv_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_tv_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/ova/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_ova_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_ova_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_ova_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/ona/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_ona_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_ona_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_ona_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/special/", async function (req, res) {
  const site = req.params.site;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_special_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_special_animes(page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_special_animes(page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/genre/:genre", async function (req, res) {
  const site = req.params.site;
  const genre = req.params.genre;
  const page = safify(req.query.page);
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  // if (site == 1) {
  // await nine_anime_parser.get_special_animes((results) => {
  // data = results;
  // });
  // }

  if (site == 2) {
    await zoro_anime_parser.get_genre_animes(genre, page, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_genre_animes(genre, page, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/watch_types/", async function (req, res) {
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

app.get("/anime/:site/schedule/days/", async function (req, res) {
  const site = req.params.site;
  const tz_offset = safify(req.query.tz_offset);
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

app.get("/anime/:site/schedule/animes/", async function (req, res) {
  const site = req.params.site;
  const date = safify(req.query.date);
  const tz_offset = safify(req.query.tz_offset);
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

app.get("/anime/:site/details/:slug/", async function (req, res) {
  const slug = req.params.slug;
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  if (site == 1) {
    await nine_anime_parser.get_anime_info(slug, (results) => {
      data = results;
    });
  }

  if (site == 2) {
    await kaido_anime_parser.get_anime_info(slug, (results) => {
      data = results;
    });
  }

  if (site == 3) {
    await kaido_anime_parser.get_anime_info(slug, (results) => {
      data = results;
    });
  }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/servers/:episode_id/", async function (req, res) {
  const episode_id = req.params.episode_id;
  const site = req.params.site;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  await get_anime_episode_servers(site, episode_id, (results) => {
    data = results;
  });

  // if ( site === 2) {
  // await zoro_anime_parser.get_recent(site, (results) => {
  // data = results;
  // });
  // }

  res.status(data.status_code).json(data);
});

app.get("/anime/:site/sources/:server_id/", async function (req, res) {
  const server_id = req.params.server_id;
  const site = req.params.site;
  const proxy = req.query.proxy;
  let data = { status_code: NOT_FOUND, message: NOT_FOUND_MSG };

  await get_episode_sources(proxy, site, server_id, (results) => {
    data = results;
  });
  
  res.status(data.status_code).json(data);
});
/************* ANIME=>end ****************/

//? 404 HANDLER
app.get("*", function (req, res) {
  const routes = app._router.stack.filter((r) => r.route && r.route.methods.get).map((r) => r.route.path);
  const message = "path " + req.originalUrl + " is " + NOT_FOUND_MSG;

  let aval_routes = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (!route.includes(req.originalUrl)) continue;

    aval_routes.push(route);
  }

  res.status(NOT_FOUND).json({ status_code: NOT_FOUND, message: message, aval_routes: aval_routes });
});
//? 404 HANDLER
