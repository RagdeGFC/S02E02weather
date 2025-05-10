import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

window.addEventListener('unhandledrejection', function (event) {
	event.preventDefault(); // Evita que el error se muestre en la consola
	// Para mostrar un mensaje personalizado, descomentar la siguiente línea:
	// console.warn('Error de promesa no capturada:', event.reason);
});

createRoot(document.getElementById('root')).render(
	// <StrictMode>
	<App />,
	// {/* </StrictMode>, */}
);
