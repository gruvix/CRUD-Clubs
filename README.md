# Football teams CRUD proyect
## Description

This proyects implements a CRUD (create, read update delete) of football teams with their data and players

## Technologies

    Express
    Express-Handlebars
    Express-Session
    Multer
    jQuery
    Bootstrap

## Instructions to run the server

`npm install`

`npm run dev:templateNodemon`

The server will run on port 8000.

## Access URLs
main adress: `localhost:8000`

Homepage: `/` (GET)

Login: `/user/login` (POST)

Logout: `/user/logout` (POST)

Teams list: `/user/teams` (GET)

Team details: `/user/team/:teamId` (GET, PATCH, PUT, DELETE)

Add a team: `/user/team/add` (GET, POST)

Reset a team: `/user/reset/:teamId` (PUT) 

Reset all teams: `/user/reset/all` (PUT)

Error page: `/error` (GET)

## Credits
[Javascript Course Argentina Programa](https://argentinaprograma.com/)

[Course video for this proyect](https://www.youtube.com/watch?v=8LxxQeNCu4U&list=PLs73pLtDNXD893LSF8fP-EfZbGWMECmnc&index=17)
