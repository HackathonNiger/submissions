# Database Integration Setup Guide

This guide explains how to set up Supabase database integration for conversation history and follow-up questions in the Healthmate AI application.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Python Dependencies**: Already installed via `pip install supabase`

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and project name (e.g., "healthmate-ai")
4. Set a database password (remember this!)
5. Choose a region close to your users
6. Click "Create new project"

## Step 2: Set Up Database Schema

1. Once your project is ready, go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `backend/database_schema.sql`
3. Paste and run the SQL script in the Supabase SQL Editor
4. This will create the following tables:
   - `sessions`: Conversation sessions
   - `conversations`: Individual messages and responses
   - `followup_questions`: Generated follow-up questions
   - `user_profiles`: Optional user information
   - `health_insights`: Analysis results and recommendations

## Step 3: Configure Environment Variables

1. In your Supabase project dashboard, go to Settings > API
2. Copy your project URL and anon key
3. Create a `.env` file in the `backend/` directory (copy from `.env.example`)
4. Add your Supabase credentials:

```env
# Supabase Database Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Test Database Connection

Run the backend server to test the database connection:

```bash
cd backend
python app.py
```

Check the logs for "Successfully connected to Supabase" message.

## Step 5: API Endpoints

The following new endpoints are now available:

### Session Management
- `POST /api/sessions` - Create a new conversation session
- `GET /api/sessions/recent` - Get recent sessions
- `GET /api/sessions/{session_id}/history` - Get conversation history
- `GET /api/sessions/{session_id}/followup` - Get follow-up questions

### Enhanced Health Analysis
- `POST /api/health/analyze` - Now supports session tracking
  ```json
  {
    "message": "I have a headache and fever",
    "session_id": "optional-existing-session-id",
    "user_id": "optional-user-identifier"
  }
  ```

## Step 6: Frontend Integration

The frontend API client (`frontend-nextjs/src/lib/api.ts`) has been updated with new methods:

```typescript
// Create a new session
const session = await apiClient.createSession('symptom_checker', 'user123');

// Analyze health with session tracking
const response = await apiClient.analyzeHealth(
  "I have a headache", 
  session.session_id, 
  "user123"
);

// Get conversation history
const history = await apiClient.getConversationHistory(session.session_id);

// Get follow-up questions
const followups = await apiClient.getFollowupQuestions(session.session_id);
```

## Step 7: Database Features

### Conversation Persistence
- All user messages and AI responses are automatically saved
- Conversations are linked to sessions for context
- Metadata includes language, confidence scores, and other analysis data

### Intelligent Follow-ups
- System generates contextual follow-up questions based on conversation history
- Questions are categorized by symptom type (pain, fever, respiratory, etc.)
- Smart filtering to avoid duplicate questions

### Session Management
- Sessions can be anonymous or linked to user IDs
- Support for different session types: 'chat', 'symptom_checker', 'triage'
- Automatic timestamps and metadata tracking

### User Profiles (Optional)
- Store user preferences like language settings
- Track medical conditions and allergies for personalized responses
- Emergency contact information storage

## Step 8: Security Considerations

### Row Level Security (RLS)
- RLS is enabled on all tables
- Current policies allow anonymous access for basic functionality
- Consider restricting policies for production use

### Data Retention
- Built-in cleanup function for old sessions
- Recommended: Set up periodic cleanup jobs
- Consider GDPR compliance for user data

## Step 9: Monitoring and Analytics

### Available Data
- Session duration and message counts
- Symptom frequency analysis
- User engagement patterns
- Response confidence scores

### Query Examples
```sql
-- Most common symptoms
SELECT 
  jsonb_array_elements_text(metadata->'symptoms') as symptom,
  COUNT(*) as frequency
FROM conversations 
WHERE message_type = 'health'
GROUP BY symptom
ORDER BY frequency DESC;

-- Average session duration
SELECT AVG(
  EXTRACT(EPOCH FROM (updated_at - created_at))/60
) as avg_duration_minutes
FROM sessions 
WHERE is_active = false;
```

## Step 10: Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check network connectivity
- Ensure project is not paused (free tier pauses after inactivity)

**RLS Policy Errors**
- Check that RLS policies allow your operations
- Verify anon key has correct permissions
- Consider temporarily disabling RLS for testing

**Missing Tables**
- Ensure database_schema.sql was run completely
- Check for SQL errors in Supabase logs
- Verify all extensions are enabled

### Logs and Debugging
- Backend logs show database operation results
- Supabase dashboard provides query logs
- Use browser dev tools to inspect API responses

## Production Deployment Considerations

1. **Security**: Implement proper RLS policies for multi-user scenarios
2. **Performance**: Add indexes for frequently queried columns
3. **Backup**: Enable automated backups in Supabase
4. **Monitoring**: Set up alerting for database errors
5. **Scaling**: Monitor database usage and upgrade plan as needed

## Next Steps

With the database integration complete, you can now:
- Implement conversation history UI components
- Add user authentication for personalized experiences
- Build analytics dashboards
- Implement advanced follow-up question logic
- Add export functionality for user data

For more advanced features, consider:
- Real-time updates using Supabase's real-time subscriptions
- Full-text search across conversation history
- ML-powered conversation analysis
- Integration with external health APIs