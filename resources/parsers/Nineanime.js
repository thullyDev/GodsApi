
export class NineAnimeParser {
  constructor() {
    this.watch_types = {
      genre: [
        {
          id: "genre-1",
          name: "Action",
        },
        {
          id: "genre-2",
          name: "Adventure",
        },
        {
          id: "genre-3",
          name: "Cars",
        },
        {
          id: "genre-4",
          name: "Comedy",
        },
        {
          id: "genre-5",
          name: "Dementia",
        },
        {
          id: "genre-6",
          name: "Demons",
        },
        {
          id: "genre-8",
          name: "Drama",
        },
        {
          id: "genre-9",
          name: "Ecchi",
        },
        {
          id: "genre-10",
          name: "Fantasy",
        },
        {
          id: "genre-11",
          name: "Game",
        },
        {
          id: "genre-35",
          name: "Harem",
        },
        {
          id: "genre-13",
          name: "Historical",
        },
        {
          id: "genre-14",
          name: "Horror",
        },
        {
          id: "genre-44",
          name: "Isekai",
        },
        {
          id: "genre-43",
          name: "Josei",
        },
        {
          id: "genre-15",
          name: "Kids",
        },
        {
          id: "genre-16",
          name: "Magic",
        },
        {
          id: "genre-17",
          name: "Martial Arts",
        },
        {
          id: "genre-18",
          name: "Mecha",
        },
        {
          id: "genre-38",
          name: "Military",
        },
        {
          id: "genre-19",
          name: "Music",
        },
        {
          id: "genre-7",
          name: "Mystery",
        },
        {
          id: "genre-20",
          name: "Parody",
        },
        {
          id: "genre-39",
          name: "Police",
        },
        {
          id: "genre-40",
          name: "Psychological",
        },
        {
          id: "genre-22",
          name: "Romance",
        },
        {
          id: "genre-21",
          name: "Samurai",
        },
        {
          id: "genre-23",
          name: "School",
        },
        {
          id: "genre-24",
          name: "Sci-Fi",
        },
        {
          id: "genre-42",
          name: "Seinen",
        },
        {
          id: "genre-25",
          name: "Shoujo",
        },
        {
          id: "genre-26",
          name: "Shoujo Ai",
        },
        {
          id: "genre-27",
          name: "Shounen",
        },
        {
          id: "genre-28",
          name: "Shounen Ai",
        },
        {
          id: "genre-36",
          name: "Sliceof Life",
        },
        {
          id: "genre-29",
          name: "Space",
        },
        {
          id: "genre-30",
          name: "Sports",
        },
        {
          id: "genre-31",
          name: "Super Power",
        },
        {
          id: "genre-37",
          name: "Supernatural",
        },
        {
          id: "genre-41",
          name: "Thriller",
        },
        {
          id: "genre-32",
          name: "Vampire",
        },
      ],
      country: [],
      season: [
        {
          id: "season-1",
          name: "Spring",
        },
        {
          id: "season-2",
          name: "Summer",
        },
        {
          id: "season-3",
          name: "Fall",
        },
        {
          id: "season-4",
          name: "Winter",
        },
      ],
      year: [
        {
          name: "2023",
        },
        {
          name: "2022",
        },
        {
          name: "2021",
        },
        {
          name: "2020",
        },
        {
          name: "2019",
        },
        {
          name: "2018",
        },
        {
          name: "2017",
        },
        {
          name: "2016",
        },
        {
          name: "2015",
        },
        {
          name: "2014",
        },
        {
          name: "2013",
        },
        {
          name: "2012",
        },
        {
          name: "2011",
        },
        {
          name: "2010",
        },
        {
          name: "2009",
        },
        {
          name: "2008",
        },
        {
          name: "2007",
        },
        {
          name: "2006",
        },
        {
          name: "2005",
        },
        {
          name: "2004",
        },
        {
          name: "2003",
        },
        {
          name: "2002",
        },
        {
          name: "2001",
        },
      ],
      type: [
        {
          id: "type-1",
          name: "Movie",
        },
        {
          id: "type-2",
          name: "T V Series",
        },
        {
          id: "type-3",
          name: "O V A",
        },
        {
          id: "type-4",
          name: "O N A",
        },
        {
          id: "type-5",
          name: "Special",
        },
        {
          id: "type-6",
          name: "Music",
        },
      ],
      status: [
        {
          id: "status-all",
          name: "All",
        },
        {
          id: "status-1",
          name: "Finished Airing",
        },
        {
          id: "status-2",
          name: "Currently Airing",
        },
        {
          id: "status-3",
          name: "Notyetaired",
        },
      ],
      language: [
        {
          id: "lang-sub",
          name: "Subbed",
        },
        {
          id: "lang-dub",
          name: "Dubbed",
        },
      ],
      sort: [
        {
          name: "Default",
        },
        {
          name: "Recently Updated",
        },
        {
          name: "Recently Added",
        },
        {
          name: "Name A-Z",
        },
        {
          name: "Most Watched",
        },
        {
          name: "Score",
        },
        {
          name: "Released Date",
        },
      ],
    };
  }

