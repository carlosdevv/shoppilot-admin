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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type ColorFormProps = {
  initialData: Color | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "Must be a valid hex code color" }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm = ({ initialData }: ColorFormProps) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData
    ? "Edit a color"
    : "Add a new color to your products.";
  const toastMessage = initialData
    ? "Color updated."
    : "Color created successfully";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { mutateAsync: deleteColor, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return api.delete(`/api/${params.storeId}/colors/${params.colorId}`);
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast({
        title: "Success",
        description: "Color deleted successfully.",
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

  const { mutateAsync: createOrUpdateColor, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      if (initialData) {
        return api.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      }

      return api.post(`/api/${params.storeId}/colors`, data);
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/colors`);
      router.refresh();
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

  const onSubmit = async (values: ColorFormValues) => {
    await createOrUpdateColor(values);
  };

  const onDeleteColor = async () => {
    try {
      await deleteColor();
    } catch (error) {
      toast({
        title: "Attention",
        description: "Make sure you deleted all products using this colors.",
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
        onConfirm={() => onDeleteColor()}
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
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isPending}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
