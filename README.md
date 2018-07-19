# WoW Addon User-count
Get metrics on your total downloads and active users (based on # of downloads of your latest build)

![Example Output](https://i.imgur.com/om7eVA6.png)

## To Add Your Projects
Modify `projects.json` with your project's information. Provide a friendly name (for your convenience) and the project's ID as specified in the URL, not the numeric ID on the right. For example, if your project is hosted at `https://wow.curseforge.com/projects/recount` then specify the ID with the slash as `/recount`. This would then look like:

```
"projects" : [
    {
        "name" : "Recount",
        "id" : "/recount"
    }
]
```

## To Run
This is a node script, so enter the directory, make sure dependencies are installed with `npm i` or `yarn` and then run the app: `npm start` or `node .`


## Improvements
* Electronize to a very simple app
* Clean up the code
* Bundle it into 1 script so it doesn't need a `node_modules` folder
* Instead of most recent download, specify most recent release (or better yet, make it a flag)
