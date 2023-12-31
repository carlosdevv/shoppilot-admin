"use client";

import { Icons } from "@/components/icons";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type SettingsFormProps = {
  initialData: Store;
};

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const { toast } = useToast();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { mutateAsync: deleteStore, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return api.delete(`/api/stores/${params.storeId}`);
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
      toast({
        title: "Success",
        description: "Store is deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while deleting your store.",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: updateStore, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return api.patch(`/api/stores/${params.storeId}`, data);
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Success",
        description: "Store is updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while updating your store.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    await updateStore(values);
  };

  const onDeleteStore = async () => {
    try {
      await deleteStore();
    } catch (error) {
      toast({
        title: "Attention",
        description:
          "Make sure you don't have any billboards before deleting your store.",
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
        onConfirm={() => onDeleteStore()}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your store settings."
        />
        <Button
          disabled={isPending}
          variant="destructive"
          size="icon"
          onClick={() => setIsAlertModalOpen(true)}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Store name"
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
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
