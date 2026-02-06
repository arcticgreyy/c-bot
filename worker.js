// C-Bot Excuse Generator - Cloudflare Worker
// Runs on Cloudflare’s free tier (100k requests/day)

export default {
async fetch(request, env) {
// Handle CORS
if (request.method === ‘OPTIONS’) {
return new Response(null, {
headers: {
‘Access-Control-Allow-Origin’: ‘*’,
‘Access-Control-Allow-Methods’: ‘POST, OPTIONS’,
‘Access-Control-Allow-Headers’: ‘Content-Type’,
},
});
}

```
// Route handling
const url = new URL(request.url);

if (url.pathname === '/api/excuse' && request.method === 'POST') {
  return handleExcuseRequest(request);
}

// Serve the HTML for the root path
if (url.pathname === '/' || url.pathname === '/index.html') {
  return new Response(HTML_CONTENT, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

return new Response('Not Found', { status: 404 });
```

},
};

async function handleExcuseRequest(request) {
try {
const { message, snark, tone } = await request.json();

```
const excuse = generateExcuse(message, snark, tone);

return new Response(JSON.stringify({ excuse }), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
```

} catch (error) {
return new Response(JSON.stringify({
excuse: “Listen, I’d give you an excuse but my AI-powered excuse synthesis pipeline is currently experiencing a critical paradigm shift.”
}), {
status: 500,
headers: {
‘Content-Type’: ‘application/json’,
‘Access-Control-Allow-Origin’: ‘*’,
},
});
}
}

function generateExcuse(userMessage, snarkLevel, tone) {
const messageLC = userMessage.toLowerCase();

// Check for emotional outburst triggers (10% chance on status questions)
const isStatusQuestion = messageLC.includes(‘status’) ||
messageLC.includes(‘done’) ||
messageLC.includes(‘finish’) ||
messageLC.includes(‘progress’) ||
messageLC.includes(‘when’) ||
messageLC.includes(‘deadline’);

const shouldOutburst = isStatusQuestion && Math.random() < 0.15;

if (shouldOutburst) {
return generateOutburst(snarkLevel);
}

// Generate normal excuse
const templates = getTemplates(tone, snarkLevel);
const template = templates[Math.floor(Math.random() * templates.length)];

return interpolateTemplate(template);
}

function generateOutburst(snarkLevel) {
const outbursts = {
low: [
“You know what? I’m going to be honest with you. I’ve been working on strategic initiatives that align with my personal brand development. Your project is in the backlog. The emotional backlog. Of my soul.”,
“I CAN’T KEEP BEING THE ONLY ONE WHO CARES ABOUT HOLISTIC INTEGRATION FRAMEWORKS! Everyone wants the MVP but nobody wants to nurture the roadmap! I’M TIRED!”,
“Look, I’m just going to say it: I’ve been attending so many cross-functional alignment meetings about this that I literally forgot what ‘this’ even is. My bandwidth is GONE.”
],
medium: [
“OH SO NOW IT’S A PRIORITY?! Where was this energy when I was pitching my blockchain-enabled agile transformation initiative?! I’ve been SILOED!”,
“You want status? STATUS?! I’ll give you status: I’m experiencing emotional technical debt because leadership won’t let me sunset this legacy mindset I’m operating under!”,
“I’ve literally been grinding 24/7 on optimizing my personal KPIs and suddenly everyone wants deliverables! DO YOU KNOW HOW MANY COFFEE CHATS I’VE HAD TO ATTEND?!”
],
high: [
“ARE YOU KIDDING ME RIGHT NOW?! I’ve been INNOVATING in the IDEATION SPACE and you want… what… ACTUAL WORK?! My genius can’t be measured by your PEDESTRIAN METRICS!”,
“I AM A FULL-STACK THOUGHT LEADER AND I WILL NOT BE CONTAINERIZED INTO YOUR LEGACY PRODUCTIVITY PARADIGM! *throws digital clipboard*”,
“OH WONDERFUL, ANOTHER STAKEHOLDER WHO DOESN’T UNDERSTAND THAT I’M OPERATING IN A DIFFERENT TEMPORAL DIMENSION WHERE DEADLINES ARE JUST SOCIAL CONSTRUCTS! I’M HAVING A REAL MOMENT HERE!”
]
};

const levelOutbursts = outbursts[snarkLevel] || outbursts.medium;
return levelOutbursts[Math.floor(Math.random() * levelOutbursts.length)];
}

