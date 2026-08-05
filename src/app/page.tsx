import { Hero } from "@/components/sections/Hero";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { CurrentlyBuilding } from "@/components/sections/CurrentlyBuilding";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Showcase3D } from "@/components/sections/Showcase3D";
import { DesignWork } from "@/components/sections/DesignWork";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <CurrentlyBuilding />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Showcase3D />
      <DesignWork />
      <Certifications />
      <Contact />
    </>
  );
}