  //******* watch page todo-list *********
  // TODO: anime info 9animetv.to
  // TODO: related animes 9animetv.to
  // TODO: sources info 9animetv.to
  // TODO: browsing/studios 9animetv.to

  async get_slider_animes(callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let sliders = [];
      $("#slider>.swiper-wrapper>.swiper-slide>.deslide-item").each(async function (i, ele) {
        const this_ele = $(this);
        const info_wrapper = this_ele.children(".deslide-item-content");
        const title = info_wrapper.children(".desi-head-title").children("a").text();
        const description = info_wrapper.children(".desi-description").text().trim();
        const slug = info_wrapper.children(".desi-buttons").children("a").attr("href").split("/")[2];
        const image_url = this_ele
          .children(".deslide-cover")
          .children(".deslide-cover-img")
          .children(".film-poster-img")
          .attr("src");

        sliders.push({
          slug,
          title,
          image_url,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          sliders: sliders,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_recent_animes(callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let animes = [];
      $(".film_list-wrap>.flw-item>.film-poster").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const source = this_ele.find(".film-poster-ahref").attr("href");
        const slug = source.split("/")[2];
        const temp = slug.split("-");
        const anime_id = temp[temp.length - 1];
        const image_url = poster_wrapper.data("src");
        const title = poster_wrapper.attr("alt");
        let ticks = {};
        tick_item_wrapper.each(async function (i, ele) {
          const this_inner_ele = $(this);
          const id = this_inner_ele.attr("class").split(" ")[1].split("-")[1];
          const watch_type = this_inner_ele.text().trim();

          ticks[id] = watch_type;
        });

        animes.push({
          source,
          anime,
          slug,
          title,
          image_url,
          ticks,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          animes: animes,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_letter_animes(letter, page, callback) {
    const scrape_url = `${nine_anime_host}/az-list/${letter}?page=${page}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const page = $(".ap__-input>.input-page").val();
      const pages = $(".ap__-input>.btn.btn-sm.btn-blank").text().replace("of ", "").replace("page", "");
      let animes = [];
      $("div.anime-block-ul>ul.ulclear>li").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const source = this_ele.find(".dynamic-name").attr("href");
        const year = this_ele.find(".fdi-item:nth-child(1)").text();
        const episodes = this_ele.find(".fdi-duration").text().trim().replace("Ep ", "");
        const slug = source.split("/")[2];
        const temp = slug.split("-");
        const anime_id = temp[temp.length - 1];
        const image_url = poster_wrapper.data("src");
        const title = poster_wrapper.attr("alt");

        animes.push({
          source,
          anime_id,
          slug,
          title,
          image_url,
          year,
          episodes,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          animes: animes,
          meta_data: {
            page: page,
            pages: pages,
          },
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_search_animes(data, callback) {
    const scrape_url = `${nine_anime_host}/filter?keyword=${data.keyword}&type=${data.type}&status=${data.status}&season=${data.season}&language=${data.language}&sort=${data.sort}&year=${data.year}&genre=${data.genre}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const page = $(".ap__-input>.input-page").val();
      const pages = $(".ap__-input>.btn.btn-sm.btn-blank").text().replace("of ", "").replace("page", "");
      let animes = [];
      $(".film_list-wrap>.flw-item").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const source = this_ele.find(".film-poster-ahref").attr("href");
        const slug = source.split("/")[2];
        const temp = slug.split("-");
        const anime = temp[temp.length - 1];
        const image_url = poster_wrapper.data("src");
        const jpname = this_ele.find(".dynamic-name").data("jname");
        const title = poster_wrapper.attr("alt");
        let ticks = {};
        tick_item_wrapper.each(async function (i, ele) {
          const this_inner_ele = $(this);
          const id = this_inner_ele.attr("class").split(" ")[1].split("-")[1];
          const watch_type = this_inner_ele.text().trim();

          ticks[id] = watch_type;
        });

        animes.push({
          source,
          anime,
          slug,
          title,
          jpname,
          image_url,
          ticks,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          animes: animes,
          meta_data: {
            page: page,
            pages: pages,
          },
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_watch_types(cache, callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let watch_types = this.watch_types;
      if (!cache) {
        $(".sidebar-filter>.item").each(async function (i, ele) {
          const this_ele = $(this);
          const type_id = this_ele.children(".btn-filter").text().trim().toLowerCase().replace(" all", "");
          const item_wrapper = this_ele.find(".ul-filter").children("li");
          let items = [];
          item_wrapper.each(async function (i, ele) {
            const this_inner_ele = $(this);
            const id = this_inner_ele.attr("id");
            const name = this_inner_ele
              .find(".custom-control-label")
              .text()
              .replace(/\s/g, "")
              .replace(/([A-Z])/g, " $1")
              .trim()
              .replace("- ", "-");

            items.push({
              id,
              name,
            });
          });

          watch_types[type_id] = items;
        });
      }
      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          watch_types: watch_types,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_top_animes(callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let top_animes = {};
      $(".anime-block-ul.anif-block-chart.tab-pane").each(async function (i, ele) {
        const this_ele = $(this);
        const top_id = this_ele.attr("id").split("-")[2];
        const top_wrapper = this_ele.children("ul").children("li");
        let list = [];
        top_wrapper.each(async function (i, ele) {
          const this_inner_ele = $(this);
          const top_number = this_inner_ele.children(".film-number").children("span").text();
          const image_url = this_inner_ele.children(".film-poster").children("img").data("src");
          const title = this_inner_ele.children(".film-poster").children("img").attr("alt");
          const slug = this_inner_ele
            .children(".film-detail")
            .children(".film-name")
            .children("a")
            .attr("href")
            .split("/")[2];
          const views = this_inner_ele.children(".film-detail").children(".fd-infor").children(".fdi-item").text();

          list.push({
            top_number,
            title,
            slug,
            image_url,
            views,
          });
        });

        top_animes[top_id] = list;
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          top_animes: top_animes,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_schedule_days(tz_offset, callback) {
    const scrape_url = `${nine_anime_host}/ajax/schedule/widget?tzOffset=${tz_offset}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data.html;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let dates = [];
      $(".day-item").each(async function (i, ele) {
        const this_ele = $(this);
        const whole_date = this_ele.data("date");
        const day = this_ele.find("span").text();
        const date = this_ele.find(".date").text();

        dates.push({
          whole_date,
          day,
          date,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          dates: dates,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_schedule_animes(tz_offset, date, callback) {
    const scrape_url = `${nine_anime_host}/ajax/schedule/list?tzOffset=${tz_offset}&date=${date}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data.html;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let dates = [];
      $(".tsl-link").each(async function (i, ele) {
        const this_ele = $(this);
        const slug = this_ele.attr("href").split("/")[2];
        const time = this_ele.find(".time").text();
        const name = this_ele.find(".film-name").text();
        const episode = this_ele.find(".btn-play").text().replace("Episode", "").trim();

        dates.push({
          slug,
          time,
          name,
          episode,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          dates: dates,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_anime_info(site, slug, callback) {
    const scrape_url = `${nine_anime_host}/watch/${slug}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const anime_detail_wrapper = $(".anime-detail");
      const title = anime_detail_wrapper.find(".film-name").text();
      const image_url = anime_detail_wrapper.find(".film-poster-img").attr("src");
      const description = anime_detail_wrapper.find(".film-description").children(".shorting").text().trim();
      const alternative_names = anime_detail_wrapper.find(".alias").text().split(",");
      const meta_details_items = anime_detail_wrapper.find(".meta").find(".item");
      let genres = [];
      $("div.meta>div.col1>.item:last-child>.item-content>a").each(async function (i, ele) {
        const this_ele = $(this);
        const genre = this_ele.attr("href").split("/")[2];

        genres.push(genre);
      });
      let meta_items = {};
      meta_details_items.each(async function (i, ele) {
        const this_ele = $(this);
        const type = this_ele.children(".item-title").text().replace(":", "").replace(" ", "_").toLowerCase();
        const type_content =
          type != "genre"
            ? this_ele.children(".item-content").children("*").text()
            : this_ele
                .children(".item-content")
                .children("*")
                .text()
                .replace(" ", "")
                .replace(/([A-Z])/g, " $1")
                .trim();

        meta_items[type] = type_content;
      });
      let related_animes = [];
      $("div#main-sidebar .anime-block-ul>.ulclear>li").each(async function (i, ele) {
        const this_ele = $(this);
        const image_ele = this_ele.find(".film-poster-img");
        const slug = this_ele.find(".dynamic-name").attr("href").split("/")[2];
        const image_url = image_ele.data("src");
        const title = image_ele.attr("alt");
        const year = this_ele.find(".fdi-item:first-child").text().trim();
        const eps = this_ele.find(".fdi-item.fdi-duration").text().trim();

        related_animes.push({
          slug,
          title,
          image_url,
          year,
          eps,
        });
      });
      const temp = slug.split("-");
      const anime_id = temp[temp.length - 1];
      const episodes = await get_anime_episodes(site, anime_id);
      const referer = new URL(scrape_url);
      const host = referer.hostname;

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          title: title,
          image_url: image_url,
          description: description,
          alternative_names: alternative_names,
          genres: genres,
          meta_items: meta_items,
          slug: slug,
          anime_id: anime_id,
          episodes: episodes,
          related_animes: related_animes,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: CRASH,
      message: CRASH_MSG,
    };

    callback(response_data);
  }
}
