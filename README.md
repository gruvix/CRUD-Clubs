# Football teams CRUD proyect

## Expanded Description of Key Features: <a name="team-management"></a>

### Team Management:

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

    FrontEnd:
    - React
    - Bootstrap
    - WebPack
    - TypeScript

    BackEnd:
    - Express
    - Multer
    - session-file-store
    - body-parser
    - TypeScript

    Tests:
    - Cypress
    - Jest

    Other:
    - Eslint
    - Prettier
    
## How to use

-Have [Node.js](https://nodejs.org/en) installed

-Install dependencies `npm install`

-Run the server:

If running from Windows: `npm run startWindows`

If running from Linux: `npm run startLinux` (uses gnome, it's currently un-tested, feedback is appreciated)

The server will run on port 8080.

-Access from a web browser to `localhost:8080`

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

## Known Limitations:

### Inefficient Team Updates:

    Currently, updating teams involves multiple filesystem read/write operations, which can
    impact performance, especially for large datasets. Future improvements could explore a
    database-driven approach for more efficient data management.

### Limited Security:

    The app lacks mechanisms to prevent unauthorized access or data manipulation since 
    password protection is not implemented, making accounts vulnerable to unauthorized access.

### Inconsistent Error Handling:

    Lacks a standardized approach for managing errors.
    Relies primarily on try-catch blocks with console logging or throwing errors.
    User-facing errors are communicated via basic alerts, potentially limiting clarity and guidance.
    Future improvements could implement a centralized error handling mechanism for consistent
    logging, user-friendly messages, and potential recovery actions.

### Potential Image Misnaming During Team Creation

    Because how Multer's storage settings generate a provisional team ID when receiving an image
    without team id, if any errors or delays occur between Multer's ID generation and the endpoint's
    team creation, the generated ID might not match the final team ID

### Limited Test Coverage: absence of Unit Tests

    This application lacks unit tests focused on individual functions and logic components

## Credits
[Javascript Course Argentina Programa](https://argentinaprograma.com/)

[Course video for this proyect](https://www.youtube.com/watch?v=8LxxQeNCu4U&list=PLs73pLtDNXD893LSF8fP-EfZbGWMECmnc&index=17)
