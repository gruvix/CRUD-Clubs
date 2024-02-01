# Football teams CRUD proyect

## Expanded Description of Key Features:

### Team Management:<a name="teamManagement"></a>

    Create: Add new teams with customized names, properties, and logos (image upload supported).
    Read: View a list of your user-specific teams with basic information and optional filtering.
    Update: Edit existing team details (name, description, logo) to keep them current.
    Delete: Remove unwanted teams from your list permanently.
    Reset: Set a specific team back to its default state, clearing customised information.
    Reset All: Reset all your teams to their default states, starting fresh.

### Player Management:
    
    Add: Assign players to specific teams, providing their names, positions, and country of origin.
    Edit: Modify player information within a team.
    Remove: Take players out of specific teams.

## Technologies

    Express
    Multer
    jQuery
    Bootstrap
    Cypress
    session-file-store
    body-parser
    
## How to use

-Install dependencies `npm install`

-Run the server `npm run dev:templateNodemon`

The server will run on port 8000.

-Access from a web browser to `localhost:8000`

-Login with any name with only letters

-Do stuff, see [Team Management](#teamManagement)

For test runs see [Tests](#tests)

## Access URLs
Main address: `localhost:8000`

Homepage: `/` (GET)

Login: `/user/login` (POST)

Logout: `/user/logout` (POST)

Teams list: `/user/teams` (GET)

Team details: `/user/team/:teamId` (GET, PATCH, PUT, DELETE)

Add a team: `/user/team/add` (GET, POST)

Reset a team: `/user/reset/:teamId` (PUT) 

Reset all teams: `/user/reset/all` (PUT)

Error page: `/error` (GET)

## Tests <a name="tests"></a>

-Install dependencies `npm install`

-Run the server `npm run dev:templateNodemon`

-Run cypress `npm run dev:cypress`

-Select end to end testing

-Select browser

-Select file `spec.cy.js`

There's a disabled test for removing all players from a team, but it lacks any assertions

## Known Limitations:

### Inefficient Team Updates:

    Currently, updating teams involves multiple filesystem read/write operations, which can
    impact performance, especially for large datasets. Future improvements could explore a
    database-driven approach for more efficient data management.

### Limited Security:

    The app lacks mechanisms to prevent unauthorized access or data manipulation:
        User requests are not validated to ensure they only modify their own data.
        Password protection is not implemented, making accounts vulnerable to unauthorized access.

### Inconsistent Error Handling:

    Lacks a standardized approach for managing errors.
    Relies primarily on try-catch blocks with console logging or throwing errors.
    User-facing errors are communicated via basic alerts, potentially limiting clarity and guidance.
    Future improvements could implement a centralized error handling mechanism for consistent
    logging, user-friendly messages, and potential recovery actions.

## Credits
[Javascript Course Argentina Programa](https://argentinaprograma.com/)

[Course video for this proyect](https://www.youtube.com/watch?v=8LxxQeNCu4U&list=PLs73pLtDNXD893LSF8fP-EfZbGWMECmnc&index=17)
