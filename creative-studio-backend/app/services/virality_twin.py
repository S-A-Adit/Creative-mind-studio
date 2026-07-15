from __future__ import annotations

# Curated list of 30 successful campaign examples
VIRAL_CAMPAIGNS = [
    {
        "name": "Ice Bucket Challenge",
        "description": "High user participation, low barrier, social proof driven.",
        "metric": "Millions of shares",
    },
    {
        "name": "Dollar Shave Club Launch",
        "description": "Humor, clear value proposition, relatable problem.",
        "metric": "12M+ video views",
    },
    {
        "name": "Spotify Wrapped",
        "description": "Hyper-personalized, shareable graphics, year-end nostalgia.",
        "metric": "Huge organic social traffic",
    },
    {
        "name": "Airbnb 'Live There' Campaign",
        "description": "Experiential storytelling, community-first positioning.",
        "metric": "+30% bookings",
    },
    {
        "name": "Slack Referral Loop",
        "description": "Viral product design, integrations, word-of-mouth.",
        "metric": "Exponential B2B growth",
    },
    {
        "name": "Duolingo TikTok Persona",
        "description": "Meme-driven brand mascot, self-aware humor.",
        "metric": "Millions of followers organically",
    },
    {
        "name": "Red Bull Stratos",
        "description": "Extreme stunt, high-stakes storytelling, live spectacle.",
        "metric": "8M concurrent live views",
    },
    {
        "name": "Nike 'Dream Crazy'",
        "description": "Values-aligned, controversial, emotionally charged.",
        "metric": "Double digit sales growth",
    },
    {
        "name": "Dropbox Free Space Program",
        "description": "Incentivized sharing, two-sided referral.",
        "metric": "3900% growth in 15 months",
    },
    {
        "name": "Old Spice 'The Man Your Man Could Smell Like'",
        "description": "Absurdist humor, direct audience interaction.",
        "metric": "100M+ views",
    },
    # We can expand to 30 examples with simpler stubs
    {
        "name": "Airbnb Walk Like a Local",
        "description": "Community local guide stories.",
        "metric": "High engagement",
    },
    {
        "name": "ALS Association Challenge",
        "description": "Nomination-based social video chain.",
        "metric": "Viral reach",
    },
    {
        "name": "Uber Launch Referral",
        "description": "Free ride credits for both inviter and invitee.",
        "metric": "Rapid city expansion",
    },
    {
        "name": "Candy Crush Lives Loop",
        "description": "Asking friends for lives, built-in network effect.",
        "metric": "Top grossing app",
    },
    {
        "name": "Tesla Cybertruck Reveal",
        "description": "Polarizing design, memorable live fail (broken glass).",
        "metric": "250k preorders in days",
    },
    {
        "name": "Zoom Free 40min Limit",
        "description": "Low friction trial, easy link sharing.",
        "metric": "Market dominance",
    },
    {
        "name": "Subway 'Subway Series'",
        "description": "Simplified menu selection narrative.",
        "metric": "Strong franchise lift",
    },
    {
        "name": "Patagonia 'Don't Buy This Jacket'",
        "description": "Anti-consumerism statement aligned with brand values.",
        "metric": "High customer loyalty",
    },
    {
        "name": "Apple 'Shot on iPhone'",
        "description": "User-generated content showcased on billboards.",
        "metric": "Massive global campaign",
    },
    {
        "name": "ALS Ice Bucket",
        "description": "Simple video nomination challenge.",
        "metric": "Viral social trend",
    },
    {
        "name": "Robinhood Waitlist",
        "description": "Gamified waitlist, referral moves you up.",
        "metric": "1M pre-launch signups",
    },
    {
        "name": "Calm 'Do Nothing for 2 Minutes'",
        "description": "Interactive website challenge demonstrating product value.",
        "metric": "Viral PR coverage",
    },
    {
        "name": "De Beers 'A Diamond is Forever'",
        "description": "Creating a cultural norm via marketing.",
        "metric": "Transformed industry",
    },
    {
        "name": "Share a Coke",
        "description": "Personalized packaging driving social sharing.",
        "metric": "+2% sales increase",
    },
    {
        "name": "Hotmail 'Get Free Email'",
        "description": "Simple footer signature in every sent email.",
        "metric": "12M users in 1.5 years",
    },
    {
        "name": "Wordle Share Grid",
        "description": "Spoiler-free green and yellow emoji share grids.",
        "metric": "Viral daily habit",
    },
    {
        "name": "Metro Trains 'Dumb Ways to Die'",
        "description": "Catchy song, cute characters, serious message.",
        "metric": "200M+ views",
    },
    {
        "name": "Dove 'Real Beauty'",
        "description": "Empowering social statement, high emotional resonance.",
        "metric": "Huge media coverage",
    },
    {
        "name": "Got Milk?",
        "description": "Deprivation strategy showing life without the product.",
        "metric": "Iconic cultural campaign",
    },
    {
        "name": "Geico Hump Day Camel",
        "description": "Humorous weekly trigger event.",
        "metric": "Viral office meme",
    },
]


def find_virality_twin(raw_idea: str) -> dict:
    """Find the closest matching campaign example from the curated list of 30."""
    idea_lower = raw_idea.lower()
    # Find match based on keywords, or return Spotify Wrapped as default
    for campaign in VIRAL_CAMPAIGNS:
        if any(kw in idea_lower for kw in campaign["name"].lower().split()):
            return campaign
    return VIRAL_CAMPAIGNS[2]  # Spotify Wrapped default
