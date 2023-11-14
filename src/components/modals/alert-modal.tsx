"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

type AlertModalProps = {
  isOpen: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Você tem certeza?"
      description="Essa ação não pode ser revertida."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant="outline" disabled={loading} onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" disabled={loading} onClick={onConfirm}>
          {loading && <Icons.loading className="mr-2 h-4 w-4 animate-spin" />}
          Apagar
        </Button>
      </div>
    </Modal>
  );
};
