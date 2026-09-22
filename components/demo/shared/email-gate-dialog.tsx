"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { submitIntake } from "@/lib/intake/actions";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const intakeFormSchema = z
  .object({
    email: z.email("Enter a valid email to continue."),
    domain: z.string(),
    noWebsite: z.boolean(),
    companyName: z.string(),
    companyDescription: z.string(),
    useSampleData: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.useSampleData) return;

    if (!data.noWebsite) {
      if (!data.domain.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["domain"],
          message: "Enter your company's domain.",
        });
      }
      return;
    }

    if (!data.companyName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["companyName"],
        message: "Enter your company name.",
      });
    }
    if (!data.companyDescription.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["companyDescription"],
        message: "Tell us what you do.",
      });
    }
  });

type IntakeFormValues = z.infer<typeof intakeFormSchema>;

export default function EmailGateDialog() {
  const [open, setOpen] = useState(true);
  const [validated, setValidated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      email: "",
      domain: "",
      noWebsite: false,
      companyName: "",
      companyDescription: "",
      useSampleData: false,
    },
  });

  const noWebsite = useWatch({ control: form.control, name: "noWebsite" });
  const useSampleData = useWatch({
    control: form.control,
    name: "useSampleData",
  });

  function onSubmit(values: IntakeFormValues) {
    startTransition(async () => {
      const result = await submitIntake({
        email: values.email,
        domain: values.noWebsite ? undefined : values.domain,
        companyName: values.noWebsite ? values.companyName : undefined,
        companyDescription: values.noWebsite
          ? values.companyDescription
          : undefined,
        useSampleData: values.useSampleData,
      });

      if (!result.ok) {
        form.setError("root", {
          message: result.error ?? "Something went wrong. Try again.",
        });
        return;
      }

      setValidated(true);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Block dismissal until the email has been validated.
        if (!next && !validated) return;
        setOpen(next);
      }}
    >
      <DialogContent
        className="sm:max-w-2xl bg-background p-8"
        showCloseButton={validated}
        onEscapeKeyDown={(event) => {
          if (!validated) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (!validated) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-5xl font-black font-sans">
            See it in action
          </DialogTitle>
          <DialogDescription className="text-2xl">
            Share a bit about you and your company to continue.
          </DialogDescription>
        </DialogHeader>

        {validated ? (
          <p className="text-sm text-muted-foreground">
            Thanks — close this to continue exploring the demo.
          </p>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Work email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {!useSampleData && (
                <>
                  <Controller
                    name="domain"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="domain">Company domain</FieldLabel>
                        <Input
                          {...field}
                          id="domain"
                          disabled={noWebsite}
                          placeholder="yourcompany.com"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Collapsible
                    open={noWebsite}
                    onOpenChange={(next) => form.setValue("noWebsite", next)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="self-start text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      >
                        {noWebsite
                          ? "I have a website"
                          : "Don't have a website?"}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <FieldGroup className="pt-4">
                        <Controller
                          name="companyName"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="companyName">
                                Company name
                              </FieldLabel>
                              <Input
                                {...field}
                                id="companyName"
                                placeholder="Acme Robotics"
                                aria-invalid={fieldState.invalid}
                              />
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )}
                        />
                        <Controller
                          name="companyDescription"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="companyDescription">
                                What do you do?
                              </FieldLabel>
                              <Textarea
                                {...field}
                                id="companyDescription"
                                placeholder="We build autonomous warehouse robots for 3PLs."
                                rows={2}
                                aria-invalid={fieldState.invalid}
                              />
                              <FieldDescription>
                                Since we can&apos;t scrape a site, this feeds
                                the demo instead.
                              </FieldDescription>
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => form.setValue("useSampleData", true)}
                          className="self-start text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                        >
                          Or just use sample data instead
                        </button>
                      </FieldGroup>
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}

              {useSampleData && (
                <div className="flex items-center justify-between rounded-2xl border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
                  <span>Using sample company data.</span>
                  <button
                    type="button"
                    onClick={() => form.setValue("useSampleData", false)}
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Undo
                  </button>
                </div>
              )}
            </FieldGroup>

            <FieldError errors={[form.formState.errors.root]} />

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="self-start"
            >
              {isPending ? "Continuing…" : "Continue"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
