import axios from 'axios'
import cheerio from 'cheerio'
import {encode, decode} from 'node-base64-image';
// import fetch from 'fetch'
import { 
	SUCESSFUL,
	NOT_FOUND,
	FORBIDEEN,
	CRASH,
	USER_AGENT,
	mangangato_host, 
	mangapill_host, 
	print ,
	
} from '../resources/utilities.js' // TODO: export status codes 

export class ManganatoParser {
    constructor(){
        this.base_one_host = "https://chapmanganato.com"
        this.base_two_host = "https://ww5.mangakakalot.tv"
    }
	
	async get_panel(source, callback) {
		const options = {
		  string: true,
		  headers: {
			"User-Agent": USER_AGENT,
			"accept": "image/avif,image/webp,image/apng,image/svg+xml,image/,/*;q=0.8",
			"accept-language": "en-US,en;q=0.9",
			"sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "Windows",
			"sec-fetch-dest": "image",
			"sec-fetch-mode": "no-cors",
			"sec-fetch-site": "cross-site",
			"Referer": this.base_one_host,
			"Referrer-Policy": "strict-origin-when-cross-origin",
		  }
		};
		const raw_base64 = await encode(source, options).catch(error => {
			callback({ error: error, status_code: error.status_code })
			return null
		})
        const prefix = "data:jpeg;base64,";
		const base64 = prefix + raw_base64
		const response_data = {
			data: {
				base64: base64
			},
			status_code: SUCESSFUL,
		}
		
		callback(response_data)
		return null	
	}
	
	async get_panels(manga_id, chapter, site, callback) {
		if (site == 1) {
			const read_url = `${this.base_one_host}/${manga_id}/${chapter}`
			const request_option = {
			  method: 'GET',
			  url: read_url,
			}
			
			const manga_response = await axios(request_option).catch(error => {
				callback({ error: error, status_code: error.status_code })
				return null
			})
			const status_code = manga_response.status 
			
			if(status_code) {
				const html = manga_response.data
				const $ = cheerio.load(html);
				const title = $('head > title').text()
				
				if(title.search("404 ") != -1) {
					const response_data = {
						status_code: 404,
						message: "this manga request is not found",
					}
					callback(response_data)
					return null	
				}
				
				const manga_title = $(".panel-breadcrumb>.a-h:nth-child(3)").text()
				const chapter_title = $(".panel-breadcrumb>.a-h:nth-child(5)").text()
				const referer =  new URL(read_url);
				const host = referer.hostname
				let panels = []
				
				$(".container-chapter-reader>img").each(async function(i, ele) {
					const this_ele = $(this)
					const title = this_ele.attr("title")
					const src = this_ele.attr("src")
					const encoded_url = encodeURIComponent(src)
									
					panels.push({
						title,
						src,
						encoded_url
					})
				})
				
				
				const response_data = {
					status_code: status_code,
					message: "successful",
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
				}
				
				callback(response_data)
				return null	
			}

			if(status_code === 404) {
				const response_data = {
					status_code: status_code,
					message: "request not found",
				}
				
				callback(response_data)
				return null	
			}	
			
			const response_data = {
				status_code: status_code,
				message: "unexecpted issue",
			}
				
			callback(response_data)
			return null	
		}
		
		const scrape_url = `${this.base_two_host}/chapter/${manga_id}/${chapter}`
		const request_option = {
		  method: 'GET',
		  url: scrape_url,
		} 
		const manga_response = await axios(request_option).catch(error => {
			callback({ error: error, status_code: error.status_code })
			return null
		})
		
		const status_code = manga_response.status
		
		if(status_code) {
			const html = manga_response.data
			const $ = cheerio.load(html);
			const title = $('head > title').text()
			
			if(title.search("404 ") != -1) {
				const response_data = {
					status_code: 404,
					message: "this manga request is not found",
				}
				
				callback(response_data)
				return null
			}
			
			const manga_title = $('span:nth-child(4) span').text()
			const chapter_title = $('span:nth-child(6) span').text()
			const referer =  new URL(scrape_url);
			const host = referer.hostname
			let panels = []
			
			$(".img-loading").each(async function(i, ele) {
				const this_ele = $(this)
				const title = this_ele.attr("title").replace(" - Manganato", "")
				const source = this_ele.data("src")
							
				panels.push({
					title,
					source,
				})
			})
			
			
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
			}
			
			callback(response_data)
			return null
		}

		if(status_code === 404) {
			const response_data = {
				status_code: status_code,
				message: "request not found",
			}
			
			callback(response_data)
			return null
		}
		
		const response_data = {
			status_code: status_code,
			message: "unexecpted issue",
		}
		
