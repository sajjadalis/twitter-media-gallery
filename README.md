# Twitter Media Gallery

Twitter Media Gallery (based on Vue 3 + Vite + Tailwind CSS) is using Twitter Official API to fetch media (photos and videos) from a Twitter User timeline or Hashtag/Keyword search and then display it in a masonry layout.

**[Demo Preview]: Coming Soon**

![Twitter Media Gallery](https://i.imgur.com/PkuE67c.png)

You will need to create an app in [Twitter Developer Portal](https://developer.twitter.com) and get [Bearer Token](https://i.imgur.com/tGBFcNq.png).

Since the bearer token is stored in .env file, it will be exposed in public build. The solution is to store bearer token in server side in-case it needs to be public. And because it's interacting with TWITTER API directly from browser, there is CORS issue, which solved by CORS-ANYWHERE Proxy.

### Features:
- Search Photos & Videos from User Timeline
- Search Photo & Videos by hashtag(s) & keyword
- Like Photo/Video to keep a like history (in localStorage)
- Preview Large Image or Video in Lightbox
- Open Image in New Tab for Full View, Save Image, Zoom-in, Zoom-out, Rotate

### Requirement
- Developer access to [Twitter API](https://developer.twitter.com)
- [Node.js](https://nodejs.org/en/download/) for development & build

### Project setup
- Create an App in Twitter Developer Portal
- Generate Bearer Token
- Clone the Repository
- Add Bearer Token in `.env` file. e.g. `VITE_TWITTER_TOKEN==YourTokenHere.....`
- Run `npm install` or `yarn add` in Terminal to add all dependencies
- Run `npm run dev` or `yarn dev` for Compiles and hot-reload for development
- Run `npm run build` or `yarn build` for Compiles and minifies for production

### Customize configuration
[Vue.js documentation](https://vuejs.org/guide).

### Recommended IDE Setup for Vue 3 + Vite
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