function getTemplates(tone, snarkLevel) {
const templates = [];

// Corporate tone templates
if (tone === ‘corporate’) {
templates.push(
“Actually, I’ve been {ACTION} to {OPTIMIZE} our {METRIC} by {PERCENTAGE}%. As per my last {COMMUNICATION}, this requires a {TIMEFRAME} strategic {INITIATIVE} before we can {DELIVER}.”,
“I’m currently {BLOCKED} by {DEPENDENCY} which is impacting my ability to {ACHIEVE} the {GOAL}. We need to {CIRCLE_BACK} after I {SYNC} with {STAKEHOLDER}.”,
“Great question! I’ve been leveraging {BUZZWORD} to drive {OUTCOME}, but we’re experiencing some {BLOCKER} in the {SYSTEM}. Let me {ACTION} and I’ll {FOLLOW_UP} by {VAGUE_TIME}.”,
“So I actually {STARTED} this {TIMEFRAME_PAST}, but then {EXCUSE_EVENT} happened and we had to pivot our {STRATEGY}. Currently {IN_PROGRESS} and targeting {VAGUE_FUTURE} for {COMPLETION}.”,
“I hear you, but have you considered that this requires {UNNECESSARY_THING}? I’ve been collaborating with {IMAGINARY_TEAM} to ensure we’re {CORPORATE_SPEAK} before we {ACTION}.”
);

```
if (snarkLevel === 'high') {
  templates.push(
    "Honestly? I've been so busy {HUMBLE_BRAG} that I haven't had bandwidth to {BASIC_TASK}. This really needs a {OVERLY_COMPLEX} approach anyway.",
    "Per my {NUMBER} emails, I clearly stated we need {UNREASONABLE_REQUIREMENT} before I can even {START}. This is exactly why I advocated for {BUZZWORD} in Q{QUARTER}."
  );
}
```

}

// Technical tone templates
if (tone === ‘technical’) {
templates.push(
“Yeah so I was {ACTION} but then I realized we need to refactor the entire {TECH_THING} to implement {FRAMEWORK}. The technical debt here is {EXAGGERATION}.”,
“The {COMPONENT} is experiencing {PERCENT}% {TECH_PROBLEM} which is blocking my {SOLUTION}. I’ve been debugging the {SYSTEM} but it’s a {COMPLEXITY} issue.”,
“I mean, I could {SIMPLE_TASK}, but without proper {TECH_BUZZWORD} implementation, we’re basically building on {TECH_METAPHOR}. Need to architect this correctly.”,
“Currently blocked on {DEPENDENCY} because the {API} doesn’t support {FEATURE} in our {ENVIRONMENT}. I’ve opened a ticket but they said {VAGUE_TIME}.”,
“Look, I started migrating to {NEW_TECH} because {OLD_TECH} is deprecated (according to {DUBIOUS_SOURCE}). It’s {PERCENT}% faster but requires rewriting {EVERYTHING}.”
);

```
if (snarkLevel === 'high') {
  templates.push(
    "Bro I've been down a RABBIT HOLE optimizing the {TECH_THING}. Saved like {BIG_NUMBER} {UNIT} but then realized we need to {REBUILD_EVERYTHING}.",
    "Not gonna lie, I spent all {TIMEFRAME} implementing {TRENDY_TECH} because {WEAK_REASON}. It's gonna be SICK when it's done tho."
  );
}
```

}

// Defensive tone templates
if (tone === ‘defensive’) {
templates.push(
“I actually {DID_SOMETHING} {TIMEFRAME_PAST} but nobody told me about {THING_NOBODY_MENTIONED}. How was I supposed to know we needed {OBVIOUS_THING}?”,
“This is literally the first I’m hearing about {PRIORITY}. I’ve been {ACTION} like you asked, but now you’re saying {CONTRADICTION}? I can’t read minds.”,
“Okay but {PERSON} said {PARAPHRASE} so I {INTERPRETED_WRONG}. If there was a clear {DOCUMENTATION} I wouldn’t have {MISTAKE}.”,
“I mean I WOULD have {DONE_IT}, but I was never given access to {SYSTEM}. I requested it {VAGUE_TIME} and still nothing. Not my fault if the process is broken.”,
“Nobody TOLD me this was {PRIORITY_LEVEL}. I’ve been juggling like {NUMBER} different {THINGS} and apparently I’m supposed to just KNOW what matters most?”
);

```
if (snarkLevel === 'high') {
  templates.push(
    "Oh so NOW it matters? Because when I brought up {RELATED_THING} in {MEETING} everyone said it was fine to {DELAY}. Interesting.",
    "I'm sorry I don't have 48 hour days like apparently everyone else on this team. I've been DROWNING in {VAGUE_RESPONSIBILITIES} while y'all are out here expecting miracles."
  );
}
```

}

return templates;
}

