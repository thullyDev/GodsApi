import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { ManganatoParser } from './resources/parser.js';
import { PORT, USER_AGENT, SUCESSFUL, print } from './resources/utilities.js';

const app = express();
const mnt_parser = new ManganatoParser();

app.use(express.json());

app.listen(PORT, function () {
  print('GodsScraper-v1.0.0 ===> http://localhost:' + PORT);
});

app.get('/', function (req, res) {
  res
    .status(SUCESSFUL)
    .send(
      ' Welcome to GodsScraper-v1\n Credit to https://github.com/thullyDev for this manga/hentai/anime Api Scraper'
    );
});

app.get('/read/:manga_id/:chapter', async function (req, res) {
  const manga_id = req.params.manga_id;
  const chapter = req.params.chapter;
  const site = req.query.s;
  let data = {};
  await mnt_parser.get_panels(manga_id, chapter, site, function (results) {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/panel/:src', async function (req, res) {
  const source = req.params.src;
  let data = {};
  await mnt_parser.get_panel(source, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/manga/:manga_id/', async function (req, res) {
  const manga_id = req.params.manga_id;
  let data = {};
  await mnt_parser.get_manga_info(manga_id, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/latest', async function (req, res) {
  let data = {};
  const status = req.query.status;
  await mnt_parser.get_latest(status, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/newest', async function (req, res) {
  let data = {};
  const status = req.query.status;
  await mnt_parser.get_newest(status, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/alltimes', async function (req, res) {
  let data = {};
  const status = req.query.status;
  await mnt_parser.get_alltimes(status, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/genres', async function (req, res) {
  let data = {};
  const cache = req.query.cache;
  await mnt_parser.get_genres(cache, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/filter/:genre', async function (req, res) {
  let data = {};
  const status = req.query.status;
  const genre = req.params.genre;
  await mnt_parser.filter(genre, status, (results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});

app.get('/top_mangas', async function (req, res) {
  let data = {};
  await mnt_parser.get_top_mangas((results) => {
    data = results;
  });
  res.status(data.status_code).send(data);
});
