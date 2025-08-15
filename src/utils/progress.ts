export interface GameProgress {
  completedLevels: boolean[];
  unlockedLevels: boolean[];
  lastPlayedLevel: number;
}

const PROGRESS_KEY = 'miniquads-progress';

export function getDefaultProgress(totalLevels: number): GameProgress {
  return {
    completedLevels: new Array(totalLevels).fill(false),
    unlockedLevels: [true, ...new Array(totalLevels - 1).fill(false)], // Only first level unlocked
    lastPlayedLevel: 0,
  };
}

export function loadProgress(totalLevels: number): GameProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) {
      return getDefaultProgress(totalLevels);
    }

    const progress: GameProgress = JSON.parse(stored);
    
    // Validate and fix progress data if needed
    if (!progress.completedLevels || progress.completedLevels.length !== totalLevels) {
      progress.completedLevels = new Array(totalLevels).fill(false);
    }
    
    if (!progress.unlockedLevels || progress.unlockedLevels.length !== totalLevels) {
      progress.unlockedLevels = [true, ...new Array(totalLevels - 1).fill(false)];
    }
    
    if (typeof progress.lastPlayedLevel !== 'number' || progress.lastPlayedLevel < 0) {
      progress.lastPlayedLevel = 0;
    }

    return progress;
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return getDefaultProgress(totalLevels);
  }
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
}

export function markLevelCompleted(
  progress: GameProgress,
  levelIndex: number
): GameProgress {
  const newProgress = { ...progress };
  
  // Mark level as completed
  newProgress.completedLevels = [...progress.completedLevels];
  newProgress.completedLevels[levelIndex] = true;
  
  // Unlock next level if it exists
  if (levelIndex + 1 < progress.unlockedLevels.length) {
    newProgress.unlockedLevels = [...progress.unlockedLevels];
    newProgress.unlockedLevels[levelIndex + 1] = true;
  }
  
  // Update last played level
  newProgress.lastPlayedLevel = levelIndex;
  
  return newProgress;
}

export function updateLastPlayedLevel(
  progress: GameProgress,
  levelIndex: number
): GameProgress {
  return {
    ...progress,
    lastPlayedLevel: levelIndex,
  };
}

export function resetProgress(totalLevels: number): GameProgress {
  const newProgress = getDefaultProgress(totalLevels);
  saveProgress(newProgress);
  return newProgress;
}

export function isLevelUnlocked(progress: GameProgress, levelIndex: number): boolean {
  return progress.unlockedLevels[levelIndex] || false;
}

export function isLevelCompleted(progress: GameProgress, levelIndex: number): boolean {
  return progress.completedLevels[levelIndex] || false;
}