function interpolateTemplate(template) {
const replacements = {
ACTION: [‘synergizing’, ‘optimizing’, ‘leveraging’, ‘architecting’, ‘strategizing’, ‘socializing’, ‘pressure-testing’, ‘right-sizing’, ‘future-proofing’, ‘operationalizing’],
OPTIMIZE: [‘maximize’, ‘enhance’, ‘streamline’, ‘revolutionize’, ‘transform’, ‘unlock’, ‘amplify’, ‘accelerate’, ‘supercharge’, ‘catalyze’],
METRIC: [‘KPIs’, ‘ROI’, ‘stakeholder value’, ‘north star metrics’, ‘engagement vectors’, ‘conversion funnels’, ‘velocity metrics’, ‘impact quotient’, ‘synergy coefficient’],
PERCENTAGE: [‘237’, ‘420’, ‘1000’, ‘156’, ‘847’, ‘69’, ‘314’, ‘666’, ‘999’],
COMMUNICATION: [‘standup’, ‘sync’, ‘email’, ‘Slack’, ‘whiteboarding session’, ‘parking lot discussion’, ‘alignment call’, ‘checkpoint meeting’],
TIMEFRAME: [‘multi-quarter’, ‘phased’, ‘iterative’, ‘agile’, ‘waterfall’, ‘hybrid’, ‘sprint-based’, ‘milestone-driven’],
INITIATIVE: [‘deep-dive’, ‘tiger team’, ‘task force’, ‘working group’, ‘center of excellence’, ‘innovation lab’, ‘ideation sprint’, ‘discovery phase’],
DELIVER: [‘ship’, ‘deploy’, ‘go-live’, ‘launch’, ‘activate’, ‘operationalize’, ‘productionize’, ‘sunset the beta’],
BLOCKED: [‘bottlenecked’, ‘gated’, ‘dependencies-locked’, ‘resource-constrained’, ‘bandwidth-limited’, ‘siloed’, ‘context-switching’],
DEPENDENCY: [‘the API gateway migration’, ‘cross-functional alignment’, ‘legal review’, ‘budget approval’, ‘vendor negotiations’, ‘the platform team’, ‘infrastructure provisioning’],
ACHIEVE: [‘unlock’, ‘actualize’, ‘manifest’, ‘crystallize’, ‘materialize’, ‘realize’, ‘deliver on’],
GOAL: [‘milestone’, ‘OKR’, ‘deliverable’, ‘success criteria’, ‘acceptance criteria’, ‘exit criteria’, ‘definition of done’],
CIRCLE_BACK: [‘reconnect’, ‘touch base’, ‘sync up’, ‘align’, ‘regroup’, ‘huddle’, ‘do a temperature check’],
SYNC: [‘align’, ‘calibrate’, ‘coordinate’, ‘integrate’, ‘harmonize’, ‘synchronize’, ‘get on the same page with’],
STAKEHOLDER: [‘the steering committee’, ‘leadership’, ‘the product owner’, ‘my skip-level’, ‘the exec team’, ‘cross-functional partners’],
BUZZWORD: [‘AI/ML pipelines’, ‘blockchain integration’, ‘cloud-native architecture’, ‘microservices’, ‘edge computing’, ‘data mesh topology’, ‘zero-trust security’],
OUTCOME: [‘actionable insights’, ‘measurable impact’, ‘transformative results’, ‘competitive advantage’, ‘market differentiation’, ‘operational excellence’],
BLOCKER: [‘capacity constraints’, ‘scope creep’, ‘technical debt’, ‘legacy integrations’, ‘compliance requirements’, ‘change management friction’],
SYSTEM: [‘CI/CD pipeline’, ‘observability stack’, ‘data lake’, ‘service mesh’, ‘orchestration layer’, ‘analytics platform’],
FOLLOW_UP: [‘circle back’, ‘close the loop’, ‘provide an update’, ‘share an ETA’, ‘deliver a status report’, ‘ping the thread’],
VAGUE_TIME: [‘EOD’, ‘EOW’, ‘early next week’, ‘the next sprint’, ‘Q3-ish’, ‘when bandwidth allows’, ‘post-launch’, ‘after the all-hands’],
STARTED: [‘kicked off’, ‘initiated’, ‘began scoping’, ‘started discovery on’, ‘commenced planning for’, ‘opened the epic for’],
TIMEFRAME_PAST: [‘last sprint’, ‘two weeks ago’, ‘before the holiday’, ‘in Q1’, ‘during the offsite’, ‘back in January’],
EXCUSE_EVENT: [‘the re-org’, ‘that P0 incident’, ‘the fire drill’, ‘the security audit’, ‘the compliance review’, ‘the all-hands prep’],
STRATEGY: [‘go-to-market approach’, ‘execution plan’, ‘rollout strategy’, ‘implementation roadmap’, ‘adoption framework’],
IN_PROGRESS: [‘actively iterating’, ‘in the backlog’, ‘queued for next sprint’, ‘80% complete’, ‘in code review’, ‘blocked on QA’],
VAGUE_FUTURE: [‘next month’, ‘Q4’, ‘the near future’, ‘when we hit our targets’, ‘post-MVP’, ‘after we stabilize’],
COMPLETION: [‘launch’, ‘delivery’, ‘rollout’, ‘implementation’, ‘go-live’, ‘production release’],
UNNECESSARY_THING: [‘a full architectural review’, ‘executive buy-in’, ‘a proof of concept’, ‘a risk assessment’, ‘user research’, ‘A/B testing’],
IMAGINARY_TEAM: [‘the platform squad’, ‘our offshore partners’, ‘the DevOps guild’, ‘the architecture review board’, ‘the PMO’],
CORPORATE_SPEAK: [‘de-risking the approach’, ‘validating the hypothesis’, ‘stress-testing the assumptions’, ‘pressure-testing the model’, ‘socializing the concept’],
HUMBLE_BRAG: [‘mentoring junior devs’, ‘leading the DEI initiative’, ‘presenting at the conference’, ‘interviewing candidates’, ‘documenting best practices’],
BASIC_TASK: [‘update that ticket’, ‘respond to emails’, ‘attend standups’, ‘make actual progress’, ‘do the thing I was hired for’],
OVERLY_COMPLEX: [‘design thinking workshop’, ‘three-phase rollout’, ‘cross-matrix analysis’, ‘stakeholder mapping exercise’, ‘impact-effort assessment’],
NUMBER: [‘17’, ‘23’, ‘42’, ‘7’, ‘99’, ‘13’, ‘31’, ‘64’],
UNREASONABLE_REQUIREMENT: [‘sign-off from the CFO’, ‘a dedicated scrum master’, ‘enterprise-grade tooling’, ‘24/7 support coverage’, ‘SOC 2 compliance’],
START: [‘think about starting’, ‘begin planning’, ‘scope the work’, ‘estimate the effort’, ‘draft the proposal’],
QUARTER: [‘1’, ‘2’, ‘3’, ‘4’],
TECH_THING: [‘service mesh’, ‘build pipeline’, ‘state management’, ‘caching layer’, ‘load balancer’, ‘container orchestration’, ‘API gateway’],
FRAMEWORK: [‘React 19’, ‘Kubernetes’, ‘GraphQL federation’, ‘event-driven architecture’, ‘CQRS pattern’, ‘serverless functions’],
EXAGGERATION: [‘astronomical’, ‘insurmountable’, ‘existential’, ‘catastrophic’, ‘absolutely massive’, ‘bordering on theoretical’],
TECH_PROBLEM: [‘latency’, ‘memory leaks’, ‘race conditions’, ‘N+1 queries’, ‘cache invalidation’, ‘deadlocks’],
COMPONENT: [‘monorepo’, ‘worker pool’, ‘message queue’, ‘database cluster’, ‘CDN’, ‘authentication service’],
SOLUTION: [‘distributed tracing implementation’, ‘horizontal scaling’, ‘database migration’, ‘cache warming’, ‘load testing’],
COMPLEXITY: [‘distributed systems’, ‘concurrency’, ‘consistency’, ‘CAP theorem’, ‘eventual consistency’],
SIMPLE_TASK: [‘ship this feature’, ‘fix that bug’, ‘deploy to prod’, ‘update the docs’, ‘merge the PR’],
TECH_BUZZWORD: [‘observability’, ‘GitOps’, ‘infrastructure as code’, ‘chaos engineering’, ‘feature flagging’, ‘canary deployment’],
TECH_METAPHOR: [‘quicksand’, ‘a house of cards’, ‘duct tape and prayers’, ‘a ticking time bomb’, ‘spaghetti code’],
API: [‘REST endpoint’, ‘GraphQL schema’, ‘webhook’, ‘gRPC service’, ‘WebSocket connection’],
FEATURE: [‘batching’, ‘pagination’, ‘rate limiting’, ‘versioning’, ‘backwards compatibility’],
ENVIRONMENT: [‘staging cluster’, ‘production namespace’, ‘dev environment’, ‘canary deployment’, ‘edge runtime’],
NEW_TECH: [‘Deno’, ‘Bun’, ‘Astro’, ‘SolidJS’, ‘Qwik’, ‘htmx’, ‘Tauri’],
OLD_TECH: [‘jQuery’, ‘Angular 1’, ‘Backbone’, ‘that legacy PHP app’, ‘the monolith’],
DUBIOUS_SOURCE: [‘this Medium article’, ‘a tweet’, ‘Hacker News’, ‘my bootcamp instructor’, ‘Stack Overflow’],
PERCENT: [‘10’, ‘50’, ‘100’, ‘500’, ‘1000’],
BIG_NUMBER: [‘10GB’, ‘1000 requests/sec’, ‘50ms’, ‘10,000 lines’, ‘500MB’],
UNIT: [‘of latency’, ‘in bundle size’, ‘of memory’, ‘of queries’, ‘of technical debt’],
REBUILD_EVERYTHING: [‘rewrite the entire codebase’, ‘migrate the database’, ‘rebuild from scratch’, ‘start over with TypeScript’],
TRENDY_TECH: [‘WebAssembly’, ‘Rust’, ‘edge functions’, ‘Islands architecture’, ‘resumability’, ‘streaming SSR’],
WEAK_REASON: [‘it was trending on Twitter’, ‘I saw it in a conference talk’, ‘everyone is switching to it’, “it’s the future”],
DID_SOMETHING: [‘completed the task’, ‘sent the update’, ‘made the changes’, ‘shipped the feature’, ‘fixed the issue’],
THING_NOBODY_MENTIONED: [‘the breaking API change’, ‘the new requirements’, ‘the compliance rules’, ‘the budget constraints’, ‘the deadline change’],
OBVIOUS_THING: [‘testing’, ‘documentation’, ‘error handling’, ‘monitoring’, ‘backwards compatibility’],
PRIORITY: [‘being top priority’, ‘this being urgent’, ‘the deadline’, ‘these requirements’, ‘this scope’],
CONTRADICTION: [‘it needs to be different’, “that’s not what we wanted”, ‘we need more features’, “we’re going another direction”],
PERSON: [‘Sarah from Product’, ‘the PM’, ‘leadership’, ‘someone in Slack’, ‘the tech lead’],
PARAPHRASE: [‘it could wait until next sprint’, ‘“no rush on this”’, ‘to deprioritize it’, ‘it was a nice-to-have’, ‘to focus on other things’],
INTERPRETED_WRONG: [‘assumed it was low priority’, ‘thought that was optional’, ‘understood it differently’, ‘missed that requirement’],
DOCUMENTATION: [‘spec document’, ‘requirements doc’, ‘design proposal’, ‘RFC’, ‘project charter’, ‘JIRA ticket’],
MISTAKE: [‘taken this approach’, ‘missed that detail’, ‘assumed incorrectly’, ‘gone this direction’],
DONE_IT: [‘finished on time’, ‘completed it properly’, ‘delivered as expected’, ‘met the deadline’],
PRIORITY_LEVEL: [‘urgent’, ‘critical’, ‘high-priority’, ‘blocking’, ‘a P0’],
THINGS: [‘initiatives’, ‘projects’, ‘fires’, ‘priorities’, ‘workstreams’, ‘deliverables’],
RELATED_THING: [‘timeline concerns’, ‘resource constraints’, ‘technical challenges’, ‘scope issues’],
MEETING: [‘standup’, ‘planning’, ‘retro’, ‘the all-hands’, ‘sprint planning’],
DELAY: [‘push it to next sprint’, ‘table it for now’, ‘backlog it’, ‘revisit later’],
VAGUE_RESPONSIBILITIES: [‘strategic initiatives’, ‘cross-functional collaboration’, ‘stakeholder management’, ‘technical leadership’]
};

let result = template;

for (const [key, values] of Object.entries(replacements)) {
const placeholder = `{${key}}`;
while (result.includes(placeholder)) {
const replacement = values[Math.floor(Math.random() * values.length)];
result = result.replace(placeholder, replacement);
}
}

return result;
}

