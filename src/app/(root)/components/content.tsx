"use client";

import { useModalStore } from "@/hooks/store/use-modal";
import { useEffect } from "react";

export const SetupPageContent = () => {
  const { onOpen, isOpen } = useModalStore();

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return null;
};
