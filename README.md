#  How-To Run

Download and install [Node.js](https://nodejs.org/).

Install Node modules
```
npm install
```

Change `site_url` in  `index.js` to website you want to scan
```
var siteUrl = "[Example URL]";
```

Run the program
```
npm start
```

When the scan is done the program will output the broken links into `broken.txt`

# TODO

Ask for command line argument for website to start scanning