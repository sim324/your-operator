# Your Operator: brainstorm broken into features, flows and stories

## Context

`_docs/brainstorm.md` is a spoken walkthrough. It mixes three things in one stream: the demo script, the production product, and later add-ons. It also switches persona mid-sentence. This document separates them so each feature has one owner persona, one flow and a few buildable stories.

Product in one line: your Operator trains sales teams, warms up leads and does the follow-up, on the belief that better-prepared reps sell more.

## Does it make sense as flows or stories? Both, in layers

**Flows are the spine.** Almost all the value here is in the handoffs between people: prospect to rep, rep to manager, prospect to client. A flat story list hides that. Your demo is also literally a sequence, so the flow is the demo script.

**Stories are the build units inside each flow.** Each feature below has a flow (the journey) and a short set of stories (what you would ticket and accept).

Suggested hierarchy: Feature > Flow > Stories. Nine features cover the whole transcript.

## Personas

| Persona | Who they are | Current demo role |
|---|---|---|
| Prospect | Lead on the customer's website, gets qualified by an AI agent | Prospect |
| Sales rep | The salesperson. Transcript: "the user is the salesperson" | Sales rep |
| Manager / director / owner | Sees the whole team, funnel and reviews. Reps do not | Manager |
| Client | A prospect who bought. Gets a portal with action items | **None yet** (see open question 1) |

## Features, flows and stories

### F1. Prospect intake and qualification
- **Flow:** prospect lands on the site, fills an intake form, chats with an AI bot that warms and qualifies them, then is offered a next step. That step is either price cards to book and pay, a 15-minute intro session, or a move down the pipeline.
- Stories:
  - As a prospect, I want to answer intake questions in a form and a chat so the company understands my needs.
  - As the business, I want the bot to qualify and triage leads so reps only spend time on good ones.
  - As a prospect, I want to see offers with prices and book or pay without leaving the chat.
  - As a rep or admin, I want to review exactly what happened in intake before I meet the prospect.

### F2. Live sales call with AI copilot
- **Flow:** rep and prospect meet on a custom video platform. The rep sees the prospect's info and an AI panel. The AI prompts what to say next, following the company's sales process or script. The rep can ask it questions. **The AI never speaks to the prospect.**
- Stories:
  - As a rep, I want prospect details beside the video so I do not re-ask things they already told the bot.
  - As a rep, I want next-step prompts that follow my company's script so I stay on process.
  - As a rep, I want to ask the AI questions mid-call.

### F3. In-call booking and payments
- **Flow:** the rep has two buttons, Book and Pay. Pressing one sends an overlay to the prospect's screen. The prospect completes it, and the rep sees the state change live.
- Stories:
  - As a rep, I want to trigger a booking or payment without leaving the call.
  - As a prospect, I want to complete it in an overlay on the same call.
  - As a rep, I want to see it succeed in real time.
- Note: no AI involved. This is a synced UI channel.

### F4. Post-call processing and session review
- **Flow:** the call ends. The rep lands on "meeting completed, processing" and gets a toast when the review is ready. The review has a transcript, possibly a recording, and coaching on what went well and what to improve. The prospect sees a success page (destination undecided).
- Stories:
  - As a rep, I want to see that my call is being processed so I know it was not lost.
  - As a rep, I want a notification when the review is done.
  - As a rep, I want a transcript and coaching notes so I can improve.
  - As a prospect, I want a clear "you're done" screen after the call.

### F5. Rep home and performance dashboard
- **Flow:** the rep opens their home. They see the full chat and intake context, a to-do list, weekly bingo cards, improvement metrics and a list of prospects and clients with trends. They can open a meeting detail page.
- Stories:
  - As a rep, I want a to-do list so I know what to do next.
  - As a rep, I want weekly bingo cards so progress feels tangible.
  - As a rep, I want improvement metrics so I see if I am getting better.
  - As a rep, I want a prospects and clients list with a per-meeting detail page.

