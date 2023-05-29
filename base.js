import express  from "express"
import axios from 'axios'
import cheerio from 'cheerio'
import { PORT, USER_AGENT, print } from './resources/utilities.js'
import { ManganatoParser } from './resources/parser.js'

const app = express();
const mnt_parser = new ManganatoParser();

app.use(express.json());

app.listen(PORT, function() {
	print("GodsScraper-v1 ===> http://localhost:"+PORT)
})

app.get("/", function (req, res) {
	res.status(200).send(" Welcome to MangaScraper-v1\n Credit to https://github.com/thullyDev for this Manga Api Scraper")
})

app.get("/read/:manga_id/:chapter", async function(req, res) {
	const manga_id = req.params.manga_id
	const chapter = req.params.chapter
	const site = req.query.s
	
	mnt_parser.get_panels(manga_id, chapter, site,  function(data) {
		res.status(data.status_code).send(data)	  
	})
	
})


app.get("/manga/:manga_id/", async function(req, res) {
	const manga_id = req.params.manga_id
	let response_data = {}
	return await mnt_parser.get_manga_info(manga_id, (data) => {
		response_data = data
	})
	res.status(response_data.status_code).send(response_data)
})
