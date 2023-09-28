# Geoip microservice (part of massa spider-bot)

**Table of contents**

- [Installation](#installation)
- [Methods](#methods)

## Installation

```
# install deps
npm i

# edit your variables
mv .env.example .env

# start
npm run dev
```

## Methods

Open swagger in your browser http://127.0.0.1:3050/api for playground & docs after `npm run dev`

| Method          | Description       |
| --------------- | ----------------- |
| POST /batch     | resolve ip list   |
| POST /companies | `companies` table |
