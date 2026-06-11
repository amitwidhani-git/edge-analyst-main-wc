"use client";
import { useEffect } from "react";

export function useCursor() {
  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    document.body.style.cursor = "none";
    const cur  = document.getElementById("ea-cur");
    const dot  = document.getElementById("ea-dot");
    const ring = document.getElementById("ea-ring");
    if (!cur || !dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, rafId;

    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      let dark = true;
      for (const s of document.querySelectorAll("[data-theme]")) {
        const { top, bottom } = s.getBoundingClientRect();
        if (e.clientY >= top && e.clientY < bottom) { dark = s.dataset.theme === "dark"; break; }
      }
      dot.style.background   = dark ? "#F7F5F0" : "#080808";
      ring.style.borderColor = dark ? "rgba(247,245,240,.55)" : "rgba(8,8,8,.55)";
    };

    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      cur.style.left = mx + "px"; cur.style.top = my + "px";
      ring.style.left = (rx - mx) + "px"; ring.style.top = (ry - my) + "px";
      rafId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);

    const add = () => document.body.classList.add("lp-hovering");
    const rem = () => document.body.classList.remove("lp-hovering");
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter", add);
      el.addEventListener("mouseleave", rem);
    });

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);
}

// Cursor HTML to include at top of every page
export const CursorEl = () => (
  <div id="ea-cur" style={{ position:"fixed", zIndex:9998, pointerEvents:"none", top:0, left:0 }} aria-hidden="true">
    <div id="ea-ring" style={{ width:36, height:36, border:"1.5px solid rgba(247,245,240,.55)", borderRadius:"50%", position:"absolute", transform:"translate(-50%,-50%)", transition:"width .2s,height .2s,border-color .2s" }} />
    <div id="ea-dot"  style={{ width:6, height:6, background:"#F7F5F0", borderRadius:"50%", position:"absolute", transform:"translate(-50%,-50%)", transition:"transform .08s,background .2s" }} />
  </div>
);
