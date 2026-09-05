import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Sparkles,
  Download,
  Copy,
  Check,
  Palmtree,
  Utensils,
  Sun,
  Moon,
  Clock,
  Briefcase,
  Share2,
  Heart,
  Navigation,
  FileText
} from 'lucide-react';

interface ActivityItem {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
  tags: string[];
}

interface DayItinerary {
  dayNumber: number;
  theme: string;
  activities: ActivityItem[];
  insiderTip: string;
}

export default function TravelItineraryPlanner() {
  const [destination, setDestination] = useState<string>('Kyoto, Japan');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [groupType, setGroupType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture & History', 'Food & Dining']);
  const [travelPace, setTravelPace] = useState<'Relaxed' | 'Balanced' | 'Fast-Paced'>('Balanced');

  const [itinerary, setItinerary] = useState<DayItinerary[] | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const interestOptions = [
    'Culture & History',
    'Food & Dining',
    'Nature & Parks',
    'Adventure & Hiking',
    'Shopping & Nightlife',
    'Art & Museums',
    'Photography'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerateItinerary = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated: DayItinerary[] = [];

      for (let day = 1; day <= durationDays; day++) {
        let theme = `Exploring the Heart of ${destination}`;
        if (day === 1) theme = `Arrival & Cultural Landmarks`;
        else if (day === 2) theme = `Local Culinary & Hidden Gems`;
        else if (day === 3) theme = `Nature Escapes & Sunset Views`;
        else if (day === 4) theme = `Artisan Workshops & Shopping`;
        else theme = `Scenic Excursions & Farewell Dinner`;

        generated.push({
          dayNumber: day,
          theme,
          insiderTip: `Buy attraction tickets online 24 hours prior to skip line queues in ${destination}.`,
          activities: [
            {
              timeOfDay: 'Morning',
              title: day === 1 ? `Historic District Walk & Landmark Visit` : `Local Morning Market & Specialty Coffee`,
              description: `Start bright and early with fresh local breakfast pastries followed by a guided walking tour of the historic quarter.`,
              location: `${destination} City Center`,
              estimatedCost: budgetTier === 'Budget' ? '$10 - $15' : budgetTier === 'Luxury' ? '$60 - $100' : '$25 - $40',
              tags: ['Culture', 'Walking']
            },
            {
              timeOfDay: 'Afternoon',
              title: selectedInterests.includes('Food & Dining') ? `Authentic Regional Lunch & Cooking Demo` : `Museum & Architecture Exploration`,
              description: `Enjoy popular local dishes praised by locals, then visit top-rated cultural highlights nearby.`,
              location: `${destination} Arts Quarter`,
              estimatedCost: budgetTier === 'Budget' ? '$15 - $20' : budgetTier === 'Luxury' ? '$120 - $200' : '$35 - $60',
              tags: ['Foodie', 'Sightseeing']
            },
            {
              timeOfDay: 'Evening',
              title: `Panoramic Sunset Point & Nightlife / Dining`,
              description: `Conclude the day at a scenic rooftop or waterfront viewpoint, followed by a cozy dinner experience.`,
              location: `${destination} Waterfront / Skyline`,
              estimatedCost: budgetTier === 'Budget' ? '$20 - $30' : budgetTier === 'Luxury' ? '$150+' : '$50 - $80',
              tags: ['Sunset', 'Dining']
            }
          ]
        });
      }

      setItinerary(generated);
      setIsGenerating(false);
    }, 600);
  };

  const handleCopyMarkdown = () => {
    if (!itinerary) return;

    let text = `# ${durationDays}-Day ${destination} Travel Itinerary\n`;
    text += `**Budget:** ${budgetTier} | **Group:** ${groupType} | **Pace:** ${travelPace}\n\n`;

    itinerary.forEach(day => {
      text += `## Day ${day.dayNumber}: ${day.theme}\n`;
      text += `*Insider Tip: ${day.insiderTip}*\n\n`;
      day.activities.forEach(act => {
        text += `- **${act.timeOfDay}**: ${act.title} (${act.estimatedCost})\n  ${act.description}\n  *Location:* ${act.location}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-teal-100 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
              <Compass className="w-3.5 h-3.5 text-teal-300" />
              AI Travel Planner
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Travel Itinerary Planner</h1>
            <p className="text-teal-100 mt-1 text-sm sm:text-base max-w-2xl">
              Build personalized day-by-day vacation itineraries tailored to your destination, budget, group size, and interests.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-teal-600" /> Trip Preferences
          </h2>

          <div className="space-y-4">
            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destination City / Region
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, Tokyo, Bali, Rome"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Duration & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, Math.min(14, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Budget Style
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                >
                  <option value="Budget">Budget ($)</option>
                  <option value="Moderate">Moderate ($$)</option>
                  <option value="Luxury">Luxury ($$$)</option>
                </select>
              </div>
            </div>

            {/* Group & Pace */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Group Type
                </label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Couple">Couple</option>
                  <option value="Family">Family with Kids</option>
                  <option value="Friends">Friends Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Travel Pace
                </label>
                <select
                  value={travelPace}
                  onChange={(e) => setTravelPace(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                >
                  <option value="Relaxed">Relaxed (1-2 spots/day)</option>
                  <option value="Balanced">Balanced (3 spots/day)</option>
                  <option value="Fast-Paced">Action Packed (4+ spots)</option>
                </select>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Interests & Focus
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        active
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateItinerary}
              disabled={isGenerating || !destination.trim()}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Generating Itinerary...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" /> Build My {durationDays}-Day Trip Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!itinerary ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <Palmtree className="w-12 h-12 text-teal-500 mx-auto opacity-60" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Itinerary Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Enter your dream destination and preferences on the left to generate an instant day-by-day travel plan.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Itinerary Header Bar */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{destination} Itinerary</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {durationDays} Days • {budgetTier} Budget • {groupType} • {travelPace} Pace
                  </p>
                </div>

                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Markdown' : 'Copy Markdown'}
                </button>
              </div>

              {/* Day Cards */}
              <div className="space-y-6">
                {itinerary.map((day) => (
                  <div key={day.dayNumber} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/20 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider">
                        Day {day.dayNumber}: {day.theme}
                      </span>
                    </div>

                    <div className="p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                      {day.activities.map((act, idx) => (
                        <div key={idx} className={`${idx > 0 ? 'pt-4' : ''} flex gap-4`}>
                          <div className="shrink-0 mt-1">
                            {act.timeOfDay === 'Morning' && <Sun className="w-5 h-5 text-amber-500" />}
                            {act.timeOfDay === 'Afternoon' && <Clock className="w-5 h-5 text-teal-500" />}
                            {act.timeOfDay === 'Evening' && <Moon className="w-5 h-5 text-indigo-500" />}
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{act.title}</h4>
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {act.estimatedCost}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{act.description}</p>
                            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium pt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {act.location}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Insider Tip */}
                      <div className="pt-3 text-xs bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300">
                        <strong>💡 Local Insider Tip:</strong> {day.insiderTip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