// Inline the HTML content
const HTML_CONTENT = `<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C-Bot - Your Least Helpful Coworker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

```
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    .chat-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 800px;
        height: 90vh;
        max-height: 700px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .chat-header {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 20px;
        color: white;
        border-radius: 16px 16px 0 0;
    }

    .chat-header h1 {
        font-size: 24px;
        margin-bottom: 5px;
    }

    .chat-header p {
        font-size: 12px;
        opacity: 0.9;
    }

    .controls {
        padding: 15px 20px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .control-group label {
        font-size: 12px;
        font-weight: 600;
        color: #495057;
    }

    .control-group select {
        padding: 5px 10px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 12px;
        background: white;
        cursor: pointer;
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
    }

    .message {
        display: flex;
        margin-bottom: 16px;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .message.user {
        justify-content: flex-end;
    }

    .message-content {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
    }

    .message.user .message-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-bottom-right-radius: 4px;
    }

    .message.bot .message-content {
        background: white;
        color: #212529;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .message-sender {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 4px;
        opacity: 0.8;
    }

    .message.bot .message-sender {
        color: #f5576c;
    }

    .input-area {
        padding: 20px;
        background: white;
        border-top: 1px solid #e9ecef;
    }

    .input-wrapper {
        display: flex;
        gap: 10px;
    }

    #messageInput {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
    }

    #messageInput:focus {
        border-color: #667eea;
    }

    #sendButton {
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 24px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    #sendButton:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    #sendButton:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .typing-indicator {
        display: none;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: white;
        border-radius: 18px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: fit-content;
    }

    .typing-indicator.active {
        display: flex;
    }

    .typing-dot {
        width: 8px;
        height: 8px;
        background: #adb5bd;
        border-radius: 50%;
        animation: typing 1.4s infinite;
    }

    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }

    .messages::-webkit-scrollbar {
        width: 6px;
    }

    .messages::-webkit-scrollbar-track {
        background: #f8f9fa;
    }

    .messages::-webkit-scrollbar-thumb {
        background: #dee2e6;
        border-radius: 3px;
    }

    .messages::-webkit-scrollbar-thumb:hover {
        background: #adb5bd;
    }
