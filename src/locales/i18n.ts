import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            settingsTitle: "Settings",
            showProfileName: "Show Profile Name in Label?",
            showTooltip: "Show Tooltip?",
            useReLogin: "Use Re-Login feature?",
            theme: "Theme:",
            save: "Save",
            valueError: "Value must be between 500 - 10000",
            saveSuccess: "Settings Saved",
            saveError: "The settings couldn't be saved",
            footerAbout: "About",
            inputLabelPlaceholder: "Label",
            inputUsernamePlaceholder: "Search by Username, Name, or Email",
            errorInvalidUser: "This is not a valid User",
            entrySavedMessage: "Entry saved",
            language: "Language",
            invalidURLHeader: "Invalid URL",
            invalidURLMessage: `This extension only works on Salesforce domains. 
                            Please navigate to a valid Salesforce domain.`,
        },
    },
    de: {
        translation: {
            settingsTitle: "Einstellungen",
            showProfileName: "Profilname im Label anzeigen?",
            showTooltip: "Tooltip anzeigen?",
            useReLogin: "Re-Login-Funktion verwenden?",
            theme: "Thema:",
            save: "Speichern",
            valueError: "Wert muss zwischen 500 und 10000 liegen",
            saveSuccess: "Einstellungen gespeichert",
            saveError: "Die Einstellungen konnten nicht gespeichert werden",
            footerAbout: "Über",
            inputLabelPlaceholder: "Label",
            inputUsernamePlaceholder: "Nach Benutzername, Name oder E-Mail suchen",
            errorInvalidUser: "Dies ist kein gültiger Benutzer",
            entrySavedMessage: "Eintrag gespeichert",
            language: "Sprache",
            invalidURLHeader: "Ungültige URL",
            invalidURLMessage: `Diese Erweiterung funktioniert nur auf Salesforce-Domains. 
                            Navigieren Sie zu einer gültigen Salesforce-Domain.`,
        },
    },
    es: {
        translation: {
            settingsTitle: "Configuración",
            showProfileName: "¿Mostrar el nombre del perfil en la etiqueta?",
            showTooltip: "¿Mostrar información emergente?",
            useReLogin: "¿Usar función de reingreso?",
            theme: "Tema:",
            save: "Guardar",
            valueError: "El valor debe estar entre 500 y 10000",
            saveSuccess: "Configuración guardada",
            saveError: "No se pudieron guardar los ajustes",
            footerAbout: "Acerca de",
            inputLabelPlaceholder: "Etiqueta",
            inputUsernamePlaceholder: "Buscar por nombre de usuario, nombre o correo electrónico",
            errorInvalidUser: "Este no es un usuario válido",
            entrySavedMessage: "Entrada guardada",
            language: "Idioma",
            invalidURLHeader: "URL no válida",
            invalidURLMessage: `Esta extensión solo funciona en dominios de Salesforce. 
                            Por favor, navegue a un dominio de Salesforce válido.`,

        },
    },
    fr: {
        translation: {
            settingsTitle: "Paramètres",
            showProfileName: "Afficher le nom du profil dans l'étiquette ?",
            showTooltip: "Afficher l'info-bulle ?",
            useReLogin: "Utiliser la fonction de reconnexion ?",
            theme: "Thème :",
            save: "Enregistrer",
            valueError: "La valeur doit être comprise entre 500 et 10000",
            saveSuccess: "Paramètres enregistrés",
            saveError: "Les paramètres n'ont pas pu être enregistrés",
            footerAbout: "À propos",
            inputLabelPlaceholder: "Étiquette",
            inputUsernamePlaceholder: "Rechercher par nom d'utilisateur, nom ou email",
            errorInvalidUser: "Ceci n'est pas un utilisateur valide",
            entrySavedMessage: "Entrée enregistrée",
            language: "Langue",
            invalidURLHeader: "URL non valide",
            invalidURLMessage: `Cette extension ne fonctionne que sur les domaines Salesforce. 
                            Veuillez naviguer vers un domaine Salesforce valide.`,
        },
    },
    it: {
        translation: {
            settingsTitle: "Impostazioni",
            showProfileName: "Mostrare il nome del profilo nell'etichetta?",
            showTooltip: "Mostrare il suggerimento?",
            useReLogin: "Usare la funzione di riaccesso?",
            theme: "Tema:",
            save: "Salva",
            valueError: "Il valore deve essere compreso tra 500 e 10000",
            saveSuccess: "Impostazioni salvate",
            saveError: "Impossibile salvare le impostazioni",
            footerAbout: "Informazioni",
            inputLabelPlaceholder: "Etichetta",
            inputUsernamePlaceholder: "Cerca per nome utente, nome o email",
            errorInvalidUser: "Questo non è un utente valido",
            entrySavedMessage: "Voce salvata",
            language: "Lingua",
            invalidURLHeader: "URL non valido",
            invalidURLMessage: `Questa estensione funziona solo sui domini Salesforce. 
                            Si prega di navigare su un dominio Salesforce valido.`,
        },
    },
    pt: {
        translation: {
            settingsTitle: "Configurações",
            showProfileName: "Mostrar o nome do perfil no rótulo?",
            showTooltip: "Mostrar dica?",
            useReLogin: "Usar função de re-login?",
            theme: "Tema:",
            save: "Salvar",
            valueError: "O valor deve estar entre 500 e 10000",
            saveSuccess: "Configurações salvas",
            saveError: "As configurações não puderam ser salvas",
            footerAbout: "Sobre",
            inputLabelPlaceholder: "Rótulo",
            inputUsernamePlaceholder: "Pesquisar por nome de usuário, nome ou email",
            errorInvalidUser: "Este não é um usuário válido",
            entrySavedMessage: "Entrada salva",
            language: "Idioma",
            invalidURLHeader: "URL inválida",
            invalidURLMessage: `Esta extensão só funciona em domínios Salesforce. 
                            Por favor, navegue para um domínio Salesforce válido.`,
        },
    },
    nl: {
        translation: {
            settingsTitle: "Instellingen",
            showProfileName: "Profielnaam weergeven in label?",
            showTooltip: "Tooltip weergeven?",
            useReLogin: "Herloginfunctie gebruiken?",
            theme: "Thema:",
            save: "Opslaan",
            valueError: "Waarde moet tussen 500 en 10000 liggen",
            saveSuccess: "Instellingen opgeslagen",
            saveError: "De instellingen konden niet worden opgeslagen",
            footerAbout: "Over",
            inputLabelPlaceholder: "Label",
            inputUsernamePlaceholder: "Zoeken op gebruikersnaam, naam of e-mail",
            errorInvalidUser: "Dit is geen geldige gebruiker",
            entrySavedMessage: "Invoer opgeslagen",
            language: "Taal",
            invalidURLHeader: "Ongeldige URL",
            invalidURLMessage: `Deze extensie werkt alleen op Salesforce-domeinen. 
                            Navigeer naar een geldig Salesforce-domein.`,
        },
    },
    pl: {
        translation: {
            settingsTitle: "Ustawienia",
            showProfileName: "Wyświetlać nazwę profilu na etykiecie?",
            showTooltip: "Wyświetlać podpowiedzi?",
            useReLogin: "Używać funkcji ponownego logowania?",
            theme: "Motyw:",
            save: "Zapisz",
            valueError: "Wartość musi mieścić się w przedziale od 500 do 10000",
            saveSuccess: "Ustawienia zapisane",
            saveError: "Nie udało się zapisać ustawień",
            footerAbout: "O aplikacji",
            inputLabelPlaceholder: "Etykieta",
            inputUsernamePlaceholder: "Szukaj według nazwy użytkownika, imienia lub emaila",
            errorInvalidUser: "To nie jest prawidłowy użytkownik",
            entrySavedMessage: "Wpis zapisany",
            language: "Język",
            invalidURLHeader: "Nieprawidłowy adres URL",
            invalidURLMessage: `To rozszerzenie działa tylko na domenach Salesforce. 
                            Przejdź do prawidłowej domeny Salesforce.`,
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;

