import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * The root HTMLElement used as the base for other DOM operations and manipulations.
 * This element is typically the container where the application gets mounted or the primary
 * section of the web page.
 *
 * @type {HTMLElement}
 * @default document.getElementById("root")
 */
const rootElement = document.getElementById("root");
/**
 * Represents the root of the React component tree.
 *
 * This variable is initialized using ReactDOM.createRoot, which sets up
 * the application to render a React component tree into the specified
 * DOM element.
 *
 * The root element is typically a div or other container element in
 * the HTML document where the React application will be mounted.
 *
 * Example:
 * ```
 * root = ReactDOM.createRoot(document.getElementById('app'));
 * ```
 *
 * @type {Root} The root instance that controls the React component tree.
 */
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);