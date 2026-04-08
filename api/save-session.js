// api/save-session.js
// Saves interview session results to Supabase
// Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel environment variables

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { mode, question, answer, score, accuracy, clarity, depth, feedback } = req.body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key server-side

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase not configured' });
    }

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                mode,
                question,
                answer,
                score,
                accuracy,
                clarity,
                depth,
                feedback,
                created_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Supabase save error:', err);
        return res.status(500).json({ error: 'Failed to save session', detail: err.message });
    }
}
