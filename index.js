const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')
const colors = require('colors')
const {
    baseUrl,
    fileUrl, 
    projects } = require('./projects.json')

const activeUsersParser = html => Number(
    html
    .querySelector(".project-file-list-item")
    .querySelector(".project-file-downloads")
    .text
)

const totalDownloadsParser = html => {
    let n = 0;
    html
        .querySelector(".cf-details")   // Right panel with addon data
        .querySelectorAll("li")         // Each row on that panel
        .find(e => {                    // Find the "Total Downloads" row and extract the count
            if (e.querySelector(".info-label").text === "Total Downloads") {
                n = Number(e.querySelector(".info-data").text.replace(',',''))
                return true
            }
        })
    return n;
}

const parsePage = (url, parser) => fetch(url)
    .then(res => res.text())
    .then(HTMLParser.parse)
    .then(parser)

const startTime = new Date()

const data = projects.map(project => {
    const projectUrl = "" + baseUrl + project.id
    const projectFilesUrl = projectUrl + fileUrl

    const projectData = { name: project.name }

    return Promise.all([
        // Parsers go here and forward their results to the new projectData object
        parsePage(projectUrl, totalDownloadsParser)
            .then(result => projectData.totalDownloads = result),
        parsePage(projectFilesUrl, activeUsersParser)
            .then(result => projectData.recentDownloads = result)
    ]).then(() => projectData)
});


Promise.all(data).then(results => {
    const totalDownloads = results.reduce((n, p) => n + p.totalDownloads, 0)
    const recentDownloads = results.reduce((n, p) => n + p.recentDownloads, 0)

    console.log(`You have ${String(totalDownloads).green} total downloads and ${String(recentDownloads).green} recent downloads`)
    results.forEach(({name, recentDownloads: r, totalDownloads: t}) => {
        // Output:
        //      Recount: 12345678 total, 10456 recent
        console.log(
            `${String(name).cyan}:`,
            `${t} total, ${r} recent`
        )
    })

    const executionTime = new Date() - startTime
    console.log(`\nRan in ${String(executionTime).red}ms`)
});
