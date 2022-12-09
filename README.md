# Twitter Media Gallery

Twitter Media Gallery (based on Vue 3 + Vite + Tailwind CSS + Express backend) is using Twitter Official API to fetch media (photos and videos) from a Twitter User timeline or Hashtag(s)/Keyword search and then display it in a masonry gallery layout.

**[Demo Preview]: Coming Soon**

![Twitter Media Gallery](https://i.imgur.com/PkuE67c.png)

## Features:

- Search Photos & Videos from User Timeline
- Search Photo & Videos by hashtag(s) & keyword
- Like Photo/Video to keep a like history (in localStorage)
- Preview Large Image or Video in Lightbox
- Open Image in New Tab for Full View, Save Image, Zoom-in, Zoom-out, Rotate

## Requirement
- Developer access to [Twitter API](https://developer.twitter.com)
- [Node.js](https://nodejs.org/en/download/) for development & build

You will need to create an app in [Twitter Developer Portal](https://developer.twitter.com) and get [Bearer Token](https://i.imgur.com/tGBFcNq.png).

## Project setup

### Clone to local

If you prefer to do it manually with the cleaner git history

```sh
npx degit sajjadalis/twitter-media-gallery twitter-media-gallery
cd twitter-media-gallery
npm install
```

## Checklist

When you clone this, try follow the checklist to update your info properly

- [ ] Rename `.env.sample` to `.env` in `backend\` folder.
- [ ] Set Twitter Bearer Token in `backend\.env` file. e.g. `TWITTER_TOKEN="YourTokenHere"`

**_Note: Make sure to use `.env.sample` file from `backend\` and NOT the one in the root. That `.env` file is for Vite/Vue front-end only_**.

## Usage

### Development
**Backend Express Server**
```sh
npm start
```

**Vite Server**
```sh
npm run dev
```

### Build

**To build, run**

```sh
npm run build
```

*CORS proxy replaced with Express backend since Heroku is no longer a free service where CORS proxy was hosted.So Express server must be running for it to work. It's better for security and no longer exposes Twitter API token in build.*

### Customize configuration
[Vue.js documentation](https://vuejs.org/guide).

### Recommended IDE Setup for Vue 3 + Vite
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
