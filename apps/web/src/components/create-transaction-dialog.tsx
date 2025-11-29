"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTransaction } from "@/resources/transaction/transaction.service";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { Transaction } from "@/resources/transaction/transaction.entity";

const transactionSchema = z.object({
  assetType: z.enum(["STOCK", "FII", "BDR"], {
    message: "Selecione o tipo de ativo",
  }),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["BUY", "SELL"], {
    message: "Selecione o tipo de transação",
  }),
  ticker: z
    .string()
    .min(1, "Ticker é obrigatório")
    .transform((val) => val.toUpperCase()),
  price: z.coerce
    .number()
    .positive("Preço deve ser maior que zero")
    .min(0.01, "Preço mínimo é R$ 0,01"),
  quantity: z.coerce
    .number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser maior que zero"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const user = useUserStore((state) => state.user);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormData>,
    defaultValues: {
      assetType: "STOCK",
      date: "",
      type: "BUY",
      ticker: "",
      price: 0,
      quantity: 0,
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    if (!user?.id) {
      toast.error("Usuário não autenticado. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction: Transaction = {
        ...data,
        date: new Date(data.date),
        userId: user.id,
        createdAt: new Date(),
      };

      const result = await createTransaction(transaction);

      if (result) {
        setShowSuccess(true);
        toast.success("Transação cadastrada com sucesso!");

        setTimeout(() => {
          setShowSuccess(false);
          form.reset();
          onOpenChange(false);
        }, 1500);
      } else {
        toast.error("Erro ao cadastrar transação. Tente novamente.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Erro ao cadastrar transação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4"
              >
                <Check className="w-10 h-10 text-green-600 dark:text-green-500" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-green-600 dark:text-green-500"
              >
                Transação cadastrada!
              </motion.h3>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Cadastrar Transação</DialogTitle>
                <DialogDescription>
                  Preencha os dados da transação que deseja cadastrar.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name="assetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo do Ativo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="STOCK">Ação</SelectItem>
                              <SelectItem value="FII">
                                Fundo Imobiliário
                              </SelectItem>
                              <SelectItem value="BDR">BDR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo da Transação</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BUY">Compra</SelectItem>
                              <SelectItem value="SELL">Venda</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name="ticker"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticker</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: PETR4"
                                {...field}
                                className="uppercase"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-end gap-3 pt-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
