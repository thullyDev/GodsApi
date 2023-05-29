import axios from 'axios'
import cheerio from 'cheerio'
// import fetch from 'fetch'
import { mangangato_host, mangapill_host, print } from '../resources/utilities.js' // TODO: export status codes 

export class ManganatoParser {
    constructor(){
        this.base_one_host = "https://chapmanganato.com"
        this.base_two_host = "https://ww5.mangakakalot.tv"
    }
	
	async get_panels(manga_id, chapter, site) {
		if (site === 1) {
			const read_url = `${this.base_one_host}/${manga_id}/${chapter}`
			const request_option = {
			  method: 'GET',
			  url: read_url,
			}
			
			const manga_response = await axios(request_option).catch(e => print(e))
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
		
		const scrape_url = `${this.base_two_host}/chapter/${manga_id}/${chapter}`
		const request_option = {
		  method: 'GET',
		  url: scrape_url,
		} 
		try {
			const manga_response = await axios(request_option)
		} catch (err) {
			return { error: err };
		}
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
			
			const manga_title = $('span:nth-child(4) span').text()
			const chapter_title = $('span:nth-child(6) span').text()
			const referer =  new URL(scrape_url);
			const host = referer.hostname
			let panels = []
			
			$(".img-loading").each(async function(i, ele) {
				const this_ele = $(this)
				const title = this_ele.attr("title").replace(" - Mangakakalot", "")
				const src = this_ele.data("src")
							
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
					url: scrape_url,
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
	
	async get_manga_info(manga_id, callback) {
		const scrape_url = `${mangangato_host}/${manga_id}`
		const request_option = {
		  method: 'GET',
		  url: scrape_url,
		}
		print(request_option)
		const manga_response = await axios(request_option).catch(error => callback({ error: error, status_code: error.status_code }))
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
			}
			
			const manga_title = $('.manga-info-text>li>h1').text()
			const summary = $('#noidungm').text()
			const alt_names = $('.manga-info-text>li>h2.story-alternative').text()
			const status = $('.manga-info-text>li:nth-child(3)').text().replace("Status : ", "")
			const updates = $('.manga-info-text>li:nth-child(4)').text().replace("Last updated : ", "")
			const groups = $('.manga-info-text>li:nth-child(5)').text().replace("TransGroup : ", "")
			const views = $('.manga-info-text>li:nth-child(6)').text().replace("View : ", "")
			const rates = $('.manga-info-text>li:nth-child(8)>em').text().replace("Mangakakalot.com rate : ", "").split("/")[0]
			let genres = []
			$('.manga-info-text>li:nth-child(7)>a').each(async function(i, ele) {
				const this_ele = $(this)
				const uri = this_ele.attr("href").split("?")[1]  //? https://mangakakalot.com/manga_list?type=newest&category=10&state=all&page=1
				const name = this_ele.text()
							
				genres.push({
					genre_name,
					genre_uri,
				})
			})
			let authors = []
			$('.manga-info-text>li:nth-child(2)>a').each(async function(i, ele) {
				const this_ele = $(this)
				const temp = this_ele.attr("href").split("/")  //? https://mangakakalot.com/search/author/OztyeXVraXNoaTA3
				const author_id = temp[temp.length-1]
				const author_name = this_ele.text()
							
				authors.push({
					author_id,
					author_name,
				})
			})
			let chapters = []
			$('div.chapter-list>div.row').each(async function(i, ele) {
				const this_ele = $(this)
				const link_ele = this_ele.childeren("span>a")
				const views = this_ele.childeren("span:nth-child(2)").text()
				const time = this_ele.childeren("span:nth-child(3)").text()
				const temp = link_ele.attr("href").split("/")  
				const hostname = temp[temp.length-3] 
				const manga_id = temp[temp.length-2]
				const chapter = temp[temp.length-1]
				const name = link_ele.text()
				const fsc = hostname == "mangakakalot.com" ? false : true //*** fsc==="full-scale-capable" that means it be used on base_one_host and base_two_host
							
				chapters.push({
					manga_id,
					chapter,
					name,
					views,
					time,
					fsc,
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
					manga_id: manga_id,
					manga_title: manga_title,
					summary: summary,
					alt_names: alt_names,
					alt_names: alt_names,
					status: status,
					updates: updates,
					groups: groups,
					views: views,
					rates: rates,
					genres: genres,
					authors: authors,
					chapters: chapters,
					chapters_number: chapters.length,
				},
			}
			
			callback(response_data)
		}

		if(status_code === 404) {
			const response_data = {
				status_code: status_code,
				message: "request not found",
			}
			
			callback(response_data)
		}	
		
		const response_data = {
			status_code: status_code,
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