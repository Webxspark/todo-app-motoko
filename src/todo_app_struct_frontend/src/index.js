// import { todo_app_struct_backend } from "../../declarations/todo_app_struct_backend";

import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from "./components/app";
import './index.css';

// Render your React component instead
const root = createRoot(document.querySelector('main'));

root.render(<App />);