### F6. Gamified training
- **Flow:** the session review shows the rep's errors. The system suggests a game pack. The rep plays, sees results, and results feed the manager view (F7).
- Stories:
  - As a rep, I want game recommendations based on my actual mistakes.
  - As a rep, I want to play and see my results.
  - As a company, I want to create my own games (**later**).

### F7. Manager hub
- **Flow:** the manager sees every team member, their game results and trends, and who they are emailing. Reps do not see this page, so role-based access is required.
- Stories:
  - As a manager, I want a team roster with game results and trends.
  - As a manager, I want to see rep email and CRM activity, via a Gmail or CRM integration.
  - As a rep, I must not be able to open manager pages.
- **F7a. Intake funnel:** start intake, finish intake, had a meeting, paid (payments later). Alert on drop-off ("everyone falls off here").
  - As a manager, I want funnel stages and an alert when many people drop at one step.
- **F7b. Reviews and reputation:** how reviews are doing across the internet. Recommend to a rep that they request a review from a specific client, with an email template.
  - As a manager, I want review performance in one place.
  - As a rep, I want to be told who to ask for a review, with a template ready to send.

### F8. Client portal
- **Flow:** the client sees videos, a to-do list of action items (with a bingo card), payment reminders and meeting notes. They can add their own notes, and leave a review as text or a recorded video that is stored and triggers a notification.
- Stories:
  - As a client, I want my action items and reminders in one place.
  - As a client, I want to see and add meeting notes.
  - As a client, I want to leave a review by writing or recording.
  - As the business, I want reviews stored and to be notified when one arrives.

### F9. Platform foundations (cross-cutting)
- Role-based access control across all four personas.
- Per-company customization: sales script, offers and prices, branding, games ("this will be according to your company").
- Integrations: Gmail or CRM, payments, booking (Cal.com is already in the repo), video.
- AI agents, seven distinct jobs: intake bot, call copilot, session-review generator, game recommender, review-request recommender, funnel drop-off alerting, and (later) game authoring.

### Later or add-on (explicitly separate in the transcript)
- AI-ready website and auto-publishing reviews to the customer's site. Sites are hosted elsewhere and bespoke, so this is a separate service. In-app you only collect and store reviews and notify someone.
- White-label client portal for the customer's own business.
- LMS, group coaching, journaling and gamified training for the customer's customers (Wave 9 style), with feature flags.
- Game authoring tools.

## The demo script (the flow of flows)

Order Charlie narrated:

1. Prospect intake with the bot (F1).
2. Rep reviews the intake (F1, rep side).
3. About one minute live call, Paige plays the client (F2, F3).
4. Call ends, review processing (F4).
5. Rep dashboard tour while it processes, with Paige explaining (F5).
6. Session review pops in and changes the page (F4).
7. Game pack, play, results (F6).
8. Manager hub tour, funnel and reviews (F7, F7a, F7b).
9. Client portal, which closes the circle (F8).

The one-minute call length exists so processing finishes while the dashboard tour plays. `driver.js` is already a dependency and fits the guided tour steps.

## How this maps to what exists

- The three-role switcher, sidebar and stub pages cover F5, F7 and F1's shell. The sidebar items I stubbed (Meetings, Prospects, Coaching and games, Game results, Intake funnel, Reviews, Booking, Client portal) already line up with these features and can become routes as each is built.
- Nothing exists yet for F2, F3, F4, F6 or F8.

## Gaps and open questions

1. **Fourth persona.** The transcript ends on the client portal, but the switcher has three roles. Is Client a fourth role, or is it the Prospect role after the sale?
2. **Where the demo starts.** The narrative starts as the prospect, but the default role is Rep. Should the guided tour begin on Prospect?
3. **Live call realism.** The largest scope item. Is the call a real video session with Paige live, or a scripted or pre-recorded simulation? This decides F2 and F3.
4. **Real AI or pre-baked.** Is the intake bot, copilot and session review actual model output, or scripted content for the demo?
5. **Prospect after the call.** The transcript says "we don't know where they're routed."
6. **Payments.** Two buttons in the call. Real payment processor or a mock?
7. **Mock data source.** Is the manager and rep data hardcoded fixtures for now?
8. **Demo vs production boundary.** Which of F1 to F8 must be real for the first customer demo?

