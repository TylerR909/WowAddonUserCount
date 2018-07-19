// var e=require("./projects.json"),n=require("node-fetch"),t=require("node-html-parser"),o=e.baseUrl,r=e.fileUrl,l=function(e){return Number(e.querySelector(".project-file-list-item").querySelector(".project-file-downloads").text)},a=function(e){var n=0;return e.querySelector(".cf-details").querySelectorAll("li").find(function(e){if("Total Downloads"===e.querySelector(".info-label").text){var t=e.querySelector(".info-data").text;return t=t.replace(",",""),n=Number(t),!0}}),n},c=function(e,o){return n(e).then(function(e){return e.text()}).then(t.parse).then(o)},u=e.projects.map(function(e){var n=""+o+e.id,t={name:e.name,recentDownloads:0,totalDownloads:0},u=c(""+n+r,l).then(function(e){t.recentDownloads=e}),i=c(n,a).then(function(e){t.totalDownloads=e});return Promise.all([u,i]).then(function(){return t})});Promise.all(u).then(function(e){var n=e.reduce(function(e,n){return e+n.totalDownloads},0),t=e.reduce(function(e,n){return e+n.recentDownloads},0);console.log("You have "+n+" total downloads and "+t+" recent downloads"),e.forEach(function(e){console.log(e.name+": "+e.totalDownloads+" total, "+e.recentDownloads+" recent")})});
//# sourceMappingURL=index.js.map

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
