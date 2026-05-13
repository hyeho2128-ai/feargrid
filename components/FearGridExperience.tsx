"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DotNavigation } from "@/components/DotNavigation";
import { EndingSection } from "@/components/EndingSection";
import { HeroSection } from "@/components/HeroSection";
import { JourneyScene } from "@/components/JourneyScene";
import { journeyScenes } from "@/constants/journey";

export function FearGridExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.45, 0.32]);

  useEffect(() => {
    const sections = journeyScenes
      .map((scene, index) => ({ element: document.getElementById(scene.id), index }))
      .filter((entry): entry is { element: HTMLElement; index: number } => Boolean(entry.element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const index = sections.find((section) => section.element === visible.target)?.index;
        if (typeof index === "number") {
          setActiveIndex(index);
        }
      },
      { threshold: [0.28, 0.45, 0.62] }
    );

    sections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let locked = false;
    const sectionIds = ["hero", ...journeyScenes.map((scene) => scene.id), "ending"];

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 12 || locked) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const viewportTop = window.scrollY;
      const currentIndex =
        viewportTop < window.innerHeight * 0.65
          ? 0
          : sectionIds.reduce((closestIndex, id, index) => {
              const element = document.getElementById(id);
              if (!element) {
                return closestIndex;
              }

              const closestElement = document.getElementById(sectionIds[closestIndex]);
              const currentDistance = Math.abs(element.offsetTop - viewportTop);
              const closestDistance = closestElement ? Math.abs(closestElement.offsetTop - viewportTop) : Infinity;
              return currentDistance < closestDistance ? index : closestIndex;
            }, 0);

      if (
        sectionIds[currentIndex] === "hero" &&
        event.deltaY > 0 &&
        document.documentElement.dataset.heroIntro !== "revealed"
      ) {
        window.dispatchEvent(new Event("feargrid:reveal-hero"));
        document.getElementById("hero")?.scrollIntoView({ behavior: "auto", block: "start" });
        locked = true;
        window.setTimeout(() => {
          locked = false;
        }, 1050);
        return;
      }

      const nextIndex = Math.max(0, Math.min(sectionIds.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)));
      document.getElementById(sectionIds[nextIndex])?.scrollIntoView({ behavior: "smooth", block: "start" });

      locked = true;
      window.setTimeout(() => {
        locked = false;
      }, 950);
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", handleWheel, { capture: true });
  }, []);

  return (
    <main className="snap-y relative min-h-screen overflow-x-hidden bg-[#020306] text-white">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.82)_100%)]"
        style={{ opacity: vignetteOpacity }}
      />
      <HeroSection />
      <DotNavigation activeIndex={activeIndex} scenes={journeyScenes} />
      {journeyScenes.map((scene, index) => (
        <JourneyScene data={scene} key={scene.id} order={index} />
      ))}
      <EndingSection />
    </main>
  );
}
