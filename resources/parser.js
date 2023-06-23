import axios from "axios";
import cheerio from "cheerio";
import CryptoJS from "crypto-js";
import { encode, decode } from "node-base64-image";
import {
  SUCESSFUL,
  NOT_FOUND,
  CRASH,
  SUCESSFUL_MSG,
  NOT_FOUND_MSG,
  CRASH_MSG,
  USER_AGENT,
  mangangato_host,
  nine_anime_host,
  zoro_host,
  print,
} from "../resources/utilities.js";

export class ManganatoParser {
  constructor() {
    this.base_one_host = "https://chapmanganato.com";
    this.base_two_host = "https://ww5.mangakakalot.tv";
    this.genres = [
      {
        name: "ALL",
        id: "genre-all",
      },
      {
        name: "Action",
        id: "genre-2",
      },
      {
        name: "Adventure",
        id: "genre-4",
      },
      {
        name: "Comedy",
        id: "genre-6",
      },
      {
        name: "Cooking",
        id: "genre-7",
      },
      {
        name: "Doujinshi",
        id: "genre-9",
      },
      {
        name: "Drama",
        id: "genre-10",
      },
      {
        name: "Erotica",
        id: "genre-48",
      },
      {
        name: "Fantasy",
        id: "genre-12",
      },
      {
        name: "Gender bender",
        id: "genre-13",
      },
      {
        name: "Harem",
        id: "genre-14",
      },
      {
        name: "Historical",
        id: "genre-15",
      },
      {
        name: "Horror",
        id: "genre-16",
      },
      {
        name: "Isekai",
        id: "genre-45",
      },
      {
        name: "Josei",
        id: "genre-17",
      },
      {
        name: "Manhua",
        id: "genre-44",
      },
      {
        name: "Manhwa",
        id: "genre-43",
      },
      {
        name: "Martial arts",
        id: "genre-19",
      },
      {
        name: "Mature",
        id: "genre-20",
      },
      {
        name: "Mecha",
        id: "genre-21",
      },
      {
        name: "Medical",
        id: "genre-22",
      },
      {
        name: "Mystery",
        id: "genre-24",
      },
      {
        name: "One shot",
        id: "genre-25",
      },
      {
        name: "Pornographic",
        id: "genre-47",
      },
      {
        name: "Psychological",
        id: "genre-26",
      },
      {
        name: "Romance",
        id: "genre-27",
      },
      {
        name: "School life",
        id: "genre-28",
      },
      {
        name: "Sci fi",
        id: "genre-29",
      },
      {
        name: "Seinen",
        id: "genre-30",
      },
      {
        name: "Shoujo",
        id: "genre-31",
      },
      {
        name: "Shoujo ai",
        id: "genre-32",
      },
      {
        name: "Shounen",
        id: "genre-33",
      },
      {
        name: "Shounen ai",
        id: "genre-34",
      },
      {
        name: "Slice of life",
        id: "genre-35",
      },
      {
        name: "Smut",
        id: "genre-36",
      },
      {
        name: "Sports",
        id: "genre-37",
      },
      {
        name: "Supernatural",
        id: "genre-38",
      },
      {
        name: "Tragedy",
        id: "genre-39",
      },
      {
        name: "Webtoons",
        id: "genre-40",
      },
      {
        name: "Yaoi",
        id: "genre-41",
      },
      {
        name: "Yuri",
        id: "genre-42",
      },
    ];
  }

