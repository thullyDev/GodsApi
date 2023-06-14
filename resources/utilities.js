const PORT = 3000;
const SERVER_MSG =
  "Welcome to GodsScraper-v1 Credit to https://github.com/thullyDev for this manga/hentai/anime Api Scraper";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
const SUCESSFUL = 200;
const NOT_FOUND = 404;
const FORBIDEEN = 403;
const CRASH = 503;
const SUCESSFUL_MSG = "sucessful";
const NOT_FOUND_MSG = "not found";
const FORBIDEEN_MSG = "request forbidden";
const CRASH_MSG = "unexpected issue";
const HEADERS = {
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "Windows",
  "sec-fetch-dest": "image",
  "sec-fetch-mode": "no-cors",
  "sec-fetch-site": "cross-site",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};
const mangangato_host = "https://manganato.com";
const mangapill_host = "https://www.mangapill.com";
const mangafoxfull_host = "https://mangafoxfull.com";
const mangafoxfun_host = "https://mangafox.fun";
const nhentai_host = "https://nhentai.net";
const imhentai_host = "https://imhentai.xxx";
const kisscartoon_host = "https://www1.kisscartoon.online";
const nine_anime_host = "https://9animetv.to";
const zoro_host = "https://zoro.to";
const print = (msg) => console.log(msg);
const safify = (val) => {
	if(!val) return ""
	else return val
}

export {
  PORT,
  SERVER_MSG,
  USER_AGENT,
  HEADERS,
  SUCESSFUL,
  NOT_FOUND,
  FORBIDEEN,
  CRASH,
  SUCESSFUL_MSG,
  NOT_FOUND_MSG,
  FORBIDEEN_MSG,
  CRASH_MSG,
  mangangato_host,
  mangapill_host,
  mangafoxfull_host,
  mangafoxfun_host,
  nhentai_host,
  imhentai_host,
  kisscartoon_host,
  nine_anime_host,
  zoro_host,
  print,
  safify,
};
