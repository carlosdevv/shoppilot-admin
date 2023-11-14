"use client";

import { useModalStore } from "@/hooks/store/use-modal";
import React from "react";
import { Modal } from "@/components/ui/modal";

export const SetupModal = () => {
  const { isOpen, onClose } = useModalStore();
  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories."
      isOpen={isOpen}
      onClose={onClose}
    >
      Future create form
    </Modal>
  );
};