  async get_searches(query, page, callback) {
    const scrape_url = `${mangangato_host}/search/story/${query}?page=${page}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      const total = $(".page-blue").text().split(" : ")[1];
      const page = $(".page-select").text();
      const pages = $(".page-last")
        .text()
        .replace(/[^0-9]/g, "");
      let manga_list = [];
      $(".search-story-item").each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const image_ele = link_ele.children("img");
        const source = link_ele.attr("href");
        const title = link_ele.attr("title");
        const image_url = image_ele.attr("src");
        const rates = link_ele.find(".item-rate").text();
        const views = this_ele.find(".item-time").last().text().replace("View : ", "");
        const update_time = this_ele.find(".item-time").first().text().replace("Updated : ", "");
        const author = this_ele.find(".item-author").text();
        temp = this_ele.find(".item-chapter").attr("href").split("/");
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split("/");
        const manga_id = temp[temp.length - 1];

        manga_list.push({
          source,
          title,
          image_url,
          manga_id,
          latest_chapter_id,
          rates,
          views,
          update_time,
          author,
        });
      });

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
          meta_data: {
            total: total,
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

  async get_panel(image_url, callback) {
    const options = {
      string: true,
      headers: {
        "User-Agent": USER_AGENT,
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/,/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
        Referer: this.base_one_host,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    };
    const raw_base64 = await encode(image_url, options).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const prefix = "data:image/jpeg;base64,";
    const base64 = prefix + raw_base64;
    const response_data = {
      data: {
        base64: base64,
      },
      status_code: SUCESSFUL,
      message: SUCESSFUL_MSG,
    };

    callback(response_data);
    return null;
  }

  async get_panels(manga_id, chapter, site, callback) {
    if (site == 1) {
      const read_url = `${this.base_one_host}/${manga_id}/${chapter}`;
      const request_option = {
        method: "GET",
        url: read_url,
      };

      const manga_response = await axios(request_option).catch((error) => {
        callback({ error: error, status_code: error.status_code });
        return null;
      });
      const status_code = manga_response.status;

      if (status_code) {
        const html = manga_response.data;
        const $ = cheerio.load(html);
        const title = $("head > title").text();

        if (title.search("404 ") != -1) {
          const response_data = {
            status_code: NOT_FOUND,
            message: NOT_FOUND_MSG,
          };
          callback(response_data);
          return null;
        }

        const manga_title = $(".panel-breadcrumb>.a-h:nth-child(3)").text();
        const chapter_title = $(".panel-breadcrumb>.a-h:nth-child(5)").text();
        const referer = new URL(read_url);
        const host = referer.hostname;
        let panels = [];

        $(".container-chapter-reader>img").each(async function (i, ele) {
          const this_ele = $(this);
          const title = this_ele.attr("title");
          const src = this_ele.attr("src");
          const encoded_url = encodeURIComponent(src);

          panels.push({
            title,
            src,
            encoded_url,
          });
        });

        const response_data = {
          status_code: SUCESSFUL_MSG,
          message: SUCESSFUL,
          data: {
            host: host,
            referer: referer,
            read_url: read_url,
            manga_id: manga_id,
            manga_title: manga_title,
            chapter_title: chapter_title,
            chapter: chapter,
            panels_number: panels.length,
            panels: panels,
          },
        };

        callback(response_data);
        return null;
      }

      if (status_code === NOT_FOUND) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const response_data = {
        status_code: CRASH,
        message: CRASH_MSG,
      };

      callback(response_data);
      return null;
    }

    const scrape_url = `${this.base_two_host}/chapter/${manga_id}/${chapter}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const manga_response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });

    const status_code = manga_response.status;

    if (status_code) {
      const html = manga_response.data;
      const $ = cheerio.load(html);
      const title = $("head > title").text();

      if (title.search("404 ") != -1) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const manga_title = $("span:nth-child(4) span").text();
      const chapter_title = $("span:nth-child(6) span").text();
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let panels = [];

      $(".img-loading").each(async function (i, ele) {
        const this_ele = $(this);
        const title = this_ele.attr("title").replace(" - Manganato", "");
        const image_url = this_ele.data("src");

        panels.push({
          title,
          image_url,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          url: scrape_url,
          manga_id: manga_id,
          manga_title: manga_title,
          chapter_title: chapter_title,
          chapter: chapter,
          panels_number: panels.length,
          panels: panels,
        },
      };

      callback(response_data);
      return null;
    }

    if (status_code === NOT_FOUND) {
      const response_data = {
        status_code: status_code,
        message: NOT_FOUND_MSG,
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: status_code,
      message: CRASH_MSG,
    };

    callback(response_data);
    return null;
  }

  async get_manga_info(manga_id, callback) {
    const scrape_url = `${mangangato_host}/${manga_id}`;
    const request_option = {
      method: "GET",
      url: scrape_url,
    };
    const manga_response = await axios(request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const status_code = manga_response.status;

    if (status_code == SUCESSFUL) {
      const html = manga_response.data;
      const $ = cheerio.load(html);
      const title = $("head > title").text();

      if (title.search("404 ") != -1) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const image_url = $(".info-image>.img-loading").attr("src");
      const manga_title = $(".story-info-right>h1").text();
      const description = $("#panel-story-info-description").text().replace("\nDescription :\n", "");
      const alt_names = $(".variations-tableInfo tr:nth-child(1)>.table-value>h2").text();
      const status = $(".variations-tableInfo tr:nth-child(3)>.table-value").text();
      const updates = $(".story-info-right-extent>p:nth-child(1)>span.stre-value").text();
      // const groups = $('.manga-info-text>li:nth-child(5)').text().replace("TransGroup : ", "")
      const views = $(".story-info-right-extent>p:nth-child(2)>span.stre-value").text();
      const rates = $("#rate_row_cmd>em>em:nth-child(2)>em>em:nth-child(1)").text() + "/5";
      let genres = [];
      $(".variations-tableInfo tr:nth-child(4)>.table-value>.a-h").each(async function (i, ele) {
        const this_ele = $(this);
        const temp = this_ele.attr("href").split("/"); //? https://manganato.com/manga_list?type=newest&category=10&state=all&page=1
        const id = temp[temp.length - 1];
        const name = this_ele.text();

        genres.push({
          name,
          id,
        });
      });
      let authors = [];
      $(".variations-tableInfo tr:nth-child(2)>.table-value>.a-h").each(async function (i, ele) {
        const this_ele = $(this);
        const temp = this_ele.attr("href").split("/"); //? https://manganato.com/author/story/fHlvbW9naW1vY2hp
        const id = temp[temp.length - 1];
        const name = this_ele.text();

        authors.push({
          id,
          name,
        });
      });
      let chapters = [];
      $(".row-content-chapter>li.a-h").each(async function (i, ele) {
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const views = this_ele.children("span.chapter-view").text();
        const time = this_ele.children("span.chapter-time").text();
        const temp = link_ele.attr("href").split("/");
        const hostname = temp[temp.length - 3];
        const manga_id = temp[temp.length - 2];
        const chapter = temp[temp.length - 1];
        const name = link_ele.text();

        chapters.push({
          manga_id,
          chapter,
          name,
          views,
          time,
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
          image_url: image_url,
          manga_id: manga_id,
          manga_title: manga_title,
          description: description,
          alt_names: alt_names,
          status: status,
          updates: updates,
          // groups: groups,
          views: views,
          rates: rates,
          genres: genres,
          authors: authors,
          chapters: chapters,
          chapters_number: chapters.length,
        },
      };

      callback(response_data);
      return null;
    }

    if (status_code === NOT_FOUND) {
      const response_data = {
        status_code: status_code,
        message: NOT_FOUND_MSG,
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

  async get_latest(status, page, callback) {
    const scrape_url = `${mangangato_host}/genre-all/${page}?state=${status}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      const total = $(".page-blue").text().split(" : ")[1];
      const page = $(".page-select").text(); // https://manganato.com/genre-all/2
      const pages = $(".page-last")
        .text()
        .replace(/[^0-9]/g, "");
      let manga_list = [];
      $(".content-genres-item").each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const image_ele = link_ele.children("img");
        const source = link_ele.attr("href");
        const title = link_ele.attr("title");
        const image_url = image_ele.attr("src");
        const rates = link_ele.children(".genres-item-rate").text();
        const item_info_wrapper = this_ele.children(".genres-item-info");
        const inner_item_info_wrapper = item_info_wrapper.children(".genres-item-view-time");
        const description = item_info_wrapper.children(".genres-item-description").text().trim();
        const views = inner_item_info_wrapper.children(".genres-item-view").text();
        const update_time = inner_item_info_wrapper.children(".genres-item-time").text();
        const author = inner_item_info_wrapper.children(".genres-item-author").text();
        temp = item_info_wrapper.children(".a-h").attr("href").split("/");
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split("/");
        const manga_id = temp[temp.length - 1];

        manga_list.push({
          source,
          title,
          image_url,
          manga_id,
          latest_chapter_id,
          rates,
          views,
          update_time,
          author,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
          meta_data: {
            total: total,
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

  async get_newest(status, page, callback) {
    const scrape_url = `${mangangato_host}/genre-all/${page}?type=newest&state=${status}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      const total = $(".page-blue").text().split(" : ")[1];
      const page = $(".page-select").text(); // https://manganato.com/genre-all/2
      const pages = $(".page-last")
        .text()
        .replace(/[^0-9]/g, "");
      let manga_list = [];
      $(".content-genres-item").each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const image_ele = link_ele.children("img");
        const source = link_ele.attr("href");
        const title = link_ele.attr("title");
        const image_url = image_ele.attr("src");
        const rates = link_ele.children(".genres-item-rate").text();
        const item_info_wrapper = this_ele.children(".genres-item-info");
        const inner_item_info_wrapper = item_info_wrapper.children(".genres-item-view-time");
        const description = item_info_wrapper.children(".genres-item-description").text().trim();
        const views = inner_item_info_wrapper.children(".genres-item-view").text();
        const update_time = inner_item_info_wrapper.children(".genres-item-time").text();
        const author = inner_item_info_wrapper.children(".genres-item-author").text();
        temp = item_info_wrapper.children(".a-h").attr("href").split("/");
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split("/");
        const manga_id = temp[temp.length - 1];

        manga_list.push({
          source,
          title,
          image_url,
          manga_id,
          latest_chapter_id,
          rates,
          views,
          update_time,
          author,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
          meta_data: {
            total: total,
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

  async get_alltimes(status, page, callback) {
    const scrape_url = `${mangangato_host}/genre-all/${page}?type=topview&state=${status}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      const total = $(".page-blue").text().split(" : ")[1];
      const page = $(".page-select").text(); // https://manganato.com/genre-all/2
      const pages = $(".page-last")
        .text()
        .replace(/[^0-9]/g, "");
      let manga_list = [];
      $(".content-genres-item").each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const image_ele = link_ele.children("img");
        const source = link_ele.attr("href");
        const title = link_ele.attr("title");
        const image_url = image_ele.attr("src");
        const rates = link_ele.children(".genres-item-rate").text();
        const item_info_wrapper = this_ele.children(".genres-item-info");
        const inner_item_info_wrapper = item_info_wrapper.children(".genres-item-view-time");
        const description = item_info_wrapper.children(".genres-item-description").text().trim();
        const views = inner_item_info_wrapper.children(".genres-item-view").text();
        const update_time = inner_item_info_wrapper.children(".genres-item-time").text();
        const author = inner_item_info_wrapper.children(".genres-item-author").text();
        temp = item_info_wrapper.children(".a-h").attr("href").split("/");
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split("/");
        const manga_id = temp[temp.length - 1];

        manga_list.push({
          source,
          title,
          image_url,
          manga_id,
          latest_chapter_id,
          rates,
          views,
          update_time,
          author,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
          meta_data: {
            total: total,
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

  async filter(genre, status, page, callback) {
    const scrape_url = `${mangangato_host}/${genre}/${page}?state=${status}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      const total = $(".page-blue").text().split(" : ")[1];
      const page = $(".page-select").text(); // https://manganato.com/genre-all/2
      const pages = $(".page-last")
        .text()
        .replace(/[^0-9]/g, "");
      let manga_list = [];
      $(".content-genres-item").each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children("a");
        const image_ele = link_ele.children("img");
        const source = link_ele.attr("href");
        const title = link_ele.attr("title");
        const image_url = image_ele.attr("src");
        const rates = link_ele.children(".genres-item-rate").text();
        const item_info_wrapper = this_ele.children(".genres-item-info");
        const inner_item_info_wrapper = item_info_wrapper.children(".genres-item-view-time");
        const description = item_info_wrapper.children(".genres-item-description").text().trim();
        const views = inner_item_info_wrapper.children(".genres-item-view").text();
        const update_time = inner_item_info_wrapper.children(".genres-item-time").text();
        const author = inner_item_info_wrapper.children(".genres-item-author").text();
        temp = item_info_wrapper.children(".a-h").attr("href").split("/");
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split("/");
        const manga_id = temp[temp.length - 1];

        manga_list.push({
          source,
          title,
          image_url,
          manga_id,
          latest_chapter_id,
          rates,
          views,
          update_time,
          author,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
          meta_data: {
            total: total,
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

  async get_genres(status, cache, callback) {
    const scrape_url = `${mangangato_host}/genre-all?state=${status}`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      let genres_list = [];
      if (!cache) {
        $("div.panel-genres-list>a.a-h").each(async function (i, ele) {
          const this_ele = $(this);
          const temp = this_ele.attr("href").split("/");
          const id = temp[temp.length - 1];
          const name = this_ele.text();

          genres_list.push({
            name,
            id,
          });
        });
      } else {
        genres_list = this.genres;
      }

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          genres: genres_list,
        },
      };

      callback(response_data);
      return null;
    }

    const response_data = {
      status_code: 503,
      message: CRASH_MSG,
    };

    callback(response_data);
  }

  async get_top_mangas(callback) {
    const scrape_url = `${mangangato_host}/genre-all`;
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
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      const html = response.data;
      const $ = cheerio.load(html);
      let manga_list = [];
      $("div.owl-carousel>div.item").each(async function (i, ele) {
        const this_ele = $(this);
        const img_ele = this_ele.children("img");
        const caption_wrapper = this_ele.children(".slide-caption");
        const link_ele = caption_wrapper.children("a");
        const image_url = img_ele.attr("src");
        const title = img_ele.attr("alt");
        const chapter_name = link_ele.text();
        const url = link_ele.attr("href");
        const temp = url.split("/");
        const chapter_id = temp[temp.length - 1];
        const manga_id = temp[temp.length - 2];
        const chapter = chapter_id.replace(/[^0-9]/g, "");

        manga_list.push({
          url,
          title,
          manga_id,
          chapter_name,
          chapter,
          chapter_id,
          image_url,
        });
      });

      const response_data = {
        status_code: status_code,
        message: "successful",
        data: {
          host: host,
          referer: referer,
          manga_list: manga_list,
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
      $(".film_list-wrap>.flw-item>.film-poster").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const source = this_ele.find(".film-poster-ahref").attr("href");
        const slug = source.split("/")[2];
        const temp = slug.split("-");
        const anime = temp[temp.length - 1];
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

  async get_anime_info(slug, callback) {
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
      const description = anime_detail_wrapper.find(".film-description").children(".shorting").text();
      const alternative_names = anime_detail_wrapper.find(".alias").text().split(",");
      const meta_details_items = anime_detail_wrapper.find(".meta").find(".item");
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
      const temp = slug.split("-");
      const anime_id = temp[temp.length - 1];
      const episodes_url = `${nine_anime_host}/ajax/episode/list/${anime_id}`;
      const episode_request_option = {
        method: "GET",
        url: episodes_url,
      };
      const episode_response = await axios(episode_request_option).catch((error) => {
        callback({ error: error, status_code: error.status_code });
        return null;
      });
      const $$ = cheerio.load(episode_response.data.html);
      let episodes = [];
      $$(".episodes-ul>.ep-item").each(async function (i, ele) {
        const this_ele = $(this);
        const episode_id = JSON.stringify(this_ele.data("id"));
        const episode_slug = this_ele.attr("href");
        const episode_title = this_ele.attr("title");
        const episode_number = JSON.stringify(this_ele.data("number"));

        episodes.push({
          episode_id,
          episode_slug,
          episode_title,
          episode_number,
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
          image_url: image_url,
          description: description,
          alternative_names: alternative_names,
          meta_items: meta_items,
          slug: slug,
          anime_id: anime_id,
          episodes: episodes,
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

export class ZoroAnimeParser {
  async zoro_browsing_page_parser(scrape_url) {
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
      const page = $(".page-item.active>.page-link").text();
      const pages = $(".page-item:last-child>.page-link").attr("href").split("?page=")[1];

      let animes = [];
      $(".film_list-wrap>.flw-item>.film-poster").each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find(".tick-item");
        const poster_wrapper = this_ele.find(".film-poster-img");
        const description = this_ele.find(".description").text();
        const temp_source = this_ele.find(".film-poster-ahref").attr("href");
        let source = zoro_host + "/anime" + temp_source;
        const slug = temp_source.replace("/", "");
        const temp = slug.split("-");
        const anime = temp[temp.length - 1];
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
        const title = image_ele.attr("alt");
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

  async get_recent_animes(callback) {
    const scrape_url = `${zoro_host}/recently-updated`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_sub_animes(callback) {
    const scrape_url = `${zoro_host}/subbed-anime`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_dub_animes(callback) {
    const scrape_url = `${zoro_host}/dubbed-anime`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_popular_animes(callback) {
    const scrape_url = `${zoro_host}/most-popular`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_top_airing_animes(callback) {
    const scrape_url = `${zoro_host}/top-airing`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_new_animes(callback) {
    const scrape_url = `${zoro_host}/recently-added`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_upcoming_animes(callback) {
    const scrape_url = `${zoro_host}/top-upcoming`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_complateed_animes(callback) {
    const scrape_url = `${zoro_host}/completed`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_movies_animes(callback) {
    const scrape_url = `${zoro_host}/movie`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_tv_animes(callback) {
    const scrape_url = `${zoro_host}/tv`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_ova_animes(callback) {
    const scrape_url = `${zoro_host}/ova`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_ona_animes(callback) {
    const scrape_url = `${zoro_host}/ona`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  async get_special_animes(callback) {
    const scrape_url = `${zoro_host}/special`;
    const response_data = await this.zoro_browsing_page_parser(scrape_url);

    callback(response_data);
  }

  // async get_letter_animes(letter, page, callback) {
  // const scrape_url = `${nine_anime_host}/az-list/${letter}?page=${page}`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // const page = $(".ap__-input>.input-page").val();
  // const pages = $(".ap__-input>.btn.btn-sm.btn-blank").text().replace("of ", "").replace("page", "");
  // let animes = [];
  // $("div.anime-block-ul>ul.ulclear>li").each(async function (i, ele) {
  // const this_ele = $(this);
  // const tick_item_wrapper = this_ele.find(".tick-item");
  // const poster_wrapper = this_ele.find(".film-poster-img");
  // const source = this_ele.find(".dynamic-name").attr("href");
  // const year = this_ele.find(".fdi-item:nth-child(1)").text();
  // const episodes = this_ele.find(".fdi-duration").text().trim().replace("Ep ", "");
  // const slug = source.split("/")[2];
  // const temp = slug.split("-");
  // const anime_id = temp[temp.length - 1];
  // const image_url = poster_wrapper.data("src");
  // const title = poster_wrapper.attr("alt");

  // animes.push({
  // source,
  // anime_id,
  // slug,
  // title,
  // image_url,
  // year,
  // episodes,
  // });
  // });

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // animes: animes,
  // meta_data: {
  // page: page,
  // pages: pages,
  // },
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_search_animes(data, callback) {
  // const scrape_url = `${nine_anime_host}/filter?keyword=${data.keyword}&type=${data.type}&status=${data.status}&season=${data.season}&language=${data.language}&sort=${data.sort}&year=${data.year}&genre=${data.genre}`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // const page = $(".ap__-input>.input-page").val();
  // const pages = $(".ap__-input>.btn.btn-sm.btn-blank").text().replace("of ", "").replace("page", "");
  // let animes = [];
  // $(".film_list-wrap>.flw-item>.film-poster").each(async function (i, ele) {
  // const this_ele = $(this);
  // const tick_item_wrapper = this_ele.find(".tick-item");
  // const poster_wrapper = this_ele.find(".film-poster-img");
  // const source = this_ele.find(".film-poster-ahref").attr("href");
  // const slug = source.split("/")[2];
  // const temp = slug.split("-");
  // const anime = temp[temp.length - 1];
  // const image_url = poster_wrapper.data("src");
  // const title = poster_wrapper.attr("alt");
  // let ticks = {};
  // tick_item_wrapper.each(async function (i, ele) {
  // const this_inner_ele = $(this);
  // const id = this_inner_ele.attr("class").split(" ")[1].split("-")[1];
  // const watch_type = this_inner_ele.text().trim();

  // ticks[id] = watch_type;
  // });

  // animes.push({
  // source,
  // anime,
  // slug,
  // title,
  // image_url,
  // ticks,
  // });
  // });

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // animes: animes,
  // meta_data: {
  // page: page,
  // pages: pages,
  // },
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_watch_types(cache, callback) {
  // const scrape_url = `${nine_anime_host}/home`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // let watch_types = this.watch_types;
  // if (!cache) {
  // $(".sidebar-filter>.item").each(async function (i, ele) {
  // const this_ele = $(this);
  // const type_id = this_ele.children(".btn-filter").text().trim().toLowerCase().replace(" all", "");
  // const item_wrapper = this_ele.find(".ul-filter").children("li");
  // let items = [];
  // item_wrapper.each(async function (i, ele) {
  // const this_inner_ele = $(this);
  // const id = this_inner_ele.attr("id");
  // const name = this_inner_ele
  // .find(".custom-control-label")
  // .text()
  // .replace(/\s/g, "")
  // .replace(/([A-Z])/g, " $1")
  // .trim()
  // .replace("- ", "-");

  // items.push({
  // id,
  // name,
  // });
  // });

  // watch_types[type_id] = items;
  // });
  // }
  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // watch_types: watch_types,
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_top_animes(callback) {
  // const scrape_url = `${nine_anime_host}/home`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // let top_animes = {};
  // $(".anime-block-ul.anif-block-chart.tab-pane").each(async function (i, ele) {
  // const this_ele = $(this);
  // const top_id = this_ele.attr("id").split("-")[2];
  // const top_wrapper = this_ele.children("ul").children("li");
  // let list = [];
  // top_wrapper.each(async function (i, ele) {
  // const this_inner_ele = $(this);
  // const top_number = this_inner_ele.children(".film-number").children("span").text();
  // const image_url = this_inner_ele.children(".film-poster").children("img").data("src");
  // const title = this_inner_ele.children(".film-poster").children("img").attr("alt");
  // const slug = this_inner_ele
  // .children(".film-detail")
  // .children(".film-name")
  // .children("a")
  // .attr("href")
  // .split("/")[2];
  // const views = this_inner_ele.children(".film-detail").children(".fd-infor").children(".fdi-item").text();

  // list.push({
  // top_number,
  // title,
  // slug,
  // image_url,
  // views,
  // });
  // });

  // top_animes[top_id] = list;
  // });

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // top_animes: top_animes,
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_schedule_days(tz_offset, callback) {
  // const scrape_url = `${nine_anime_host}/ajax/schedule/widget?tzOffset=${tz_offset}`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data.html;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // let dates = [];
  // $(".day-item").each(async function (i, ele) {
  // const this_ele = $(this);
  // const whole_date = this_ele.data("date");
  // const day = this_ele.find("span").text();
  // const date = this_ele.find(".date").text();

  // dates.push({
  // whole_date,
  // day,
  // date,
  // });
  // });

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // dates: dates,
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_schedule_animes(tz_offset, date, callback) {
  // const scrape_url = `${nine_anime_host}/ajax/schedule/list?tzOffset=${tz_offset}&date=${date}`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data.html;
  // const $ = cheerio.load(html);
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;
  // let dates = [];
  // $(".tsl-link").each(async function (i, ele) {
  // const this_ele = $(this);
  // const slug = this_ele.attr("href").split("/")[2];
  // const time = this_ele.find(".time").text();
  // const name = this_ele.find(".film-name").text();
  // const episode = this_ele.find(".btn-play").text().replace("Episode", "").trim();

  // dates.push({
  // slug,
  // time,
  // name,
  // episode,
  // });
  // });

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // dates: dates,
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }

  // async get_anime_info(slug, callback) {
  // const scrape_url = `${nine_anime_host}/watch/${slug}`;
  // const request_option = {
  // method: "GET",
  // url: scrape_url,
  // };
  // const response = await axios(request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const status_code = response.status;

  // if (status_code == SUCESSFUL) {
  // const html = response.data;
  // const $ = cheerio.load(html);
  // const anime_detail_wrapper = $(".anime-detail");
  // const title = anime_detail_wrapper.find(".film-name").text();
  // const image_url = anime_detail_wrapper.find(".film-poster-img").attr("src");
  // const description = anime_detail_wrapper.find(".film-description").children(".shorting").text();
  // const alternative_names = anime_detail_wrapper.find(".alias").text().split(",");
  // const meta_details_items = anime_detail_wrapper.find(".meta").find(".item");
  // let meta_items = {};
  // meta_details_items.each(async function (i, ele) {
  // const this_ele = $(this);
  // const type = this_ele.children(".item-title").text().replace(":", "").replace(" ", "_").toLowerCase();
  // const type_content =
  // type != "genre"
  // ? this_ele.children(".item-content").children("*").text()
  // : this_ele
  // .children(".item-content")
  // .children("*")
  // .text()
  // .replace(" ", "")
  // .replace(/([A-Z])/g, " $1")
  // .trim();

  // meta_items[type] = type_content;
  // });
  // const temp = slug.split("-");
  // const anime_id = temp[temp.length - 1];
  // const episodes_url = `${nine_anime_host}/ajax/episode/list/${anime_id}`;
  // const episode_request_option = {
  // method: "GET",
  // url: episodes_url,
  // };
  // const episode_response = await axios(episode_request_option).catch((error) => {
  // callback({ error: error, status_code: error.status_code });
  // return null;
  // });
  // const $$ = cheerio.load(episode_response.data.html);
  // let episodes = [];
  // $$(".episodes-ul>.ep-item").each(async function (i, ele) {
  // const this_ele = $(this);
  // const episode_id = JSON.stringify(this_ele.data("id"));
  // const episode_slug = this_ele.attr("href");
  // const episode_title = this_ele.attr("title");
  // const episode_number = JSON.stringify(this_ele.data("number"));

  // episodes.push({
  // episode_id,
  // episode_slug,
  // episode_title,
  // episode_number,
  // });
  // });
  // const referer = new URL(scrape_url);
  // const host = referer.hostname;

  // const response_data = {
  // status_code: status_code,
  // message: "successful",
  // data: {
  // host: host,
  // referer: referer,
  // url: scrape_url,
  // title: title,
  // image_url: image_url,
  // description: description,
  // alternative_names: alternative_names,
  // meta_items: meta_items,
  // slug: slug,
  // anime_id: anime_id,
  // episodes: episodes,
  // },
  // };

  // callback(response_data);
  // return null;
  // }

  // const response_data = {
  // status_code: CRASH,
  // message: CRASH_MSG,
  // };

  // callback(response_data);
  // }
}

export async function get_anime_episode_servers(episode_id, callback) {
  const scrape_url = `${zoro_host}/ajax/v2/episode/servers?episodeId=${episode_id}`;
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
    let sub_servers = [];
    let dub_servers = [];
    let servers = {
      sub_servers,
      dub_servers,
    };
    $(".server-item").each(function (i, ele) {
      const this_ele = $(this);
      const type = this_ele.data("type").toLowerCase();
      const source_id = JSON.stringify(this_ele.data("id"));
      const server_id = JSON.stringify(this_ele.data("server-id"));
      const server_name = this_ele.text().trim();
      servers[type + "_servers"].push({
        type,
        source_id,
        server_id,
        server_name,
      });
    });

    const response_data = {
      status_code: status_code,
      message: SUCESSFUL_MSG,
      data: {
        host: host,
        referer: referer,
        url: scrape_url,
        servers: servers,
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

export async function get_episode_sources(server_id, callback) {
  const url = `${zoro_host}/ajax/v2/episode/sources?id=${server_id}`;
  const request_option = {
    method: "GET",
    url: url,
  };
  const response = await axios(request_option).catch((error) => {
    callback({ error: error, status_code: error.status_code });
    return null;
  });
  const status_code = response.status;

  if (status_code == SUCESSFUL) {
    const rapid_link = response.data.link;
    const temp = rapid_link.split("?")[0].split("/");
    const rapid_id = temp[temp.length - 1];
    const rapid_sources_link = "https://rapid-cloud.co/ajax/embed-6/getSources?id=" + rapid_id;
    const rapid_request_option = {
      method: "GET",
      url: rapid_sources_link,
    };
    const rapid_response = await axios(rapid_request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });

    if (rapid_response.data.encrypted == false) {
      const source_data = rapid_response.data;
      delete source_data.encrypted;
      const referer = new URL(url);
      const host = referer.hostname;

      const response_data = {
        status_code: status_code,
        message: SUCESSFUL_MSG,
        data: {
          host: host,
          referer: referer,
          source_data: source_data,
        },
      };
    }

    const decrypt_key_link = "https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt";
    const decrypt_request_option = {
      method: "GET",
      url: decrypt_key_link,
    };
    const decrypt_response = await axios(decrypt_request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });

    const encrypted_source = rapid_response.data.sources;
    const encrypted_bk_source = rapid_response.data.sourcesBackup;
    const decrypt_key = decrypt_response.data;
    let raw_sources = {};
    let sources = "";
    let raw_bk_sources = {};
    let bk_sources = "";

    try {
      raw_sources = CryptoJS.AES.decrypt(encrypted_source, decrypt_key);
      sources = JSON.parse(raw_sources.toString(CryptoJS.enc.Utf8));
      raw_bk_sources = CryptoJS.AES.decrypt(encrypted_bk_source, decrypt_key);
      bk_sources = JSON.parse(raw_sources.toString(CryptoJS.enc.Utf8));
    } catch {
      callback({ error: "couldn't get source", status_code: CRASH });
      return null;
    }

    const source_data = rapid_response.data;
    source_data.sources = sources;
    source_data.sourcesBackup = bk_sources;

    delete source_data.encrypted;

    const referer = new URL(url);
    const host = referer.hostname;

    const response_data = {
      status_code: status_code,
      message: SUCESSFUL_MSG,
      data: {
        host: host,
        referer: referer,
        source_data: source_data,
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
