const https = require("https");
const { JSDOM } = require("jsdom");
const http = require("http");

const url = "https://time.com";
const port = 3000;

const arr = [];

const server = http.createServer((req, response) => {
    if (req.url === "/getTimeStories" && req.method === "GET") {
        https.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    const { window } = new JSDOM(body);
                    const document = window.document;

                    const storyTitle = document.querySelectorAll(".latest-stories__item-headline");
                    const storyLink = document.querySelectorAll(".latest-stories__item a");
                    
                    // console.log(body)
                    storyTitle.forEach((headline, index) => {
                        const title = headline.textContent.trim();
                        const link = storyLink[index].getAttribute("href");
                        arr.push({ title, link: `https://time.com${link}` });
                    });
                    response.end(JSON.stringify(arr));
                } catch (error) {
                    console.error(error.message);
                }
            });
        }).on("error", (error) => {
            console.error(error.message);
        });
    }
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