## Next steps, if you agree with this structure

- Resolve open questions 1 to 4, since they change scope the most.
- Then turn each feature into a route plus mock-data stub, starting with the pages that need no live infrastructure (F5, F7, F6, F8).
- Leave F2, F3, F4 for last or simulate them first, because they carry the real-time and AI risk.

## Verification

This is a planning document, so there is no code to test. Check it by reading the nine features against the transcript and confirming nothing you said is missing or misplaced.

---

# Update: confirmed demo flow (Sep 19, Charlie's follow-up)

This section supersedes the earlier "demo script" and answers most of the open questions above. The earlier sections are left as they were, for reference.

## The flow, stage by stage

| # | Seat | What happens | Feature |
|---|---|---|---|
| 0 | Visitor | Home page, click Try now, land on `/demo`, email gate dialog with video (already built) | Entry |
| 1 | Prospect | An AI **voice agent** does intake, qualifies them, and/or recommends something. It has web search and per-business context loaded into its prompt | D1 |
| 2 | Rep | Reviews an earlier intake with **AI analysis** and **AI call prep** | D2 |
| 3 | Rep | Video meeting with "Tavis" (assumed to be Tavus, an AI video avatar). **Real-time coaching**: the AI tells the rep what to say and what to do next, for example "your prospect sounds really interested, try to close" | D3 |
| 4 | Rep | Call ends, "processing the call" screen | D4 |
| 5 | Rep | Call details screen with feedback on their performance | D4 |
| 6 | Manager | Reviews the same feedback. The UI recommends actions, for example "assign this rep a gamified training exercise, they struggled with this in their last 5 calls". Reviews aggregate data | D5 |

The order is fixed: prospect, then rep, then manager. Each handoff is a narrative step, not a free choice.

## What changes from the earlier plan

- **Intake is a voice conversation.** F1 was a form plus text chat. The form, price cards and 15-minute intro booking are not mentioned in this flow.
- **The other side of the call is an AI avatar, not Paige live.** No human is needed on the prospect end.
- **Call prep is new.** The rep gets AI analysis of the intake and a prep plan before the call.
- **The manager step is now a recommendation.** The UI spots a pattern across recent calls and suggests assigning training. Aggregate data sits alongside it.
- **Not in this flow as you described it:** in-call booking and payments (F3), the rep home dashboard with bingo cards (F5), the rep playing a game (F6, rep side), funnel and reviews (F7a and F7b), and the client portal (F8). I have not deleted them. Treat them as deferred until you say otherwise.

## Demo-path features and stories

**D1. Voice intake agent (prospect)**
- As a prospect, I want to talk to an agent that asks about my business and needs, so intake feels like a conversation.
- As the agent, I need business context and web search, so my questions and recommendations are specific.
- As a prospect, I want the conversation to end with a recommendation or next step.

**D2. Intake review and call prep (rep)**
- As a rep, I want an AI analysis of an earlier intake, so I understand the prospect quickly.
- As a rep, I want AI call prep before I join, so I know my goals, questions to ask and likely objections.

**D3. Live coaching call (rep)**
- As a rep, I want a video meeting with an AI prospect, so the call feels real.
- As a rep, I want real-time prompts on what to say, next steps and closing cues.
- The coach must hear both sides of the call. Only the rep sees the prompts.

**D4. Call processing and feedback (rep)**
- As a rep, I want a processing screen when the call ends, so I know it was captured.
- As a rep, I want a details screen with feedback on my performance, so I know what to improve.

**D5. Manager review and training assignment (manager)**
- As a manager, I want to see the same feedback the rep saw.
- As a manager, I want the UI to notice patterns across recent calls and recommend a gamified exercise, which I can assign.
- As a manager, I want aggregate data across reps and calls.

## Earlier open questions, now answered

