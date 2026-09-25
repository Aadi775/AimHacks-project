'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { City } from '@/types';
import { fetchCities } from '@/lib/cities';

interface CityContextValue {
  city: City | null;
  cities: City[];
  setCity: (c: City) => void;
  addCityToList: (c: City) => void;
  loading: boolean;
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
}

const CityContext = createContext<CityContextValue>({
  city: null,
  cities: [],
  setCity: () => {},
  addCityToList: () => {},
  loading: true,
  selectedArea: null,
  setSelectedArea: () => {},
});

const STORAGE_KEY = 'civicpulse-city';

export function CityProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCityState] = useState<City | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities()
      .then((list) => {
        setCities(list);
        let initial = list.find((c) => c.is_default) ?? list[0] ?? null;
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as City;
            const match = list.find((c) => c.name.toLowerCase() === (parsed.name ?? '').toLowerCase());
            if (match) initial = match;
          }
        } catch {
          /* corrupted storage — fall back to default */
        }
        setCityState(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const setCity = (c: City) => {
    setCityState(c);
    setSelectedArea(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* storage unavailable */
    }
  };

  const addCityToList = (c: City) => {
    setCities((prev) => (prev.some((x) => x.name === c.name) ? prev : [...prev, c]));
    setCity(c);
  };

  return (
    <CityContext.Provider value={{ city, cities, setCity, addCityToList, loading, selectedArea, setSelectedArea }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => useContext(CityContext);
