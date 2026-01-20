import React, { createContext, useState, useContext, useCallback } from 'react';

interface SpeechContextType {
    speak: (navLinksText?: string) => void;
    isSpeaking: boolean;
    stop: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const speak = useCallback((navLinksText?: string) => {
        if ('speechSynthesis' in window) {
            stop();

            // 1. DYNAMIC SCAN: Grab the text content of the <main> element
            const mainElement = document.querySelector('main');
            const pageText = mainElement 
                ? mainElement.innerText.replace(/\s+/g, ' ').trim().slice(0, 2000) 
                : "";

            // 2. BUILD TEXT: Only add nav links if provided (otherwise skip to content)
            const introductoryText = navLinksText ? `${navLinksText}. ` : "";
            const fullText = `${introductoryText}${pageText}`;

            if (!fullText.trim()) return;

            const utterance = new SpeechSynthesisUtterance(fullText);
            
            // 3. LANGUAGE SYNC: Match the voice to Google Translate selection
            const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            const currentLang = googleSelect?.value || 'en';
            utterance.lang = currentLang === 'fr' ? 'fr-FR' : 'en-US';

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    return (
        <SpeechContext.Provider value={{ speak, isSpeaking, stop }}>
            {children}
        </SpeechContext.Provider>
    );
};

export const useSpeech = () => {
    const context = useContext(SpeechContext);
    if (!context) throw new Error("useSpeech must be used within a SpeechProvider");
    return context;
};