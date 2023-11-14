"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { useModalStore } from "@/hooks/store/use-modal";
import api from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(1, "Informe o nome da store."),
});

export const SetupModal = () => {
  const { isOpen, onClose } = useModalStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: createStore, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return api.post("/api/stores", values);
    },
    onSuccess: (response) => {
      window.location.assign(`/${response.data.id}`); // This will completely refresh the page to get the new store.
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar sua store.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createStore(values);
  };

  return (
    <Modal
      title="Criar Store"
      description="Adicione uma nova store para gerenciar seus produtos."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="E-commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isPending}
                  variant={"outline"}
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button disabled={isPending} type="submit">
                  {isPending && (
                    <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
