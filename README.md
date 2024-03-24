# Football teams CRUD project

## About the Project

![User teams page overview](user_overview.png)

This project serves as a playground for exploring web development concepts.
It started with basic Express/Handlebars structure, but to practice full-stack skills, i
introduced React and WebPack for the frontend, NestJs for the backend, and Typescript in both ends.
I'm currently enhancing modularity with NestJs and hexagonal architecture on the backend
Future plans include transitioning to NextJs and expanding test coverage with Jest

## Expanded Description of Key Features: <a name="team-management"></a>

### Team Management

    Create: Add new teams with customized names, properties, and logos (image upload supported).
    Read: View a list of your user-specific teams with basic information and optional filtering.
    Update: Edit existing team details (name, description, logo) to keep them current.
    Delete: Remove unwanted teams from your list permanently.
    Reset: Set a specific team back to its default state, clearing customised information.
    Reset All: Reset all your teams to their default states, starting fresh.

### Player Management

    Add: Assign players to specific teams, providing their names, positions, and country of origin.
    Edit: Modify player information within a team.
    Remove: Take players out of specific teams.

![Add team page](add_team.png)
![User specific team page overview](team_overview.png)

## Technologies

    FrontEnd:
    - React
    - Bootstrap
    - WebPack
    - TypeScript

    BackEnd:
    - NestJs (with Express)
    - session-file-store
    - TypeScript

    Tests:
    - Cypress

    Other:
    - Eslint
    - Prettier


## Architecture

This project follows a hexagonal architecture pattern. This promotes a clean separation of concerns,
making the core application logic independent from external systems like the UI and database

See the diagram below for a visual representation of the application's structure:

![Architecture Diagram](app_hex.png)

## How to use

-Have [Node.js](https://nodejs.org/en) installed

-Install dependencies `npm install`

-Run the server:

If running from Windows: `npm run startWindows`

If running from Linux: `npm run startLinux` (uses gnome, it's currently un-tested, feedback is appreciated)

The server will run on port 8080.

2 windows will popup - one for WebPack and the other one for Express

After that a web browser should open with the app, if not, access from a web browser to `localhost:8080`

-Login with any username

-Do stuff, see [Team and Player Management](#team-management)

For test runs see [Tests](#tests)

## Tests <a name="tests"></a>

-Run the servers

-Run cypress `npm run test`

-Select end to end testing

-Select browser

-Select file `spec.cy.js`

There's a disabled test for removing all players from a team, but it lacks any assertions

## Known Limitations

### Inefficient Team Updates

    Currently, updating teams involves multiple filesystem read/write operations, which can
    impact performance, especially for large datasets. Future improvements could explore a
    database-driven approach for more efficient data management.

### Limited Security

    The app lacks mechanisms to prevent unauthorized access or data manipulation since
    password protection is not implemented, making accounts vulnerable to unauthorized access.

### Limited Test Coverage: absence of Unit Tests

    This application lacks unit tests focused on individual functions and logic components

### Simple File Storage Solution

    The application currently uses file-based JSON storage. Future development plans could
    include exploring database integration (e.g., SQLite, MongoDB) to enhance scalability,
    performance, and data management capabilities.

## Credits

[Javascript Course Argentina Programa](https://argentinaprograma.com/)

[Course video for this proyect](https://www.youtube.com/watch?v=8LxxQeNCu4U&list=PLs73pLtDNXD893LSF8fP-EfZbGWMECmnc&index=17)