1. **Fourth persona:** not needed for this flow. Three seats are enough. The client portal is deferred.
2. **Where the demo starts:** on the prospect seat. The code still defaults to Rep, so the default role and the `/demo` redirect need to change (not done yet).
3. **Live call realism:** an AI video avatar, not a live human.
4. **Real AI or pre-baked:** the voice agent with web search and the live coaching read as real AI. The post-call feedback is still undecided.
5. **Prospect after the call:** no longer applies, since the prospect is the avatar.
6. **Payments:** not in this flow.

## New open questions

1. **"Tavis":** is this Tavus, or another product? It decides the call tech.
2. **Voice agent:** which provider, and is it embedded in the browser page?
3. **Whose intake does the rep review?** "Happened before" reads like a canned intake, separate from the one the visitor just did. Using the visitor's own would land harder but adds a dependency and a failure point. Please confirm.
4. **Whose business is the agent told about?** "Some context on their business" suggests the visitor's. The email gate could also ask for a company name or website, or we could infer it from the email domain. Or we could use one fixed sample company.
5. **Coaching source:** the prompts need a company script or playbook to be grounded in. Who provides it for the demo?
6. **Coaching mechanics:** live transcript of both sides, plus a latency target for the prompts.
7. **Feedback screen:** what does it contain, and is it generated from the real call or pre-written?
8. **Manager data:** are the aggregate numbers and "last 5 calls" seeded fixtures? I assume yes.
9. **Training assignment:** does the demo end when the manager assigns the exercise, or does the visitor play it?
10. **Seat switching:** each stage could end with a "Continue as sales rep" button, with the role banner kept as a manual override. I recommend both.
11. **Deferred items:** confirm F3, F5, F6 (rep side), F7a and F7b, and F8 are out of the first demo.

## What this means for the current build (nothing changed yet)

- `DEFAULT_DEMO_ROLE` and the `/demo` redirect move from rep to prospect.
- The prospect page becomes the voice agent screen.
- The rep side needs a few routes: intake review and call prep, the live call, a processing screen, and a feedback screen.
- The manager page becomes the shared feedback view with recommendations and aggregates.
- The sidebar items I stubbed can shrink to just the screens in this flow.
- `driver.js` is already a dependency and fits the guided handoffs.

## Where the risk is

The three real-time AI pieces carry almost all of it: the voice agent, the avatar video call, and the live coaching pipeline. The manager and feedback screens can run on fixtures with no infrastructure. A sensible order is to build those first and spike the real-time pieces in parallel, since they decide whether the demo is feasible.

---

# Update 2: everything is real (pipeline and stack)

This section builds on the confirmed flow above. It adds a pipeline that runs before the prospect seat and settles several open questions.

## Stack, as stated

| Piece | Job |
|---|---|
| Vercel Workflows | Durable orchestration of the multi-step pipelines below |
| Firecrawl | Scrape the visitor's company site |
| Clay | Real-time enrichment of the person and company |
| Tavus | AI video avatar that plays the prospect on the call |
| Voice agent | Runs intake. Provider still undecided |

## D0. Business enrichment pipeline (new, runs before the prospect seat)

**Flow:** the email gate collects the visitor's email and their company domain, or offers a test domain. A workflow then scrapes the site, extracts a business profile, enriches the person and company through Clay, and stores the result. That profile seeds everything downstream:

- the voice agent's context (D1)
- the Tavus persona (D3)
- the rep's call prep (D2)
- the feedback and manager views (D4, D5)

The video already in the email gate dialog is the natural place to hide the wait.

**Stories:**
- As a visitor, I want to enter my company domain, or pick a test domain, so the demo is about a business I recognize.
- As the system, I want to scrape the domain and extract company name, real offerings, likely ICP and tone, so agents talk about the real business.
- As the system, I want to enrich the person and company through Clay, so the demo knows who the visitor is.
- As a visitor, I want a sensible fallback if the scrape or enrichment fails or is slow, so I am never stuck at the gate.

## Changes to D1 to D5

