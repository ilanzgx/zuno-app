"use client";

import { useState, useMemo } from "react";
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
  FormDescription,
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
import { getStockDataByDate } from "@/resources/market/market.service";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [priceDate, setPriceDate] = useState<string | null>(null);
  const [priceResult, setPriceResult] = useState<number | null>(null);
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

  const price = form.watch("price");
  const quantity = form.watch("quantity");

  const totalValue = useMemo(() => {
    const numPrice = Number(price) || 0;
    const numQuantity = Number(quantity) || 0;
    return numPrice * numQuantity;
  }, [price, quantity]);

  const handleNextStep = async () => {
    const step1Valid = await form.trigger([
      "assetType",
      "type",
      "date",
      "ticker",
    ]);

    if (!step1Valid) {
      return;
    }

    const ticker = form.getValues("ticker");
    const date = form.getValues("date");

    if (!ticker || !date) {
      return;
    }

    setIsFetchingPrice(true);
    try {
      const [year, month, day] = date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const stockData = await getStockDataByDate(ticker, formattedDate);

      if (stockData && stockData.close) {
        const roundedPrice = Math.round(stockData.close * 100) / 100;
        form.setValue("price", roundedPrice);
        setPriceResult(roundedPrice);
        setPriceDate(formattedDate);

        // Só avança para o passo 2 se encontrou dados válidos
        setStep(2);
      } else {
        toast.error(
          `Ativo ${ticker} não encontrado ou sem dados para ${formattedDate}. Verifique o ticker e a data.`
        );
        setPriceDate(null);
        setPriceResult(null);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
      toast.error(
        "Erro ao buscar dados do ativo. Verifique o ticker e tente novamente."
      );
      setPriceDate(null);
      setPriceResult(null);
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

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
          setStep(1);
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

  const handleDialogChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setStep(1);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
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
            <div>
              <DialogHeader>
                <DialogTitle>Cadastrar Transação</DialogTitle>
                <DialogDescription>
                  Passo {step} de 2 -{" "}
                  {step === 1 ? "Informações básicas" : "Valores"}
                </DialogDescription>
              </DialogHeader>

              {/* Progress indicator */}
              <div className="flex gap-2 mt-4">
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= 2 ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 200,
                        }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="assetType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo do Ativo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
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

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Transação</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
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

                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data da Transação</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ticker"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticker do Ativo</FormLabel>
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

                        <div className="flex justify-end gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogChange(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="button" onClick={handleNextStep}>
                            Próximo
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 200,
                        }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                                  disabled={isFetchingPrice}
                                />
                              </FormControl>
                              {isFetchingPrice && (
                                <FormDescription className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Buscando preço...
                                </FormDescription>
                              )}
                              {!isFetchingPrice && priceDate && priceResult && (
                                <FormDescription className="text-muted-foreground text-xs">
                                  Preço de R$ {priceResult.toFixed(2)} em{" "}
                                  {priceDate}
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Total Value Display */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="p-4 bg-muted rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              Valor Total:
                            </span>
                            <span className="text-xl font-bold">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(totalValue)}
                            </span>
                          </div>
                        </motion.div>

                        <div className="flex justify-between gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePreviousStep}
                            disabled={isSubmitting}
                          >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
