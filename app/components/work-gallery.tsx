"use client";

import { PortfolioBook } from "./portfolio-book";

export function WorkGallery() {
  return <main><PortfolioBook /></main>;
}

export function SelectedWork() {
  return <div id="selected-work"><PortfolioBook embedded /></div>;
}