</style>
```

</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>💼 C-Bot</h1>
            <p>Your least qualified, most entitled coworker • Online (unfortunately)</p>
        </div>

```
    <div class="controls">
        <div class="control-group">
            <label for="snarkLevel">Snark Level:</label>
            <select id="snarkLevel">
                <option value="low">Passive-Aggressive</option>
                <option value="medium" selected>Corporate Gaslighting</option>
                <option value="high">Unhinged</option>
            </select>
        </div>
        <div class="control-group">
            <label for="toneLevel">Tone:</label>
            <select id="toneLevel">
                <option value="corporate" selected>Synergistic</option>
                <option value="technical">Tech Bro</option>
                <option value="defensive">Victim Complex</option>
            </select>
        </div>
    </div>

    <div class="messages" id="messages">
        <div class="message bot">
            <div class="message-content">
                <div class="message-sender">C-Bot</div>
                <div>Hey there! I'm C-Bot, your most "valuable" team member! 🎯 I specialize in leveraging cross-functional synergies to optimize my strategic bandwidth allocation. Translation: I'm here to give you excuses that'll make your eyes roll so hard you'll see your brain. What do you need an excuse for today?</div>
            </div>
        </div>
    </div>

    <div class="input-area">
        <div class="input-wrapper">
            <input 
                type="text" 
                id="messageInput" 
                placeholder="Ask about project status, deadlines, or literally anything..."
                autocomplete="off"
            />
            <button id="sendButton">Send</button>
        </div>
    </div>
