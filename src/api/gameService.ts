import { Game } from '../types';

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch('https://n8n.alliasoft.com/webhook/konisgamesandmore/games', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: Game[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Unable to reach the API server. Please check your internet connection or try again later.');
    } else {
      console.error('Error fetching games:', error);
    }
    throw error; // Re-throw the error so the component can handle it appropriately
  }
};

export const fetchGamesByConsole = async (console: string): Promise<Game[]> => {
  try {
    const encodedConsole = encodeURIComponent(console);
    const response = await fetch(`https://n8n.alliasoft.com/webhook/konisgamesandmore/gamess?console=${encodedConsole}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: Game[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Unable to reach the API server. Please check your internet connection or try again later.');
    } else {
      console.error('Error fetching games by console:', error);
    }
    throw error;
  }
};