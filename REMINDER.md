# Secret Handling Reminder

- Never commit secrets (DB passwords, OpenAI keys, tokens) to git.
- Store them in a local `.env` and ensure `.env` stays in `.gitignore`.
- Configure runtime with env vars, e.g.:
  - `MONGO_URI="mongodb+srv://smarttrip:<password>@cluster0.vouhpio.mongodb.net/?appName=Cluster0"`
  - `OPENAI_API_KEY=sk-...`
- Start services using env vars (examples):
  - `MONGO_URI="..." OPENAI_API_KEY="..." PORT=5001 npm run server`
  - `PORT=3001 npm run client`
- Rotate keys if they ever leak and update `.env` locally (do not commit).

