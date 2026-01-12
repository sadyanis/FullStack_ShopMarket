import axios, { AxiosError, AxiosResponse } from 'axios';
// IMPORT L'INTERFACE TOAST ICI
import { Toast } from '../types'; 

const http = axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
        'Content-type': 'application/json',
    },
});

// Utilisez le type Toast ici au lieu de le réécrire
let toastFunction: (toast: Toast) => void;

export const injectToast = (fn: (toast: Toast) => void) => {
    toastFunction = fn;
};

http.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        let message = "Une erreur inconnue est survenue";
        // On type explicitement severity avec les valeurs autorisées par Toast
        let severity: Toast['severity'] = 'error'; 

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as any;

            if (data && data.message) {
                message = data.message;
            }

            if (status === 400) {
                severity = 'error'; // ou 'warning' si vous préférez pour les erreurs utilisateur
            } else if (status === 404) {
                message = "Ressource introuvable.";
                severity = 'warning';
            } else if (status === 500) {
                message = "Erreur interne du serveur.";
            }
        } else if (error.request) {
            message = "Impossible de contacter le serveur.";
        }

        if (toastFunction) {
            // Maintenant les types correspondent parfaitement
            toastFunction({ severity, message });
        }

        return Promise.reject(error);
    }
);

export default http;