		callback(response_data)
		return null	
	}
	
	async get_manga_info(manga_id, callback) {
		const scrape_url = `${mangangato_host}/${manga_id}`
		const request_option = {
		  method: 'GET',
		  url: scrape_url,
		}
		const manga_response = await axios(request_option).catch(error => {
			callback({ error: error, status_code: error.status_code })
			return null
		})
		const status_code = manga_response.status
				
		
		if(status_code == 200) {
			const html = manga_response.data
			const $ = cheerio.load(html);
			const title = $('head > title').text()
			
			if(title.search("404 ") != -1) {
				const response_data = {
					status_code: 404,
					message: "this manga request is not found",
				}
				
				callback(response_data)
				return null
			}
			
			const image_url = $('.info-image>.img-loading').attr("src")
			const manga_title = $('.story-info-right>h1').text()
			const description = $('#panel-story-info-description').text().replace("\nDescription :\n", "")
			const alt_names = $('.variations-tableInfo tr:nth-child(1)>.table-value>h2').text()
			const status = $('.variations-tableInfo tr:nth-child(3)>.table-value').text()
			const updates = $('.story-info-right-extent>p:nth-child(1)>span.stre-value').text()
			// const groups = $('.manga-info-text>li:nth-child(5)').text().replace("TransGroup : ", "")
			const views = $('.story-info-right-extent>p:nth-child(2)>span.stre-value').text()
			const rates = $('#rate_row_cmd>em>em:nth-child(2)>em>em:nth-child(1)').text()+"/5"
			let genres = []
			$('.variations-tableInfo tr:nth-child(4)>.table-value>.a-h').each(async function(i, ele) {
				const this_ele = $(this)
				const temp = this_ele.attr("href").split("/") //? https://manganato.com/manga_list?type=newest&category=10&state=all&page=1
				const id = temp[temp.length-1]
				const name = this_ele.text()
							
				genres.push({
					name,
					id,
				})
			})
			let authors = []
			$('.variations-tableInfo tr:nth-child(2)>.table-value>.a-h').each(async function(i, ele) {
				const this_ele = $(this)
				const temp = this_ele.attr("href").split("/")  //? https://manganato.com/author/story/fHlvbW9naW1vY2hp
				const id = temp[temp.length-1]
				const name = this_ele.text()
							
				authors.push({
					id,
					name,
				})
			})
			let chapters = []
			$('.row-content-chapter>li.a-h').each(async function(i, ele) {
				const this_ele = $(this)
				const link_ele = this_ele.children("a")
				const views = this_ele.children("span.chapter-view").text()
				const time = this_ele.children("span.chapter-time").text()
				const temp = link_ele.attr("href").split("/")  
				const hostname = temp[temp.length-3] 
				const manga_id = temp[temp.length-2]
				const chapter = temp[temp.length-1]
				const name = link_ele.text()
							
				chapters.push({
					manga_id,
					chapter,
					name,
					views,
					time,
				})
			})
			const referer =  new URL(scrape_url);
			const host = referer.hostname
			
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
			}
			
			callback(response_data)
			return null
		}

		if(status_code === 404) {
			const response_data = {
				status_code: status_code,
				message: "request not found",
			}
			
			callback(response_data)
			return null
		}	
		
		const response_data = {
			status_code: 503,
			message: "unexecpted issue",
		}
		
		callback(response_data)
	}
}


/*
export default class MangapillParser {
	get_panels = async function(manga_id, chapter) {
		const read_url = `${mangapill_host}/chapters/${manga_id}/${chapter}`

		const request_option = {
		  method: 'get',
		  url: read_url,
		}
		
		const manga_response = await axios(request_option)
		const status_code = manga_response.status 
		
		if(status_code) {
			const html = manga_response.data
			const $ = cheerio.load(html);
			const title = $('head > title').text()
			
			if(title.search("404 ") != -1) {
				const response_data = {
					status_code: 404,
					message: "this manga request is not found",
				}
				
				return response_data
			}
			
			const manga_title = $(".panel-breadcrumb>.a-h:nth-child(3)").text()
			const chapter_title = $(".panel-breadcrumb>.a-h:nth-child(5)").text()
			const referer =  new URL(read_url);
			const host = referer.hostname
			let panels = []
			
			$(".container-chapter-reader>img").each(async function(i, ele) {
				const this_ele = $(this)
				const title = this_ele.attr("title")
				const src = this_ele.attr("src")
								
				panels.push({
					title,
					src,
				})
			})
			
			
			const response_data = {
				status_code: status_code,
				message: "successful",
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
			}
			
			return response_data
		}

		if(status_code === 404) {
			const response_data = {
				status_code: status_code,
				message: "request not found",
			}
			
			return response_data
		}	
		
		const response_data = {
			status_code: status_code,
			message: "unexecpted issue",
		}
		
		return response_data
	}
}
*/