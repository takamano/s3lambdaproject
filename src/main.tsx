import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';



Amplify.configure(outputs);

// console.log("Environment Value Check:")
// console.log(import.meta.env)

// console.log("Environment Check:")
// console.log(Amplify.getConfig())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
