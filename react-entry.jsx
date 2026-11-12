import React from "react";
import { createRoot } from "react-dom/client";

function ReactTechnology() {
    return "React";
}

const mountPoint = document.getElementById("react-root");

if (!mountPoint) {
    throw new Error("No se encontró el elemento para montar React.");
}

createRoot(mountPoint).render(<ReactTechnology />);
