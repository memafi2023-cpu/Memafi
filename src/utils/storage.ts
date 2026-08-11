import { CustomTriviaPack, MatchHistoryItem, Team } from '../types';

const MATCH_HISTORY_KEY = 'triviamind_match_history';
const CUSTOM_PACKS_KEY = 'triviamind_custom_packs';
const SAVED_TEAMS_KEY = 'triviamind_saved_teams';

export function getMatchHistory(): MatchHistoryItem[] {
  try {
    const raw = localStorage.getItem(MATCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMatchHistory(item: Omit<MatchHistoryItem, 'id' | 'date'>): MatchHistoryItem {
  const history = getMatchHistory();
  const newItem: MatchHistoryItem = {
    ...item,
    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
  };
  const updated = [newItem, ...history].slice(0, 30); // Keep last 30
  try {
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }
  return newItem;
}

export function getCustomPacks(): CustomTriviaPack[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPack(pack: Omit<CustomTriviaPack, 'id' | 'createdAt'>): CustomTriviaPack {
  const packs = getCustomPacks();
  const newPack: CustomTriviaPack = {
    ...pack,
    id: `pack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newPack, ...packs];
  try {
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return newPack;
}

export function deleteCustomPack(packId: string): CustomTriviaPack[] {
  const packs = getCustomPacks().filter(p => p.id !== packId);
  try {
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
  } catch {
    // Ignore
  }
  return packs;
}

export function getSavedTeams(): Team[] {
  try {
    const raw = localStorage.getItem(SAVED_TEAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTeamsPreset(teams: Team[]): void {
  try {
    localStorage.setItem(SAVED_TEAMS_KEY, JSON.stringify(teams));
  } catch {
    // Ignore
  }
}
