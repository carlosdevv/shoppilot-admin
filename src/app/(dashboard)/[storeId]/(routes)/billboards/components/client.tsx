"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

export const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Banner de destaque (0)"
          description="Administre os banners das páginas."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Icons.plus className="w-4 h-4 mr-2" />
          Novo
        </Button>
      </div>
      <Separator />
    </>
  );
};