</div>

<script>
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const snarkLevel = document.getElementById('snarkLevel');
    const toneLevel = document.getElementById('toneLevel');

    let typingIndicator = null;

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (!isUser) {
            const senderDiv = document.createElement('div');
            senderDiv.className = 'message-sender';
            senderDiv.textContent = 'C-Bot';
            contentDiv.appendChild(senderDiv);
        }
        
        const textDiv = document.createElement('div');
        textDiv.textContent = content;
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(contentDiv);
        messagesDiv.appendChild(messageDiv);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showTypingIndicator() {
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = \`
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            \`;
            messagesDiv.appendChild(typingIndicator);
        }
        typingIndicator.classList.add('active');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
        }
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        messageInput.value = '';
        sendButton.disabled = true;

        showTypingIndicator();

        try {
            const response = await fetch('/api/excuse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    snark: snarkLevel.value,
                    tone: toneLevel.value
                })
            });

            const data = await response.json();
            
            setTimeout(() => {
                hideTypingIndicator();
                addMessage(data.excuse);
                sendButton.disabled = false;
                messageInput.focus();
            }, 800 + Math.random() * 1200);

        } catch (error) {
            hideTypingIndicator();
            addMessage("Ugh, my excuse generator is experiencing an unplanned strategic realignment. Try again in a few synergy cycles.");
            sendButton.disabled = false;
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    messageInput.focus();
</script>
```

</body>
</html>`;
