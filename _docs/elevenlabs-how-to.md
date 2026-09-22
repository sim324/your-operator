## Elevenlabs

- https://ui.elevenlabs.io/docs/components
- https://elevenlabs.io/docs/eleven-agents/libraries/react

## Spec

- this agent looks up their company
- this agent is in that first dialog that shows up after people hit "try now" on the home page
- form field for company
- enters their email
- scrapes their logo, stores it in supabase, links it back to the table for them, and then the app shell and other components will use that logo and their primary brand color, generates some information about their company like what type of business (products/services), who they sell to, about them, etc. - maybe we just do that with clay, and then we'll need their company's url so we can iframe that on the prospects page of the demo
- the prospects page is going to have some kind of floating action button for elevenlabs reception or something simulated that's branded in their colors or something so we can simulate what that would look like on their website, we would have one agent where we seed a new session with the company's context
- has a chat about your operator's services while it gets their information
- email collected just goes into a table, maybe we look up their name or something using clay
- server tool firecrawl for the web scrape