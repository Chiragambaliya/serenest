/**
 * AI assistant (site concierge — OpenAI, server-side key only).
 */
import { handleAssistantChat } from '../aiAssistant.js';

export function registerAssistantRoutes(app) {
  /** POST /api/assistant/chat — body: { messages: [{ role, content }] } */
  app.post('/api/assistant/chat', (req, res, next) => {
    handleAssistantChat(req, res).catch(next);
  });
}
