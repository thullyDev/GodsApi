import axios from 'axios';
import cheerio from 'cheerio';
import { encode, decode } from 'node-base64-image';
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
  print,
} from '../resources/utilities.js';

export class ManganatoParser {
  constructor() {
    this.base_one_host = 'https://chapmanganato.com';
    this.base_two_host = 'https://ww5.mangakakalot.tv';
    this.genres = [
      {
        name: 'ALL',
        id: 'genre-all',
      },
      {
        name: 'Action',
        id: 'genre-2',
      },
      {
        name: 'Adventure',
        id: 'genre-4',
      },
      {
        name: 'Comedy',
        id: 'genre-6',
      },
      {
        name: 'Cooking',
        id: 'genre-7',
      },
      {
        name: 'Doujinshi',
        id: 'genre-9',
      },
      {
        name: 'Drama',
        id: 'genre-10',
      },
      {
        name: 'Erotica',
        id: 'genre-48',
      },
      {
        name: 'Fantasy',
        id: 'genre-12',
      },
      {
        name: 'Gender bender',
        id: 'genre-13',
      },
      {
        name: 'Harem',
        id: 'genre-14',
      },
      {
        name: 'Historical',
        id: 'genre-15',
      },
      {
        name: 'Horror',
        id: 'genre-16',
      },
      {
        name: 'Isekai',
        id: 'genre-45',
      },
      {
        name: 'Josei',
        id: 'genre-17',
      },
      {
        name: 'Manhua',
        id: 'genre-44',
      },
      {
        name: 'Manhwa',
        id: 'genre-43',
      },
      {
        name: 'Martial arts',
        id: 'genre-19',
      },
      {
        name: 'Mature',
        id: 'genre-20',
      },
      {
        name: 'Mecha',
        id: 'genre-21',
      },
      {
        name: 'Medical',
        id: 'genre-22',
      },
      {
        name: 'Mystery',
        id: 'genre-24',
      },
      {
        name: 'One shot',
        id: 'genre-25',
      },
      {
        name: 'Pornographic',
        id: 'genre-47',
      },
      {
        name: 'Psychological',
        id: 'genre-26',
      },
      {
        name: 'Romance',
        id: 'genre-27',
      },
      {
        name: 'School life',
        id: 'genre-28',
      },
      {
        name: 'Sci fi',
        id: 'genre-29',
      },
      {
        name: 'Seinen',
        id: 'genre-30',
      },
      {
        name: 'Shoujo',
        id: 'genre-31',
      },
      {
        name: 'Shoujo ai',
        id: 'genre-32',
      },
      {
        name: 'Shounen',
        id: 'genre-33',
      },
      {
        name: 'Shounen ai',
        id: 'genre-34',
      },
      {
        name: 'Slice of life',
        id: 'genre-35',
      },
      {
        name: 'Smut',
        id: 'genre-36',
      },
      {
        name: 'Sports',
        id: 'genre-37',
      },
      {
        name: 'Supernatural',
        id: 'genre-38',
      },
      {
        name: 'Tragedy',
        id: 'genre-39',
      },
      {
        name: 'Webtoons',
        id: 'genre-40',
      },
      {
        name: 'Yaoi',
        id: 'genre-41',
      },
      {
        name: 'Yuri',
        id: 'genre-42',
      },
    ];
  }

  async get_panel(image_url, callback) {
    const options = {
      string: true,
      headers: {
        'User-Agent': USER_AGENT,
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/,/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Windows',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
        Referer: this.base_one_host,
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    };
    const raw_base64 = await encode(image_url, options).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });
    const prefix = 'data:image/jpeg;base64,';
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
        method: 'GET',
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
        const title = $('head > title').text();

        if (title.search('404 ') != -1) {
          const response_data = {
            status_code: NOT_FOUND,
            message: NOT_FOUND_MSG,
          };
          callback(response_data);
          return null;
        }

        const manga_title = $('.panel-breadcrumb>.a-h:nth-child(3)').text();
        const chapter_title = $('.panel-breadcrumb>.a-h:nth-child(5)').text();
        const referer = new URL(read_url);
        const host = referer.hostname;
        let panels = [];

