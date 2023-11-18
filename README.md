# StartBoiling
[Notes](notes.md)

## Elevator Pitch
Have you ever wondered how much time you've spent boiling water?

What about how often your friend boils water?

What about a total strangers water boiling habits?

Well, wonder no more with this new website: [**startup.startboiling.click**](http://startup.startboiling.click)

This website allows you to track your boiling and see who else is boiling water at the same time. You can also rack up boiling time to become one of the **Top Water Boilers**, or just look at the list and be in awe of them.

## Design
![Sketch of the website startboiling.click](assets/images/startboilingsketch.png)
### Key Features
- Ability to track your water boiling time
- Users currently boiling water displayed
- Top water boilers displayed
- Time spent boiling displayed for you and other users
- Charts showing when water was boiled
- Ability to record a previous instance of boiling water

## Technologies
**Authentication** - Users can create an account or login, once logged in their username will be displayed at the top of the page  
**Database Data** - Rendering the time spent boiling water for all users, which will be stored in the database.  
**WebSocket data** - Rendering the users currently boiling water in realtime.

## HTML
- **HTML pages** - Three HTML Pages that represent the ablilty to login, view data, and record previous boiling sessions.
- **Links** - The log in page links to the main data page, which then has a log out button to link back to the log in page.  There is also a "Record Previous Data" button that links to the page to record prevous boiling sessions.
- **Text** - There are text headers as well as data represented by text.
- **Images** - There is an image of boiling water in the footer.
- **Login** - Input box and submit button for username login.
- **Database** - The Top Boilers stats represents data pulled from the database.
- **WebSocket** - People currently boiling water stats represents data pulled from websocket data.

## CSS
- **Header, footer, and main content body** - flex display to structure header, footer, and main with a grid in main for track.html.
- **Navigation elements** - buttons to take you between pages are formateed with css to have borders and orunded corners and change color when hovered over.
- **Responsive to window resizing** - flex and grid displays allow the website content to repond to screen size and organize itself appropriately.
- **Application elements** - track buttons as well as placeholder graphs properly formatted look nicer and be better positioned.
- **Application images** - profile picture icon added next to username.

## JavaScript
- **JavaScript support for future login** - stores the username in local storage and displays it at the top of each page.
- **JavaScript support for future database data** - Personal and Website Boiling times stored in local storage.
- **JavaScript support for future WebSocket** - Stores boiling sessions as objects in local storage. This will eventally by modified to reference WebSocket as well. Adds user to "People Currently Boiling Water", which will be further populated with websocket data.
- **JavaScript support for your application's interaction logic** - Added JavaScript to record previous boil input to accept only durations.  Used JavaScript to switch the Start Boiling button to "Stop Boiling" when clicked, and generate a session object in local storage.


## Service
- **Create an HTTP service using Node.js and Express** - Done!
- **Frontend served up using express static middleware** - Done!
- **Your frontend calls third party service endpoints** - Random quote displays on the record page.
- **Your backend provides service endpoints** - Implemented service endpoints to get and update boiling sessions.
- **Your frontend calls your service endpoints** - Frontend calls service endponts to get updated boiling sessions and times.

## Database
- **MongoDB Atlas database created** - Done!
- **Provides backend endpoints for manipulating application data** - Done! Updates database when you start or stop boiling
- **Stores application data in MongoDB** - Done!