- **D1 voice intake:** the agent is seeded with the visitor's actual business information and has web search. Firecrawl search is one candidate for that tool.
- **D2 call prep:** built from the extracted profile plus the intake analysis, so it references real products.
- **D3 live call:** the Tavus avatar role-plays that business's actual ICP, a client interested in one of the company's real products. The coaching prompts are a standard sales playbook: handle objections, state next steps, ask for the close, and similar.
- **D4 feedback:** real, generated from the call transcript after the call ends.
- **D5 manager:** reviews the same real feedback, with recommendations and aggregates. See open question 5 for the data gap.

## Suggested design decision: one shared rubric

Use a single list of playbook skills for three jobs: the live coaching prompts, the post-call feedback scoring, and the manager's pattern detection ("struggled with objection handling in the last 5 calls"). One rubric keeps all three consistent and makes the manager recommendation possible without extra modeling.

Starting skills, from what you named: handle objections, state next steps, ask for the close. Suggested additions to consider: build rapport, ask discovery questions, summarize value.

## Proposed workflow shape (a starting point, not final)

**Workflow 1, prepare the session** (triggered when the email gate is submitted):
1. Validate the email and normalize the domain
2. Scrape the site with Firecrawl
3. Extract a structured business profile
4. Enrich the person and company with Clay
5. Store the profile and create the demo session
6. Build the voice agent context and the Tavus persona

**Workflow 2, process the call** (triggered when the call ends):
1. Collect the full transcript
2. Score the call against the shared rubric
3. Generate the feedback and the manager-facing summary
4. Store results and mark the session ready, so the processing screen resolves

## Open questions resolved by this update

- **Whose business the agent knows:** the visitor's real business, from their domain, or a test domain.
- **Real or pre-baked:** all real, including post-call feedback.
- **Coaching source:** a standard sales playbook, not company-specific.
- **"Tavis":** treated as Tavus, since you named it as the avatar.

## Still open

1. **Which data points and whose?** "Find their name and their email": is that the visitor (already gave an email) or contacts at the company? Which Clay fields do we actually need?
2. **Consent.** Enriching a visitor's personal data probably needs a clear notice on the email gate. Worth deciding the wording before build.
3. **Fallbacks and timeouts.** How long do we wait for the scrape and enrichment before falling back to the test domain? What is the target time from submit to agent ready?
4. **Test domain.** Which company do we use, and is the profile pre-cached for it so the fallback is instant?
5. **Manager aggregates.** A new visitor has made exactly one call. "Their last 5 calls" and team-wide trends need history. Do we seed synthetic earlier calls and reps, and mix them with the real one?
6. **Whose intake does the rep review?** With everything real, the natural answer is the intake the visitor just did. Please confirm, since earlier you said "happened before".
7. **Voice agent provider.** Is intake voice handled by Tavus itself, or a separate voice provider?
8. **Live coaching inputs.** The coach needs a live transcript of both the rep and the avatar. Confirm what the Tavus API exposes in real time, and set a latency target for prompts.
9. **Persistence.** Where do demo sessions, profiles, transcripts and feedback live? Not decided yet.
10. **Cost and abuse.** A public demo triggers paid calls (scrape, enrichment, avatar minutes, voice, model use) for anyone who signs up. We need rate limits, per-visitor caps and probably a spend guard before launch.

## What this means for the current build (nothing changed yet)

- The email gate dialog gains a domain field and a "use a test domain" option. It currently only validates an email format.
- Submitting the gate starts Workflow 1. The dialog needs a waiting state and a fallback path.
- New server routes and workflows, plus keys for Firecrawl, Clay, Tavus and the voice provider.
- A stored demo session record that ties together prospect intake, rep call and feedback, so the manager view can read it.
- Everything from the earlier "what this means" list still applies: default role becomes prospect, and the rep side needs prep, call, processing and feedback screens.

## Risk, restated

Simulation risk is gone. The risk is now chaining several paid third-party calls, in a specific order, fast enough for a live demo. Suggested spike order:

1. Domain to structured business profile (scrape plus extraction)
2. Profile to Tavus persona that plays a believable ICP
3. Voice agent seeded with that profile
4. Live coaching prompts during the Tavus call
5. Post-call feedback from the transcript
6. Manager view over real plus seeded data

The email gate and the manager screens can be built now, in parallel, because they do not depend on any third party.
