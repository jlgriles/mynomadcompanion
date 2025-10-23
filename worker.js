// Cloudflare Worker for MyNomadCompanion
// This handles OpenAI API calls and rate limiting

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

      // Generate playbook using OpenAI
      const playbook = await generatePlaybook(env.OPENAI_API_KEY, {
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
      return new Response(JSON.stringify({ 
        error: 'Internal server error. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Generate playbook using OpenAI
async function generatePlaybook(apiKey, userData) {
  const { destination, duration, budget, workSituation, interests } = userData;

  const systemPrompt = `You are an expert travel advisor specializing in digital nomad trips. Create comprehensive, actionable trip playbooks that combine logistics, cultural immersion, and practical advice. Format your response in clean Markdown with clear sections and bullet points.`;

  const userPrompt = `Create a comprehensive trip playbook for a digital nomad planning to visit ${destination} for ${duration}.

**User Profile:**
- Budget: ${budget}
- Work situation: ${workSituation}
- Interests: ${interests.join(', ')}

**Required Sections:**
1. **Overview** - Brief intro to the destination and why it's great for digital nomads
2. **Pre-Departure Checklist** - Personalized checklist based on duration and work situation
3. **Visa & Legal Requirements** - Entry requirements, visa options, stay duration limits
4. **Budget Breakdown** - Detailed monthly costs (accommodation, food, coworking, transport, entertainment) for their budget tier
5. **Accommodation Recommendations** - Specific neighborhoods and types of housing
6. **Work Setup** - Best coworking spaces, cafes with wifi, time zone considerations
7. **Language Basics** - 30-50 essential phrases with pronunciation guides
8. **Cultural Preparation** - 2-3 book recommendations, 2-3 movies/shows, key customs and etiquette
9. **Transportation Guide** - Apps, metro/bus info, getting around, bike rentals
10. **Neighborhood Guide** - Best areas to live, eat, and explore based on their interests
11. **Essential Resources** - Embassy info, hospitals, pharmacies, emergency contacts
12. **Safety & Health** - Specific safety tips, health precautions, insurance recommendations
13. **Local Tips** - Insider knowledge, hidden gems, things locals wish tourists knew
14. **Sample Itinerary** - First week breakdown and monthly rhythm suggestions

Make it specific, actionable, and tailored to their interests. Include actual place names, specific neighborhoods, and real recommendations. Format in clear Markdown with headers, bullet points, and bold text for emphasis.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate playbook from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
