
# GodsApi-v1.0.0

GodsApi is an API that serves as an interface to fetch manga and anime content from various sources. It's built using Node.js and Express.js and makes use of various parsers to fetch the content.

## ⚠️ Warning

Please note that this code may be outdated. For the most up-to-date code and updates, please refer to the official GitHub repository: [consumet/consumet.ts](https://github.com/consumet/consumet.ts)


## Installation

To install the necessary dependencies, run:

```bash
npm install
```

## Usage

To start the server, run:

```bash
node index.js
```

By default, the server will be available at `http://localhost:PORT`.

## Endpoints

### Root

- **GET /**: Returns a simple success message.

### Manga Endpoints

- **GET /manga/search/:query/**: Search for mangas by a query.
  - **Params**: `query` - Search term.
  - **Query Params**: `page` - Page number.

- **GET /manga/read/:manga_id/**: Fetch manga information by its ID.
  - **Params**: `manga_id` - ID of the manga.

- **GET /manga/read/:manga_id/:chapter/**: Fetch manga panels of a specific chapter.
  - **Params**: `manga_id` - ID of the manga.
  - **Params**: `chapter` - Chapter number.
  - **Query Params**: `s` - Site identifier.

- **GET /manga/panel/:src/**: Fetch a specific manga panel.
  - **Params**: `src` - Source URL of the panel.

- **GET /manga/latest/**: Fetch the latest mangas.
  - **Query Params**: `status` - Status of the manga.
  - **Query Params**: `page` - Page number.

- **GET /manga/newest/**: Fetch the newest mangas.
  - **Query Params**: `status` - Status of the manga.
  - **Query Params**: `page` - Page number.

- **GET /manga/alltimes/**: Fetch all-time popular mangas.
  - **Query Params**: `status` - Status of the manga.
  - **Query Params**: `page` - Page number.

- **GET /manga/genres/**: Fetch manga genres.
  - **Query Params**: `cache` - Cache identifier.

- **GET /manga/filter/:genre/**: Filter mangas by genre.
  - **Params**: `genre` - Genre to filter by.
  - **Query Params**: `status` - Status of the manga.
  - **Query Params**: `page` - Page number.

- **GET /manga/top_mangas/**: Fetch top mangas.

### Anime Endpoints

- **GET /anime/:site/az-list/:letter/**: Fetch anime list by alphabetical order.
  - **Params**: `site` - Site identifier (1 for 9anime, 2 for Zoro, 3 for Kaido).
  - **Params**: `letter` - Alphabet letter.
  - **Query Params**: `page` - Page number.

- **GET /anime/:site/filter/**: Filter animes by various criteria.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `keyword`, `type`, `status`, `language`, `sort`, `year`, `season`, `genre`, `page`.

- **GET /anime/:site/results/**: Fetch anime search results.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `keyword`.

- **GET /anime/:site/sliders/**: Fetch anime sliders.
  - **Params**: `site` - Site identifier.

- **GET /anime/:site/top_animes/**: Fetch top animes.
  - **Params**: `site` - Site identifier.

- **GET /anime/:site/recent/**: Fetch recent animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/sub/**: Fetch subbed animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/dub/**: Fetch dubbed animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/popular/**: Fetch popular animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/top_airing/**: Fetch top airing animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/new/**: Fetch new animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/upcoming/**: Fetch upcoming animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/complete/**: Fetch completed animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/movies/**: Fetch anime movies.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/tv/**: Fetch TV animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/ova/**: Fetch OVA animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/ona/**: Fetch ONA animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/special/**: Fetch special animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `page`.

- **GET /anime/:site/genre/:genre**: Fetch animes by genre.
  - **Params**: `site` - Site identifier.
  - **Params**: `genre` - Genre.
  - **Query Params**: `page`.

- **GET /anime/:site/watch_types/**: Fetch anime watch types.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `cache`.

- **GET /anime/:site/schedule/days/**: Fetch anime schedule by days.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `tz_offset`.

- **GET /anime/:site/schedule/animes/**: Fetch anime schedule by animes.
  - **Params**: `site` - Site identifier.
  - **Query Params**: `date`, `tz_offset`.

- **GET /anime/:site/details/:slug/**: Fetch anime details by slug.
  - **Params**: `site` - Site identifier.
  - **Params**: `slug` - Anime slug.

- **GET /anime/:site/next_episode/:slug/**: Fetch next episode release date by slug.
  - **Params**: `site` - Site identifier.
  - **Params**: `slug` - Anime slug.

## Utilities

This API makes use of a utility module that contains constants and helper functions used throughout the API.

## Parsers

The parsers are responsible for fetching data from various manga and anime websites. They provide the core functionality of the API.

## License

This project is licensed under the MIT License.
