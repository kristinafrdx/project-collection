import React from 'react';
import { useLocation } from "react-router-dom";


const Collections = () => {
  const location = useLocation();

  const collections = location?.state || "Guest";
  console.log(collections)
  return (
  <div>
      <h1>Hello</h1>
  </div>
)
}

export default Collections;