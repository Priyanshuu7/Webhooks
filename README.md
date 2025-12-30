# Webhooks Monorepo

This project is a monorepo demonstration of a Webhook architecture using a Learning Management System (LMS) and an Automator service. The LMS service emits webhooks upon events like product purchases, which the Automator service consumes to trigger downstream actions.

## Project Structure

This repository is managed as a monorepo using pnpm workspaces.

* **apps/lms**: The core service where users register webhooks and trigger purchase events.
* **apps/automator**: A worker/consumer service that receives webhook payloads and executes automated tasks.
* **tsconfig.json**: Base TypeScript configuration shared across the monorepo.

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* pnpm (v10.26.2 or higher)

### Installation

Install dependencies for all projects from the root:

```bash
pnpm install

```

### Running the Services

You can run both services simultaneously or individually using the root scripts defined in `package.json`:

```bash
# Run all apps in parallel (dev mode)
pnpm dev

# Run only the LMS
pnpm dev:lms

# Run only the Automator
pnpm dev:automator

```

## Services Overview

### 1. LMS Service (apps/lms)

Acts as the Webhook Provider. It runs on port 3001 by default as specified in its environment configuration.

**Key Implementation (src/index.ts):**

```typescript
// Register a new webhook destination
app.post("/api/register-webhook", async (req, res) => {
  const {url, token, event} = req.body;
  db.push({
    id: Date.now().toString(),
    url, 
    token,  
    event 
  });
  return res.json({ message: 'Webhook Registered' });
});

// Trigger a purchase event
app.post("/api/purchase", (req, res) => {
  const payload = {
    id: Date.now().toString(),
    email: req.body.email,
    name: req.body.name,
    course: req.body.course
  };
  const webhooks = db.filter((webhook) => webhook.event === 'purchase');
  sendWebhook(webhooks, payload);
  return res.json({ message: 'Purchase event processed' });
});

```

### 2. Automator Service (apps/automator)

Acts as the Webhook Consumer. It runs on port 3000 by default.

**Key Implementation (src/index.ts):**

```typescript
app.post('/webhook', (req, res) => {
  // Security check: Verify the Bearer token
  if (req.headers.authorization !== `Bearer ${process.env.secret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const { id, name, email, course } = req.body;
  console.log(`Invite sent to ${name} on ${email} for course ${course}`);
  return res.json({ message: 'OK' });
});

```

## Environment Variables

Each app requires its own .env file within its respective directory.

