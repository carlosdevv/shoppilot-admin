"use client";

import { useStoreModal } from "@/hooks/use-modal";
import { useEffect } from "react";

export const SetupPageContent = () => {
  const { onOpen, isOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return null;
};
