"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Copiado",
      description: "API Route copiado para a área de transferência.",
    });
  };

  return (
    <Alert>
      <Icons.server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Icons.copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
