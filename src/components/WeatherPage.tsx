import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { fetchLiveWeather, INDIAN_CITIES_COORDS } from '../services/liveUtilityService';
import { 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  Sunrise, 
  Sunset, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  MapPin, 
  Sparkles,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const [cityQuery, setCityQuery] = useState<string>('Patna');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const loadWeather = async (targetCity: string) => {
    setLoading(true);
    try {
      const data = await fetchLiveWeather(targetCity);
      setWeather(data);
    } catch (e) {
      console.error('Weather load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(cityQuery);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityQuery.trim()) {
      loadWeather(cityQuery.trim());
    }
  };

  const handleQuickCity = (cityKey: string, cityName: string) => {
    setCityQuery(cityName);
    loadWeather(cityKey);
  };

  // Weather animation background selector
  const renderWeatherVisualEffect = () => {
    if (!weather) return null;
    const type = weather.weatherType;

    if (type === 'rain' || type === 'thunderstorm') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
          {/* Animated Rain Drops */}
          <div className="rain-container absolute inset-0">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="raindrop bg-blue-300 absolute w-[1.5px] h-6 rounded-full"
                style={{
                  left: `${(i * 2.8) % 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animation: `fall ${0.6 + Math.random() * 0.5}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          {type === 'thunderstorm' && (
            <div className="absolute inset-0 bg-blue-100/10 animate-pulse" style={{ animationDuration: '3s' }} />
          )}
        </div>
      );
    }

    if (type === 'cloudy') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
          <div className="absolute -top-10 -left-20 w-80 h-40 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-20 right-0 w-96 h-48 bg-slate-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
      );
    }

    if (type === 'clear') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
          <div className="absolute top-6 right-10 w-48 h-48 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
      );
    }

    if (type === 'fog') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 bg-gradient-to-b from-slate-600/30 to-transparent backdrop-blur-xs" />
      );
    }

    return null;
  };

  const getConditionIcon = (type?: string) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 animate-bounce" />;
      case 'thunderstorm':
        return <CloudLightning className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 animate-pulse" />;
      case 'clear':
        return <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />;
      case 'fog':
        return <Wind className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300" />;
      default:
        return <CloudSun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-300" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & Live City Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>लाइव मौसम पूर्वानुमान व अलर्ट 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              वास्तविक मौसम, तापमान एवं बारिश चेतावनी
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              भारत के किसी भी शहर, जिले या गांव का नाम खोजें और तुरंत सटीक लाइव मौसम देखें।
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="शहर या जिला दर्ज करें (उदा: Patna, Delhi, Gaya)..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>खोजें</span>
            </button>
          </form>
        </div>

        {/* Quick City Selector Badges */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-[11px] text-slate-400 font-bold uppercase mr-1">त्वरित शहर:</span>
          {[
            { key: 'patna', name: 'पटना (Patna)' },
            { key: 'delhi', name: 'दिल्ली (Delhi)' },
            { key: 'lucknow', name: 'लखनऊ (Lucknow)' },
            { key: 'varanasi', name: 'वाराणसी (Varanasi)' },
            { key: 'jaipur', name: 'जयपुर (Jaipur)' },
            { key: 'indore', name: 'इंदौर (Indore)' },
            { key: 'mumbai', name: 'मुंबई (Mumbai)' },
            { key: 'kolkata', name: 'कोलकाता (Kolkata)' },
            { key: 'ranchi', name: 'राँची (Ranchi)' },
            { key: 'gaya', name: 'गया (Gaya)' },
            { key: 'muzaffarpur', name: 'मुजफ्फरपुर' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleQuickCity(item.key, item.name)}
              className="px-3 py-1 bg-slate-950/80 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 rounded-full text-xs font-semibold transition cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Live Weather Card with Real Visual Effects */}
      {weather && (
        <div className="space-y-6">
          {/* Active Alert Banner if exists */}
          {weather.alert && (
            <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center gap-4 text-amber-300 shadow-xl animate-pulse">
              <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-white">मौसम विभाग आधिकारिक चेतावनी (Weather Advisory):</h4>
                <p className="text-xs sm:text-sm font-medium mt-0.5">{weather.alert}</p>
              </div>
            </div>
          )}

          {/* Central Hero Weather Display Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Visual Effect (Rain / Thunder / Clouds / Sun) */}
            {renderWeatherVisualEffect()}

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Temp & Condition */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
                      {weather.city}
                      <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                        {weather.state || 'भारत (India)'}
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">
                      ✓ लाइव सैटेलाइट डेटा (अपडेटेड प्रति घंटे)
                    </p>
                  </div>
                </div>

                {/* Big Temperature Display */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="text-6xl sm:text-8xl font-mono font-black text-white tracking-tighter">
                    {weather.temp}°<span className="text-2xl sm:text-3xl text-amber-400 font-sans">C</span>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-amber-300">
                      {weather.condition}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 mt-1">
                      एहसास (Feels like): <strong className="text-white">{weather.feelsLike}°C</strong>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      न्यूनतम: <span className="text-sky-400 font-bold">{weather.minTemp}°C</span> | अधिकतम: <span className="text-rose-400 font-bold">{weather.maxTemp}°C</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-400">मौसम विवरण: </span>
                  {weather.descriptionHi}
                </div>
              </div>

              {/* Right Column: Visual Icon & Key Gauges */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-center py-2">
                  {getConditionIcon(weather.weatherType)}
                </div>

                {/* Micro Metric Grid */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">नमी (Humidity)</span>
                      <strong className="text-sm text-white font-bold">{weather.humidity}%</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                    <Wind className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">हवा की गति</span>
                      <strong className="text-sm text-white font-bold">{weather.windSpeed} km/h</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                    <Sun className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">UV इंडेक्स</span>
                      <strong className="text-sm text-white font-bold">{weather.uvIndex} (मध्यम)</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">वायु गुणवत्ता (AQI)</span>
                      <strong className={`text-xs font-bold ${weather.aqi > 150 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {weather.aqi} • {weather.aqiStatus}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Sunrise / Sunset Row */}
                <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/40 rounded-xl text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-400" />
                    <span>सूर्योदय: <strong>{weather.sunrise}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    <span>सूर्यास्त: <strong>{weather.sunset}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Hourly Forecast Slider */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>आज के अगले घंटों का पूर्वानुमान (Hourly Forecast):</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {weather.hourly.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-center transition ${
                    idx === 0
                      ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 font-bold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200'
                  }`}
                >
                  <span className="text-xs text-slate-400 block mb-1">{h.time}</span>
                  <div className="text-xl font-bold font-mono my-1">{h.temp}°C</div>
                  <div className="text-[11px] text-sky-400 font-medium flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{h.rainProb}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 7-Day Extended Forecast Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>आगामी 7 दिनों का विस्तृत मौसम (7-Day Forecast):</span>
            </h4>

            <div className="divide-y divide-slate-800">
              {weather.daily.map((dayItem, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 px-3 rounded-xl transition">
                  <div className="flex items-center gap-4 w-44">
                    <span className="text-sm font-bold text-white">{dayItem.day}</span>
                    <span className="text-xs text-slate-500">{dayItem.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 font-medium">{dayItem.condition}</span>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-sm">
                    <span className="text-slate-400 text-xs">न्यूनतम: <strong className="text-sky-400 font-bold">{dayItem.tempMin}°C</strong></span>
                    <span className="text-slate-400 text-xs">अधिकतम: <strong className="text-rose-400 font-bold">{dayItem.tempMax}°C</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weather CSS Styles */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(350px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}
