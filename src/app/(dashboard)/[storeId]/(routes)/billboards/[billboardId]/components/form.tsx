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
  const { toast } = useToast();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData
    ? "Edit a billboard"
    : "Add a new billboard to your store.";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created successfully";
  const action = initialData ? "Save changes" : "Create";

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
      router.push(`/${params.storeId}/billboards`);
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

  const { mutateAsync: createOrUpdateBillboard, isPending } = useMutation({
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
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Success",
        description: `${toastMessage}`,
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

  const onSubmit = async (values: BillboardFormValues) => {
    await createOrUpdateBillboard(values);
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
                <FormLabel>Billboard image</FormLabel>
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Label name"
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
    </>
  );
};
