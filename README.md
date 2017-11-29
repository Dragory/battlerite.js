# Battlerite.js <a href="https://www.npmjs.com/package/battlerite.js"><img src="https://img.shields.io/npm/v/battlerite.js.svg" alt="Battlerite.js on NPM"></a>

A library for using the official [Battlerite API](http://battlerite-docs.readthedocs.io/en/master/introduction.html) from NodeJS

```
npm install --save battlerite.js
```

## Basic usage

```js
const bjs = require('battlerite.js');
const client = new bjs.Client('your-token-here');

// Get the last 5 matches by the player 'Foo'
client.searchMatches({playerNames: 'Foo'}, 5).then(matches => {
  console.log('Got matches:', matches);
  
  // Get telemetry data for the first match
  client.getMatchTelemetry(matches[0]).then(telemetry => {
    console.log('Got telemetry:', telemetry);
  });
});
```

## Methods

### `client.getPlayer(id: string) => Promise<Player>`

Get the player specified by `id`

### `client.getPlayersById(ids: string[]) => Promise<Player[]>`

Get the players specified by `ids` (array of player IDs)

### `client.getPlayersByName(names: string[]) => Promise<Player[]>`

Get the players specified by `names` (array of player names)

### `client.searchMatches(filters: object, amount = 5, sort = 'createdAt') => Promise<Match[]>`

Search matches using the specified filters. Available filters:

* **playerIds**  
  Player id or array of player Ids
* **playerNames**  
  Player name or array of player names
* **teamNames**  
  Team name or array of team names
* **gamemode**  
  Game mode or array of game modes. Available modes: `casual`, `ranked`, `battlegrounds`
* **fromDate**  
  JS Date object or ISO-8601 string. Date to start searching from (defaults to 4 weeks ago).
* **toDate**
  JS Date object or ISO-8701 string. Date to end searching at (defaults to current date).

`amount` specifies the amount of matches to return. Every 5 matches results in a new API request that counts against your rate limit.

Note that bulk scraping matches is prohibited by the Battlerite API terms of use.

### `client.getMatchTelemetry(match: Match) => Promise<object>`

Loads telemetry data for the given Match.

## Types

A list of types/entities can be found in [the documentation](https://dragory.github.io/battlerite.js/classes/_entities_entity_.entity.html)
