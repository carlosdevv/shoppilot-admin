"use client";

import React, { useState } from "react";
import { BillboardColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AlertModal } from "@/components/modals/alert-modal";

type CellActionProps = {
  data: BillboardColumn;
};

export const CellAction = ({ data }: CellActionProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { mutateAsync: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return api.delete(
        `/api/${params.storeId}/billboards/${data.id}`
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Success",
        description: "Billboard deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copy",
      description: "Billboard Id copied to the clipboard.",
    });
  };

  const onDeleteBillboard = async () => {
    try {
      await deleteBillboard();
    } catch (error) {
      toast({
        title: "Attention",
        description:
          "Make sure you deleted all categories using this billboard.",
      });
    } finally {
      setIsAlertModalOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={onDeleteBillboard}
        loading={isDeleting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.spread className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Icons.copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Icons.edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAlertModalOpen(true)}>
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
