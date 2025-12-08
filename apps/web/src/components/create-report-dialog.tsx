"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const reportSchema = z.object({
  format: z.enum(["PDF", "XLSX"], {
    message: "Selecione o formato do relatório",
  }),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateReportDialog({
  open,
  onOpenChange,
}: CreateReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      format: "PDF",
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Gerando relatório no formato:", data.format);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Criar Relatório
          </DialogTitle>
          <DialogDescription>
            Escolha o formato do relatório que deseja gerar
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Formato</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PDF" id="pdf" />
                        <Label htmlFor="pdf" className="cursor-pointer">
                          PDF
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="XLSX" id="xlsx" />
                        <Label htmlFor="xlsx" className="cursor-pointer">
                          XLSX
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-br from-[#549d8c] to-[#2e6669] cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Gerando..." : "Gerar relatório"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
