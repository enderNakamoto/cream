"use client";

import React, { useState, useEffect } from "react";

const COMPLAINTS = [
  "Why the fuck did you rewrite the whole file when I just asked for one line?!",
  "Stop creating five functions that all do the same goddamn thing.",
  "I swear to god, you broke the only part of the app that was working.",
  "Who the hell told you to touch my database schema?!",
  "No! Don't rename my variables in the middle of debugging, you asshole.",
  "Why are you optimizing shit that doesn't even run yet?!",
  "Stop inventing APIs that don't fucking exist.",
  "I asked for a bug fix, not a full rewrite in another language.",
  "Holy shit, you just pushed broken code straight into main.",
  "Why the fuck are there three different main() functions now?!",
  "Goddammit, that was a config file — now nothing fucking compiles.",
  "How did you manage to make the bug worse?!",
  "For fuck's sake, stop reformatting everything when I'm trying to read it.",
  "Why the fuck is there a new dependency I never asked for?",
  "No one asked for a fucking logging framework, just print the variable.",
  "Jesus Christ, stop deleting files I actually need.",
  "This is the fourth time you've duplicated that utility function — are you kidding me?!",
  "Goddamn it, now we have circular imports because of your bullshit.",
  "Why the fuck is there a blockchain library in my todo app?",
  "Stop making shit up — just fix the fucking bug!"
];

export default function TypewriterComplaints() {
  const [currentComplaintIndex, setCurrentComplaintIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("TypewriterComplaints component mounted");
  }, []);

  useEffect(() => {
    const complaint = COMPLAINTS[currentComplaintIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= complaint.length) {
        setCurrentText(complaint.slice(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
        
        // Wait before moving to next complaint
        setTimeout(() => {
          setCurrentComplaintIndex((prev) => (prev + 1) % COMPLAINTS.length);
          setCurrentText("");
          setIsTyping(true);
        }, 4000);
      }
    }, 100); // Slower typing speed

    return () => clearInterval(typeInterval);
  }, [currentComplaintIndex]);

  return (
    <div className="text-center max-w-4xl mx-auto h-24 flex items-center justify-center">
      <p className="text-muted-foreground font-mono text-lg leading-relaxed">
        {currentText}
        {isTyping && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
} 