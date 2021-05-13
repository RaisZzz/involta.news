const allNews = [];
const newsPerPage = 4;
function loadNews(websiteUrl) {
	fetch(websiteUrl).then((res) => {
		res.text().then((htmlTxt) => {
			const domParser = new DOMParser();
			const doc = domParser.parseFromString(htmlTxt, "text/html");
			const items = doc.querySelectorAll("item");

			foreach();
			async function foreach() {
				let promise = new Promise((resolve) => {items.forEach(item => {
						// Create news object
						const news = new Object();
						// Get info
						const timestamp = new Date(item.querySelector("pubdate").innerHTML).getTime();
						// Get title
						news.title = item.querySelector("title").innerHTML;
						// Get date
						const date = new Date();
						date.setTime(timestamp);
						let day = date.getDay();
						if (day < 10) {
							day = "0" + day;
						}
						let month = date.getMonth()+1;
						if (month < 10) {
							month = "0" + month;
						}
						const year = date.getFullYear();
						news.pubdate = day + "." + month + "." + year;
						// Get description
						news.description = item.querySelector("description").innerHTML;
						// Get link
						news.link = item.querySelector("link");
						// Get image url
						news.imgUrl = item.querySelectorAll("enclosure")[0].getAttribute("url")
						news.websiteUrl = websiteUrl;

						allNews.push(news);
					});
					resolve(allNews.length);
				});
				let length = await promise;
				const pagesCount = Math.ceil(length/newsPerPage);
				let currPage = window.location.hash.slice(1);
				if (currPage == '' || currPage == NaN || currPage == null || currPage > pagesCount) {
					currPage = 1;
				} else {
					currPage = parseInt(currPage)
				}

				const newsCont = document.getElementById("news-container");
				for (let i = (currPage - 1) * newsPerPage; i < newsPerPage*currPage; i++) {
					if(newsCont.querySelectorAll("h2").length < newsPerPage) {
						const newsItem = document.createElement("div");
						newsItem.className = "news-item";
						const title = document.createElement("h2");
						title.classList = "news-title";
						const description = document.createElement("description");
						description.classList = "news-description";
						const link = document.createElement("a");
						link.classList = "news-link";
						const row = document.createElement("div");
						row.classList = "news-row";
						const href = document.createElement("a");
						href.classList = "news-site";
						const date = document.createElement("p");
						date.classList = "news-date";

						title.innerHTML = allNews[i].title;
						description.innerHTML = allNews[i].description;
						link.innerHTML = "Подробнее";
						link.setAttribute("href", allNews[i].link)
						href.innerHTML = allNews[i].websiteUrl;
						href.setAttribute("href", allNews[i].websiteUrl);
						date.innerHTML = allNews[i].pubdate;

						row.append(href);
						row.append(date);
						newsItem.append(title);
						newsItem.append(description);
						newsItem.append(link);
						newsItem.append(row);
						newsCont.append(newsItem);
					}
				}
			};
		});
	}).catch(() => console.error ("Error."));
};
document.addEventListener("DOMContentLoaded", function() {
	loadNews("https://www.mos.ru/rss");
	loadNews("https://lenta.ru/rss/news");
	
	const page = window.location.hash;
});