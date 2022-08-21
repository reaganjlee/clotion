import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import EditablePage from './editablePage';

const rootElement = ReactDOM.createRoot(document.getElementById('root'));
rootElement.render(

  <>
  <h1 className="Logo">reagan's notion clone</h1>
    <p className="Intro">
      Helloo{" "}
      <span role="img" aria-label="greetings" className="Emoji">
        👋
      </span>{" "}
      You can add content below. Type <span className="Code">/</span> to see
      available elements.
    </p>
    <EditablePage />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
