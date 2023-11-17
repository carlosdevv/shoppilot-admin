"use client";

import { Icons } from "@/components/icons";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type BillboardFormProps = {
  initialData: Billboard | null;
};

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const { toast } = useToast();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const title = initialData ? "Editar banner" : "Criar banner";
  const description = initialData
    ? "Edite o banner de destaque"
    : "Adicione um novo banner de destaque";
  const toastMessage = initialData
    ? "Banner atualizado com sucesso."
    : "Banner criado com sucesso.";
  const action = initialData ? "Salvar alterações" : "Criar banner";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const { mutateAsync: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return api.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
    },
    onSuccess: () => {
      router.refresh();
      router.push("/");
      toast({
        title: "Sucesso",
        description: "Banner deletado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar seu banner.",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: createBillboard, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        return api.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      }

      return api.post(`/api/${params.storeId}/billboards`, data);
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Sucesso",
        description: `${toastMessage}`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    await createBillboard(values);
  };

  const onDeleteBillboard = async () => {
    try {
      await deleteBillboard();
    } catch (error) {
      toast({
        title: "Aviso",
        description:
          "Certifique-se que você deletou todas as categorias utilizando esse banner primeiro.",
      });
    } finally {
      setIsAlertModalOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isAlertModalOpen}
        loading={isDeleting}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={() => onDeleteBillboard()}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="icon"
            onClick={() => setIsAlertModalOpen(true)}
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem de fundo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Texto presente no banner"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {isPending && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
