// Cloudflare Worker for MyNomadCompanion
// This handles Google Gemini API calls and rate limiting

// Configuration
const MAX_REQUESTS_PER_IP = 5;
const RATE_LIMIT_WINDOW_DAYS = 30;

// Main handler
export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      // Get IP address
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      
      // Check rate limit
      const rateLimitKey = `rate_limit:${ip}`;
      const currentCount = await env.RATE_LIMIT.get(rateLimitKey);
      
      if (currentCount && parseInt(currentCount) >= MAX_REQUESTS_PER_IP) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. You can generate up to 5 playbooks per month.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Parse request body
      const body = await request.json();
      const { destination, duration, budget, workSituation, interests } = body;

      // Validate required fields
      if (!destination || !duration || !budget || !workSituation || !interests) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Generate playbook using Google Gemini
      const playbook = await generatePlaybook(env.GEMINI_API_KEY, {
        destination,
        duration,
        budget,
        workSituation,
        interests
      });

      // Increment rate limit counter
      const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
      const expirationTtl = RATE_LIMIT_WINDOW_DAYS * 24 * 60 * 60; // Convert days to seconds
      await env.RATE_LIMIT.put(rateLimitKey, newCount.toString(), {
        expirationTtl: expirationTtl
      });

      // Return playbook
      return new Response(JSON.stringify({ playbook }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      
      // Handle Gemini API quota exceeded
      if (error.message.includes('quota') || error.message.includes('429')) {
        return new Response(JSON.stringify({ 
          error: 'Service temporarily unavailable. The free API quota has been reached. Please try again tomorrow.' 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Generate playbook using Google Gemini
async function generatePlaybook(apiKey, userData) {
  const { destination, duration, budget, workSituation, interests } = userData;

  const prompt = `You are an expert travel advisor specializing in digital nomad trips. Create comprehensive, actionable trip playbooks that combine logistics, cultural immersion, and practical advice.

Create a comprehensive trip playbook for a digital nomad planning to visit ${destination} for ${duration}.

**User Profile:**
- Budget: ${budget}
- Work situation: ${workSituation}
- Interests: ${interests.join(', ')}

**Required Sections:**
1. **Overview** - Brief intro to the destination and why it's great for digital nomads
2. **Pre-Departure Checklist** - Personalized checklist based on duration and work situation - style this as an actual markdown checklist
3. **Visa & Legal Requirements** - Entry requirements, visa options, stay duration limits - keep this brief
4. **Budget Breakdown** - Overview of monthly costs (accommodation, food, coworking, transport, entertainment) for their budget tier
5. **Accommodation Recommendations** - Specific neighborhoods and types of housing
6. **Work Setup** - Best coworking spaces, cafes with wifi, time zone considerations - keep this very brief
7. **Language Basics** - 30-35 essential phrases with pronunciation guides
8. **Cultural Preparation** - 2 book recommendations, 1-2 movies/shows, key customs and etiquette
9. **Transportation Guide** - Apps, metro/bus info, getting around, bike rentals - bullet points only
10. **Neighborhood Guide** - Best areas to live, eat, and explore based on their interests - keep this brief
11. **Essential Resources** - Embassy info, hospitals, pharmacies, emergency contacts, and specific safety tips, health precautions, insurance recommendations
12. **Sample Itinerary** - First 2 days breakdown and weekly rhythm suggestions - keep this very high brief

Make it specific, actionable, and tailored to their interests. Include actual place names, specific neighborhoods, and real recommendations. Format in clean Markdown with headers, bullet points, and bold text for emphasis.`;

  // Retry logic for 503 errors
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 22000,
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error:', error);
        
        // Parse error to check if it's 503
        try {
          const errorJson = JSON.parse(error);
          if (errorJson.error && errorJson.error.code === 503 && attempt < maxRetries) {
            console.log(`Attempt ${attempt}/${maxRetries} failed with 503, retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000)); // Wait 2, 4, 6 seconds
            lastError = error;
            continue; // Retry
          }
        } catch (e) {
          // Not JSON, just throw
        }
        
        throw new Error('Failed to generate playbook from Gemini API');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      lastError = error;
      console.log(`Attempt ${attempt}/${maxRetries} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    }
  }
  
  throw lastError || new Error('Failed after retries');
}
