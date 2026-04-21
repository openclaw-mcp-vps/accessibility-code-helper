"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemData[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className="rounded-lg border border-[#2a3c56] bg-[#121b2b]">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-4 text-left"
              onClick={() => setOpenId(isOpen ? "" : item.id)}
            >
              <span className="font-medium text-[#edf4ff]">{item.title}</span>
              <ChevronDown className={cn("h-4 w-4 text-[#9fb1cc] transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen ? <p className="px-4 pb-4 text-sm text-[#9fb1cc]">{item.content}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
