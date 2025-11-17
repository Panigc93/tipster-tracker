/**
 * @fileoverview Sport icons mapping
 * @module features/picks/utils/sport-icons
 */

export const sportIcons: Record<string, string> = {
  'Fútbol': '⚽',
  'Baloncesto': '🏀',
  'Tenis': '🎾',
  'Fútbol Americano': '🏈',
  'Hockey': '🏒',
  'Béisbol': '⚾',
  'Dardos': '🎯',
  'Caballos': '🐴',
  'Motor': '🏎️',
  'Esports': '🎮',
  'Fórmula 1': '🏁',
  'Golf': '⛳',
  'Rugby': '🏉',
  'Cricket': '🏏',
  'Tenis de mesa': '🏓',
  'Otro': '🎲'
};

export const getSportIcon = (sport: string): string => {
  return sportIcons[sport] || sportIcons['Otro'];
};
