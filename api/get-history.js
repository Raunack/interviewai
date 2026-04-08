// api/get-history.js
// Fetches session history from Supabase for the progress dashboard
// Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel environment variables

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase not configured' });
    }

    const { mode, limit = 20 } = req.query;
    let url = `${supabaseUrl}/rest/v1/sessions?select=*&order=created_at.desc&limit=${limit}`;
    if (mode) url += `&mode=eq.${mode}`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        console.error('Supabase fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch history', detail: err.message });
    }
}