        $('.container-chapter-reader>img').each(async function (i, ele) {
          const this_ele = $(this);
          const title = this_ele.attr('title');
          const src = this_ele.attr('src');
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
      method: 'GET',
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
      const title = $('head > title').text();

      if (title.search('404 ') != -1) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const manga_title = $('span:nth-child(4) span').text();
      const chapter_title = $('span:nth-child(6) span').text();
      const referer = new URL(scrape_url);
      const host = referer.hostname;
      let panels = [];

      $('.img-loading').each(async function (i, ele) {
        const this_ele = $(this);
        const title = this_ele.attr('title').replace(' - Manganato', '');
        const image_url = this_ele.data('src');

        panels.push({
          title,
          image_url,
        });
      });

      const response_data = {
        status_code: status_code,
        message: 'successful',
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
      method: 'GET',
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
      const title = $('head > title').text();

      if (title.search('404 ') != -1) {
        const response_data = {
          status_code: NOT_FOUND,
          message: NOT_FOUND_MSG,
        };

        callback(response_data);
        return null;
      }

      const image_url = $('.info-image>.img-loading').attr('src');
      const manga_title = $('.story-info-right>h1').text();
      const description = $('#panel-story-info-description').text().replace('\nDescription :\n', '');
      const alt_names = $('.variations-tableInfo tr:nth-child(1)>.table-value>h2').text();
      const status = $('.variations-tableInfo tr:nth-child(3)>.table-value').text();
      const updates = $('.story-info-right-extent>p:nth-child(1)>span.stre-value').text();
      // const groups = $('.manga-info-text>li:nth-child(5)').text().replace("TransGroup : ", "")
      const views = $('.story-info-right-extent>p:nth-child(2)>span.stre-value').text();
      const rates = $('#rate_row_cmd>em>em:nth-child(2)>em>em:nth-child(1)').text() + '/5';
      let genres = [];
      $('.variations-tableInfo tr:nth-child(4)>.table-value>.a-h').each(async function (i, ele) {
        const this_ele = $(this);
        const temp = this_ele.attr('href').split('/'); //? https://manganato.com/manga_list?type=newest&category=10&state=all&page=1
        const id = temp[temp.length - 1];
        const name = this_ele.text();

        genres.push({
          name,
          id,
        });
      });
      let authors = [];
      $('.variations-tableInfo tr:nth-child(2)>.table-value>.a-h').each(async function (i, ele) {
        const this_ele = $(this);
        const temp = this_ele.attr('href').split('/'); //? https://manganato.com/author/story/fHlvbW9naW1vY2hp
        const id = temp[temp.length - 1];
        const name = this_ele.text();

        authors.push({
          id,
          name,
        });
      });
      let chapters = [];
      $('.row-content-chapter>li.a-h').each(async function (i, ele) {
        const this_ele = $(this);
        const link_ele = this_ele.children('a');
        const views = this_ele.children('span.chapter-view').text();
        const time = this_ele.children('span.chapter-time').text();
        const temp = link_ele.attr('href').split('/');
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
        message: 'successful',
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

  async get_latest(status, callback) {
    if (!status) status = '';
    const scrape_url = `${mangangato_host}/genre-all?state=${status}`;
    const request_option = {
      method: 'GET',
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
      const total = $('.page-blue').text().split(' : ')[1];
      const page = $('.page-select').text(); // https://manganato.com/genre-all/2
      const pages = $('.page-last')
        .text()
        .replace(/[^0-9]/g, '');
      let manga_list = [];
      $('.content-genres-item').each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children('a');
        const image_ele = link_ele.children('img');
        const source = link_ele.attr('href');
        const title = link_ele.attr('title');
        const image_url = image_ele.attr('src');
        const rates = link_ele.children('.genres-item-rate').text();
        const item_info_wrapper = this_ele.children('.genres-item-info');
        const inner_item_info_wrapper = item_info_wrapper.children('.genres-item-view-time');
        const description = item_info_wrapper.children('.genres-item-description').text().trim();
        const views = inner_item_info_wrapper.children('.genres-item-view').text();
        const update_time = inner_item_info_wrapper.children('.genres-item-time').text();
        const author = inner_item_info_wrapper.children('.genres-item-author').text();
        temp = item_info_wrapper.children('.a-h').attr('href').split('/');
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split('/');
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

  async get_newest(status, callback) {
    if (!status) status = '';
    const scrape_url = `${mangangato_host}/genre-all?type=newest&state=${status}`;
    const request_option = {
      method: 'GET',
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
      const total = $('.page-blue').text().split(' : ')[1];
      const page = $('.page-select').text(); // https://manganato.com/genre-all/2
      const pages = $('.page-last')
        .text()
        .replace(/[^0-9]/g, '');
      let manga_list = [];
      $('.content-genres-item').each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children('a');
        const image_ele = link_ele.children('img');
        const source = link_ele.attr('href');
        const title = link_ele.attr('title');
        const image_url = image_ele.attr('src');
        const rates = link_ele.children('.genres-item-rate').text();
        const item_info_wrapper = this_ele.children('.genres-item-info');
        const inner_item_info_wrapper = item_info_wrapper.children('.genres-item-view-time');
        const description = item_info_wrapper.children('.genres-item-description').text().trim();
        const views = inner_item_info_wrapper.children('.genres-item-view').text();
        const update_time = inner_item_info_wrapper.children('.genres-item-time').text();
        const author = inner_item_info_wrapper.children('.genres-item-author').text();
        temp = item_info_wrapper.children('.a-h').attr('href').split('/');
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split('/');
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

  async get_alltimes(status, callback) {
    if (!status) status = '';
    const scrape_url = `${mangangato_host}/genre-all?type=topview&state=${status}`;
    const request_option = {
      method: 'GET',
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
      const total = $('.page-blue').text().split(' : ')[1];
      const page = $('.page-select').text(); // https://manganato.com/genre-all/2
      const pages = $('.page-last')
        .text()
        .replace(/[^0-9]/g, '');
      let manga_list = [];
      $('.content-genres-item').each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children('a');
        const image_ele = link_ele.children('img');
        const source = link_ele.attr('href');
        const title = link_ele.attr('title');
        const image_url = image_ele.attr('src');
        const rates = link_ele.children('.genres-item-rate').text();
        const item_info_wrapper = this_ele.children('.genres-item-info');
        const inner_item_info_wrapper = item_info_wrapper.children('.genres-item-view-time');
        const description = item_info_wrapper.children('.genres-item-description').text().trim();
        const views = inner_item_info_wrapper.children('.genres-item-view').text();
        const update_time = inner_item_info_wrapper.children('.genres-item-time').text();
        const author = inner_item_info_wrapper.children('.genres-item-author').text();
        temp = item_info_wrapper.children('.a-h').attr('href').split('/');
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split('/');
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

  async filter(genre, status, callback) {
    const scrape_url = `${mangangato_host}/${genre}?state=${status}`;
    const request_option = {
      method: 'GET',
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
      const total = $('.page-blue').text().split(' : ')[1];
      const page = $('.page-select').text(); // https://manganato.com/genre-all/2
      const pages = $('.page-last')
        .text()
        .replace(/[^0-9]/g, '');
      let manga_list = [];
      $('.content-genres-item').each(async function (i, ele) {
        let temp = [];
        const this_ele = $(this);
        const link_ele = this_ele.children('a');
        const image_ele = link_ele.children('img');
        const source = link_ele.attr('href');
        const title = link_ele.attr('title');
        const image_url = image_ele.attr('src');
        const rates = link_ele.children('.genres-item-rate').text();
        const item_info_wrapper = this_ele.children('.genres-item-info');
        const inner_item_info_wrapper = item_info_wrapper.children('.genres-item-view-time');
        const description = item_info_wrapper.children('.genres-item-description').text().trim();
        const views = inner_item_info_wrapper.children('.genres-item-view').text();
        const update_time = inner_item_info_wrapper.children('.genres-item-time').text();
        const author = inner_item_info_wrapper.children('.genres-item-author').text();
        temp = item_info_wrapper.children('.a-h').attr('href').split('/');
        const latest_chapter_id = temp[temp.length - 1];
        temp = source.split('/');
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
    if (!status) status = '';
    const scrape_url = `${mangangato_host}/genre-all?state=${status}`;
    const request_option = {
      method: 'GET',
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
        $('div.panel-genres-list>a.a-h').each(async function (i, ele) {
          const this_ele = $(this);
          const temp = this_ele.attr('href').split('/');
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
      method: 'GET',
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
      $('div.owl-carousel>div.item').each(async function (i, ele) {
        const this_ele = $(this);
        const img_ele = this_ele.children('img');
        const caption_wrapper = this_ele.children('.slide-caption');
        const link_ele = caption_wrapper.children('a');
        const image_url = img_ele.attr('src');
        const title = img_ele.attr('alt');
        const chapter_name = link_ele.text();
        const url = link_ele.attr('href');
        const temp = url.split('/');
        const chapter_id = temp[temp.length - 1];
        const manga_id = temp[temp.length - 2];
        const chapter = chapter_id.replace(/[^0-9]/g, '');

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
        message: 'successful',
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
    this.backup_host_1 = 'https://9anime.gs';
    this.backup_host_2 = 'https://9anime.to';
  }

  //******* Home todo-list *********
  // TODO: schedule animes 9animetv.to
  // TODO: coming animes 9anime.gs
  // TODO: whole home page 9animetv.to

  async get_slider_animes(callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: 'GET',
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
      $('#slider>.swiper-wrapper>.swiper-slide>.deslide-item').each(async function (i, ele) {
        const this_ele = $(this);
        const info_wrapper = this_ele.children('.deslide-item-content');
        const title = info_wrapper.children('.desi-head-title').children('a').text();
        const description = info_wrapper.children('.desi-description').text().trim();
        const anime_id = info_wrapper.children('.desi-buttons').children('a').attr('href').split('/')[2];
        const image_url = this_ele
          .children('.deslide-cover')
          .children('.deslide-cover-img')
          .children('.film-poster-img')
          .attr('src');

        sliders.push({
          anime_id,
          title,
          image_url,
          description,
        });
      });

      const response_data = {
        status_code: status_code,
        message: 'successful',
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
      method: 'GET',
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
      $('.film_list-wrap>.flw-item>.film-poster').each(async function (i, ele) {
        const this_ele = $(this);
        const tick_item_wrapper = this_ele.find('.tick-item');
        const poster_wrapper = this_ele.find('.film-poster-img');
        const anime_id = this_ele.find('.film-poster-ahref').attr("href").split("/")[2]
        const image_url = poster_wrapper.data('src');
        const title = poster_wrapper.attr('alt');
		let ticks = {}
		tick_item_wrapper.each(async function (i, ele) {
			const this_inner_ele = $(this)
			const id = this_inner_ele.attr("class").split(" ")[1].split("-")[1]
			const watch_type = this_inner_ele.text().trim()
			
			ticks[id] = watch_type
		})

        animes.push({
			title,
			image_url,
			ticks,
        });
      });

      const response_data = {
        status_code: status_code,
        message: 'successful',
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

  async get_top_animes(callback) {
    const scrape_url = `${nine_anime_host}/home`;
    const request_option = {
      method: 'GET',
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
      $('.anime-block-ul.anif-block-chart.tab-pane').each(async function (i, ele) {
        const this_ele = $(this);
        const top_id = this_ele.attr('id').split('-')[2];
        const top_wrapper = this_ele.children('ul').children('li');
        let list = [];
        top_wrapper.each(async function (i, ele) {
          const this_inner_ele = $(this);
          const top_number = this_inner_ele.children('.film-number').children('span').text();
          const image_url = this_inner_ele.children('.film-poster').children('img').data('src');
          const title = this_inner_ele.children('.film-poster').children('img').attr('alt');
          const anime_id = this_inner_ele
            .children('.film-detail')
            .children('.film-name')
            .children('a')
            .attr('href')
            .split('/')[2];
          const views = this_inner_ele.children('.film-detail').children('.fd-infor').children('.fdi-item').text();

          list.push({
            top_number,
            title,
            anime_id,
            image_url,
            views,
          });
        });

        top_animes[top_id] = list;
      });

      const response_data = {
        status_code: status_code,
        message: 'successful',
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
}