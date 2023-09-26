
export class ZoroAnimeParser {
  async zoro_browsing_page_parser(scrape_url) {
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const response = await axios(request_option).catch((error) => {
      return { status_code: error.status_code };
    });
    const status_code = response.status;

    if (status_code == SUCESSFUL) {
      const html = response.data;
      const $ = cheerio.load(html);
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const title = $("head > title").text();

      if (title.search("404 ") != -1) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const page = $(".page-item.active>.page-link").text();
      const pages = $(".page-item:last-child>.page-link").attr("href").split("?page=")[1];

      let animes = [];
      $(".film_list-wrap>.flw-item").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const type = this_ele.find(".fdi-item:first-child").text();
        const durataion = this_ele.find(".fdi-item.fdi-duration").text();
        const description = this_ele.find(".description").text().trim();
        const temp_source = this_ele.find(".film-poster-ahref").attr("href");
        let source = zoro_host + "/anime" + temp_source;
        const slug = temp_source.replace("/", "");
        const temp = slug.split("-");
        const anime = temp[temp.length - 1];
        const image_url = poster_wrapper.data("src");
        const title = poster_wrapper.attr("alt");
        const jpname = this_ele.find(".dynamic-name").data("jname");
        const pg_rate = this_ele.find(".tick-rate").text();
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
          pg_rate,
          description,
          durataion,
          type,
        });
      });

      return {
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
    }

    return {
      status_code: CRASH,
      message: CRASH_MSG,
    };
  }

  async get_slider_animes(callback) {
    const scrape_url = `${zoro_host}/home`;
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
        const image_ele = this_ele.find(".film-poster-img");
        const type = this_ele.find(".scd-item:first-child").text().trim();
        const duration = this_ele.find(".scd-item:nth-child(2)").text().trim();
        const date = this_ele.find(".scd-item:nth-child(3)").text().trim();
        const quality = this_ele.find(".scd-item>span.quality").text().trim();
        const title = this_ele.find(".dynamic-name").text();
        const jpname = this_ele.find(".dynamic-name").data("jname");
        const pg_rate = this_ele.find(".tick-rate").text();
        const image_url = image_ele.data("src");
        const description = info_wrapper.children(".desi-description").text().trim();
        const slug = info_wrapper.children(".desi-buttons").children("a").attr("href").split("/")[2];
        let ticks = {};
        this_ele.find(".tick-item").each(async function (i, ele) {
          const this_inner_ele = $(this);
          const id = this_inner_ele.attr("class").split(" ")[1].split("-")[1];
          const watch_type = this_inner_ele.text().trim();

          ticks[id] = watch_type;
        });

        sliders.push({
          slug,
          title,
          jpname,
          pg_rate,
          image_url,
          description,
          ticks,
          type,
          date,
          quality,
          duration,
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

  async get_anime_results(keyword, callback) {
    const scrape_url = `${zoro_host}/ajax/search/suggest?keyword=${keyword}`;
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
      let results = [];
      $(".nav-item").each(async function (i, ele) {
        const this_ele = $(this);
        const image_ele = this_ele.find(".film-poster-img");
        const slug = this_ele.attr("href").split("?")[0].split("/")[1];
        const title = image_ele.attr("alt");
        const image_url = image_ele.data("src");
        const alias = this_ele.find(".alias-name").text();
        const info = this_ele.find(".film-infor").text();
        const realise_date = this_ele.find(".film-infor>span:first-child").text();
        const duration = this_ele.find(".film-infor>span:last-child").text();
        const type = info.trim().replace(realise_date, "").replace(duration, "");

        if (slug == "search" && slug == "") return null;
        if (alias == "" && realise_date == "" && duration == "" && type == "") return null;

        results.push({
          slug,
          title,
          image_url,
          alias,
          realise_date,
          duration,
          type,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          results: results,
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
    const scrape_url = `${zoro_host}/${slug}`;
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
      const anime_detail_wrapper = $(".anis-content");
      const image_ele = anime_detail_wrapper.find(".film-poster-img");
      const type = anime_detail_wrapper.find(".anisc-detail .item").first().text();
      const quality = anime_detail_wrapper.find(".tick-item").first().text();
      const jpname = anime_detail_wrapper.find(".dynamic-name").data("jname");
      const image_url = image_ele.attr("src");
      const title = anime_detail_wrapper.find(".breadcrumb-item.dynamic-name.active").text();
      const temp = slug.split("-");
      const anime_id = temp[temp.length - 1];
      const episodes = await get_anime_episodes(site, anime_id);
      const description = anime_detail_wrapper.find(".film-description").children(".text").text().trim();
      let alternative_names = [title, jpname];
      let genres = [];
      let studios = [];
      let views = "";
      let meta_items = { type, quality, views };
      let data = {};

      $(".item-title, .item-list").each(async function (i, ele) {
        const this_ele = $(this);
        const head = this_ele.find(".item-head").text().toLowerCase();

        let name = "";

        if (head == "overview:") return null;

        if (head == "genres:") {
          let val = "";
          this_ele.find("a").each(async function (i, ele) {
            val += " " + $(this).text();

            genres.push($(this).text().trim());
          });
          meta_items.genre = val.trim();
          return null;
        }

        if (head == "producers:") {
          let val = "";
          this_ele.find(".name").each(async function (i, ele) {
            val += " " + $(this).text();
          });
          meta_items.producers = val.trim();
          return null;
        }

        if (head == "studios:") {
          let val = "";
          this_ele.find(".name").each(async function (i, ele) {
            val += " " + $(this).text();
          });
          meta_items.studios = val.trim();
          return null;
        }

        const val = this_ele.find(".name").text();

        if (head == "japanese:" || head == "synonyms:") {
          alternative_names.push(val);
          return null;
        }

        if (head == "aired:") {
          meta_items.date_aired = val;
          return null;
        }

        if (head == "status:") {
          meta_items.status = val;
          return null;
        }

        if (head == "premiered:") {
          meta_items.premiered = val;
          return null;
        }

        if (head == "duration:") {
          meta_items.duration = val;
          return null;
        }

        if (head == "mal score:") {
          meta_items.scores = val;
          return null;
        }
      });

      let related_animes = [];
      $("div#main-sidebar .anif-block-ul>.ulclear>li").each(async function (i, ele) {
        const this_ele = $(this);
        const image_ele = this_ele.find(".film-poster-img");
        const slug = this_ele.find(".dynamic-name").attr("href").split("/")[2];
        const image_url = image_ele.data("src");
        const title = image_ele.attr("alt");
        const dub = this_ele.find(".tick-dub").text().trim();
        const sub = this_ele.find(".tick-sub").text().trim();

        related_animes.push({
          slug,
          title,
          image_url,
          dub,
          sub,
        });
      });

      let series = [];
      $(".os-list>a").each(async function (i, ele) {
        const this_ele = $(this);
        const image_ele = this_ele.find(".season-poster");
        const slug = this_ele.attr("href").replace("/", "");
        const anime_title = this_ele.attr("title");
        const image_url = image_ele.css("background-image").replace("url(", "").replace(")", "");
        const title = this_ele.find(".title").text();

        series.push({
          slug,
          title,
          anime_title,
          image_url,
        });
      });
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
          jpname: jpname,
          image_url: image_url,
          description: description,
          alternative_names: alternative_names,
          meta_items: meta_items,
          slug: slug,
          anime_id: anime_id,
          episodes: episodes,
          genres: genres,
          related_animes: related_animes,
          series: series,
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

  async get_next_ep_date(slug, callback) {
    const scrape_url = `${zoro_host}/watch/${slug}`;
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
      const date = $("#schedule-date").data("value");
      const referer = new URL(scrape_url);
      const host = referer.hostname;

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          date: date,
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

  async get_recent_animes(page, callback) {
    const scrape_url = `${zoro_host}/recently-updated?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_sub_animes(page, callback) {
    const scrape_url = `${zoro_host}/subbed-anime?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_dub_animes(page, callback) {
    const scrape_url = `${zoro_host}/dubbed-anime?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_popular_animes(page, callback) {
    const scrape_url = `${zoro_host}/most-popular?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_top_airing_animes(page, callback) {
    const scrape_url = `${zoro_host}/top-airing?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_new_animes(page, callback) {
    const scrape_url = `${zoro_host}/recently-added?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_upcoming_animes(page, callback) {
    const scrape_url = `${zoro_host}/top-upcoming?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_complateed_animes(page, callback) {
    const scrape_url = `${zoro_host}/completed?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_movies_animes(page, callback) {
    const scrape_url = `${zoro_host}/movie?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_tv_animes(page, callback) {
    const scrape_url = `${zoro_host}/tv?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_ova_animes(page, callback) {
    const scrape_url = `${zoro_host}/ova?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_ona_animes(page, callback) {
    const scrape_url = `${zoro_host}/ona?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_special_animes(page, callback) {
    const scrape_url = `${zoro_host}/special?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_genre_animes(genre, page, callback) {
    const scrape_url = `${zoro_host}/genre/${genre}?page=${page}`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_search_animes(data, callback) {
    const keyword = data.keyword != "" ? `keyword=${data.keyword}` : "";
    const type = data.type != "" ? `type=${data.type}` : "";
    const year = data.year != "" ? `sy=${data.year}` : "";
    const status = data.status != "" ? `status=${data.status}` : "";
    const language = data.language != "" ? `language=${data.language}` : "";
    const genre = data.genre != "" ? `genre=${data.genre}` : "";
    const page = data.page != "" ? `page=${data.page}` : "";
    let scrape_url = `${zoro_host}/search`;

    let is_first = true;
    for (let item of [keyword, type, year, status, language, genre, page]) {
      if (item != "") {
        scrape_url += is_first ? "?" + item : "$" + item;

        if (is_first) is_first = false;
      }
    }

    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  /***** Code in this comment block uses 9animetv.to as host *****/
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
  /***** Code in this comment block uses 9animetv.to as host *****/
}
