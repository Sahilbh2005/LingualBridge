import * as React from 'react';
import * as OceanTheme from 'linguasetu-theme-ocean';
import * as ForestTheme from 'linguasetu-theme-forest';
import * as SunsetTheme from 'linguasetu-theme-sunset';
import * as CyberpunkTheme from 'linguasetu-theme-cyberpunk';
import * as MidnightTheme from 'linguasetu-theme-midnight';
import * as NebulaTheme from 'linguasetu-theme-nebula';
// New Light Themes
import * as LavenderTheme from 'linguasetu-theme-lavender';
import * as MintTheme from 'linguasetu-theme-mint';
import * as RoseTheme from 'linguasetu-theme-rose';
import * as LemonTheme from 'linguasetu-theme-lemon';
import * as SandTheme from 'linguasetu-theme-sand';
// New Dark Themes
import * as AbyssTheme from 'linguasetu-theme-abyss';
import * as VolcanoTheme from 'linguasetu-theme-volcano';
import * as ToxicTheme from 'linguasetu-theme-toxic';
import * as SolarTheme from 'linguasetu-theme-solar';
import * as RoyalTheme from 'linguasetu-theme-royal';

export const ThemeContext = React.createContext();

const themes = [
    // Original & Previous
    { id: 'ocean', ...OceanTheme },
    { id: 'forest', ...ForestTheme },
    { id: 'sunset', ...SunsetTheme },
    { id: 'cyberpunk', ...CyberpunkTheme },
    { id: 'midnight', ...MidnightTheme },
    { id: 'nebula', ...NebulaTheme },
    // New Light
    { id: 'lavender', ...LavenderTheme },
    { id: 'mint', ...MintTheme },
    { id: 'rose', ...RoseTheme },
    { id: 'lemon', ...LemonTheme },
    { id: 'sand', ...SandTheme },
    // New Dark
    { id: 'abyss', ...AbyssTheme },
    { id: 'volcano', ...VolcanoTheme },
    { id: 'toxic', ...ToxicTheme },
    { id: 'solar', ...SolarTheme },
    { id: 'royal', ...RoyalTheme },
];

export const ThemeProvider = ({ children }) => {
    // Default to the first theme or load from local storage
    const [currentTheme, setCurrentTheme] = React.useState(() => {
        const savedThemeId = localStorage.getItem('linguasetu-theme');
        return themes.find(t => t.id === savedThemeId) || themes[0];
    });

    const applyTheme = (theme) => {
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        // Also set a data-theme attribute for potential specific CSS
        root.setAttribute('data-theme', theme.type);
    };

    React.useEffect(() => {
        if (currentTheme) {
            applyTheme(currentTheme);
            localStorage.setItem('linguasetu-theme', currentTheme.id);
        }
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ 
            currentTheme, 
            setCurrentTheme, 
            themes,
            applyTheme // Exposed for previewing
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => React.useContext(ThemeContext);
