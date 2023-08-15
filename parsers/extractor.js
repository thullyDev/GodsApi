import axios from "axios";
import cheerio from "cheerio";
import CryptoJS from "crypto-js";
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
  kaido_host,
  zoro_host,
  print,
} from "../resources/utilities.js";

export async function get_anime_episodes(site, anime_id) {
  let scrape_url = `${nine_anime_host}/ajax/episode/list/${anime_id}`;
  if (site == 2) scrape_url = `${zoro_host}/ajax/v2/episode/list/${anime_id}`;
  if (site == 3) scrape_url = `${kaido_host}/ajax/episode/list/${anime_id}`;

  const request_option = {
    method: "GET",
    url: scrape_url,
  };
  const response = await axios(request_option).catch((error) => {
    return [];
  });
  const status_code = response.status;

  if (status_code == SUCESSFUL) {
    const html = response.data.html;
    const $ = cheerio.load(response.data.html);

    let episodes = [];
    $(".ep-item").each(async function (i, ele) {
      const this_ele = $(this);
      const is_filler = JSON.stringify(this_ele.hasClass("ssl-item-filler"));
      const episode_id = JSON.stringify(this_ele.data("id"));
      const episode_slug = this_ele.attr("href");
      const episode_title = this_ele.attr("title").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
      const episode_number = JSON.stringify(this_ele.data("number"));

      episodes.push({
        is_filler,
        episode_id,
        episode_slug,
        episode_title,
        episode_number,
      });
    });

    return episodes;
  }

  return [];
}

export async function get_anime_episode_servers(site, episode_id, callback) {
  let scrape_url = `${nine_anime_host}/ajax/episode/servers?episodeId=${episode_id}`;

  if (site == 2) scrape_url = `${zoro_host}/ajax/v2/episode/servers?episodeId=${episode_id}`;
  if (site == 3) scrape_url = `${kaido_host}/ajax/episode/servers?episodeId=${episode_id}`;

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

export async function get_episode_sources(proxy, site, server_id, callback) {
  let url = `${nine_anime_host}/ajax/episode/sources?id=${server_id}`;
  if (site == "2") url = `${zoro_host}/ajax/v2/episode/sources?id=${server_id}`;
  if (site == "3") url = `${kaido_host}/ajax/episode/sources?id=${server_id}`;
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
    const link = response.data.link;
    const temp = link.split("?")[0].split("/");
    const source_host = temp[2];
    const link_id = temp[temp.length - 1];
    let sources_link = "";

    if (source_host == "rapid-cloud.co")
      sources_link = "https://rapid-cloud.co/ajax/embed-6-v2/getSources?id=" + link_id;
    if (source_host == "megacloud.tv") sources_link = "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=" + link_id;

    const source_request_option = {
      method: "GET",
      url: sources_link,
    };
    const source_response = await axios(source_request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });

    print(source_response);

    if (source_response.data.encrypted == false) {
      const source_data = source_response.data;
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

    let decrypt_key_link = "";

    if (site == "3" || site == "1") decrypt_key_link = "https://raw.githubusercontent.com/enimax-anime/key/e0/key.txt";
    if (site == "2") decrypt_key_link = "https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt";

    const decrypt_request_option = {
      method: "GET",
      url: decrypt_key_link,
    };
    const decrypt_response = await axios(decrypt_request_option).catch((error) => {
      callback({ error: error, status_code: error.status_code });
      return null;
    });

    const raw_encrypted_source = source_response.data.sources;
    const temp_encrypted_source = raw_encrypted_source.split("");
    const indexes_decrypt_key = decrypt_response.data;
    let raw_sources = {};
    let sources = "";

    let decrypt_key = "";
    let encrypted_source = "";

    if (typeof indexes_decrypt_key != "string") {
      for (const index of indexes_decrypt_key) {
        for (let i = index[0]; i < index[1]; i++) {
          decrypt_key += temp_encrypted_source[i];
          temp_encrypted_source[i] = null;
        }
      }
      encrypted_source = temp_encrypted_source.filter((x) => x !== null).join("");
    } else {
      decrypt_key = indexes_decrypt_key;
      encrypted_source = raw_encrypted_source;
    }

    print({ decrypt_key, encrypted_source });

    try {
      raw_sources = CryptoJS.AES.decrypt(encrypted_source, decrypt_key);
      sources = JSON.parse(raw_sources.toString(CryptoJS.enc.Utf8));
    } catch {
      callback({ error: "couldn't get source", status_code: CRASH });
      return null;
    }

    const source_data = source_response.data;

    if (proxy == "true") {
      let temp_source = [];
      for (let i = 0; i < sources.length; i++) {
        const item = sources[i];

        temp_source.push({
          file: "https://cors-thullydev.onrender.com/" + item.file,
          type: item.type,
        });
      }

      source_data.sources = temp_source;

      temp_source = [];
      for (let i = 0; i < bk_sources.length; i++) {
        const item = bk_sources[i];

        temp_source.push({
          file: "https://cors-thullydev.onrender.com/" + item.file,
          type: item.type,
        });
      }

      source_data.sourcesBackup = temp_source;
    } else {
      source_data.sources = sources;
      // source_data.sourcesBackup = bk_sources;
    }

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
