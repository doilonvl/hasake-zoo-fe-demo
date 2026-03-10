"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/client";
import { contactInquiriesApi } from "@/lib/api/client";
import { ApiError } from "@/lib/api/client";
import type {
  CreateContactInquiryDTO,
  InquiryType,
} from "@/types/api";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContactInquiryFormProps {
  inquiryType?: InquiryType;
  relatedId?: string;
  relatedModel?: "Service" | "Product" | "Project";
  locale: string;
}

export function ContactInquiryForm({
  inquiryType = "general",
  relatedId,
  relatedModel,
  locale,
}: ContactInquiryFormProps) {
  const { t } = useTranslation("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateContactInquiryDTO>({
    inquiryType,
    relatedId,
    relatedModel,
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    subject: "",
    message: "",
    locale,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      // Include honeypot field in submission
      const form = e.currentTarget;
      const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;

      await contactInquiriesApi.create({
        ...formData,
        ...(honeypot ? { website: honeypot } : {}),
      });
      toast.success(t("successTitle"), {
        description: t("successDesc"),
      });

      // Reset form
      setFormData({
        inquiryType,
        relatedId,
        relatedModel,
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        subject: "",
        message: "",
        locale,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        // Rate limit exceeded
        if (error.status === 429) {
          toast.error(t("rateLimitTitle"), {
            description: t("rateLimitDesc"),
          });
          return;
        }

        // Validation errors — show per-field messages
        if (error.status === 400 && error.errors?.length) {
          const mapped: Record<string, string> = {};
          for (const err of error.errors) {
            mapped[err.field] = err.message;
          }
          setFieldErrors(mapped);
          toast.error(t("validationErrorTitle"), {
            description: t("validationErrorDesc"),
          });
          return;
        }
      }

      console.error("Contact inquiry error:", error);
      toast.error(t("errorTitle"), {
        description: t("errorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400${
      fieldErrors[field] ? " border-red-400" : ""
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field — hidden from real users, traps bots */}
      <input
        type="text"
        name="website"
        defaultValue=""
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      />

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white" suppressHydrationWarning>
          {t("nameLabel")} <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("namePlaceholder")}
          required
          className={inputClass("name")}
          suppressHydrationWarning
        />
        {fieldErrors.name && (
          <p className="text-red-400 text-sm">{fieldErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white" suppressHydrationWarning>
          {t("emailLabel")} <span className="text-red-400">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
          required
          className={inputClass("email")}
          suppressHydrationWarning
        />
        {fieldErrors.email && (
          <p className="text-red-400 text-sm">{fieldErrors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white" suppressHydrationWarning>
          {t("phoneLabel")}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("phonePlaceholder")}
          className={inputClass("phone")}
          suppressHydrationWarning
        />
        {fieldErrors.phone && (
          <p className="text-red-400 text-sm">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-white" suppressHydrationWarning>
          {t("companyLabel")}
        </Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder={t("companyPlaceholder")}
          className={inputClass("company")}
          suppressHydrationWarning
        />
        {fieldErrors.company && (
          <p className="text-red-400 text-sm">{fieldErrors.company}</p>
        )}
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-white" suppressHydrationWarning>
          {t("countryLabel")} <span className="text-red-400">*</span>
        </Label>
        <RadixSelect.Root
          value={formData.country}
          onValueChange={(val) => {
            setFormData((prev) => ({ ...prev, country: val }));
            if (fieldErrors.country) {
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.country;
                return next;
              });
            }
          }}
          required
        >
          <RadixSelect.Trigger
            id="country"
            className={`flex w-full h-10 items-center justify-between rounded-md border bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 data-[placeholder]:text-white/50 ${
              fieldErrors.country ? "border-red-400" : "border-white/20"
            }`}
          >
            <RadixSelect.Value placeholder={locale === "en" ? "Select country\u2026" : "Ch\u1ECDn qu\u1ED1c gia\u2026"} />
            <RadixSelect.Icon>
              <ChevronDown className="w-4 h-4 text-white/50" />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>

          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={4}
              className="z-[200] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/50"
            >
              <RadixSelect.ScrollUpButton className="flex items-center justify-center py-1 text-white/40 hover:text-white/70 bg-slate-900">
                <ChevronDown className="w-4 h-4 rotate-180" />
              </RadixSelect.ScrollUpButton>

              <RadixSelect.Viewport
                className="p-1 overflow-y-auto"
                style={{ maxHeight: "240px" }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {[
                  { label: "Southeast Asia", options: ["Vietnam","Thailand","Indonesia","Malaysia","Singapore","Philippines","Myanmar","Cambodia","Laos","Brunei","Timor-Leste"] },
                  { label: "East Asia", options: ["China","Japan","South Korea","Taiwan","Hong Kong","Mongolia"] },
                  { label: "South Asia", options: ["India","Pakistan","Bangladesh","Sri Lanka","Nepal"] },
                  { label: "Middle East", options: ["UAE","Saudi Arabia","Qatar","Kuwait","Bahrain","Oman","Jordan"] },
                  { label: "Europe", options: ["United Kingdom","Germany","France","Netherlands","Belgium","Switzerland","Spain","Italy","Poland","Czech Republic","Sweden","Norway","Denmark","Finland","Austria","Portugal","Russia"] },
                  { label: "Americas", options: ["United States","Canada","Mexico","Brazil","Argentina","Colombia","Chile","Peru"] },
                  { label: "Africa & Oceania", options: ["Australia","New Zealand","South Africa","Kenya","Tanzania","Egypt","Morocco"] },
                ].map((group) => (
                  <RadixSelect.Group key={group.label}>
                    <RadixSelect.Label className="px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-400/70">
                      {group.label}
                    </RadixSelect.Label>
                    {group.options.map((country) => (
                      <RadixSelect.Item
                        key={country}
                        value={country}
                        className="relative flex items-center gap-2 px-3 py-2 text-sm text-white/80 rounded-lg cursor-pointer select-none outline-none hover:bg-white/8 hover:text-white focus:bg-white/8 focus:text-white data-[state=checked]:text-emerald-400 data-[state=checked]:bg-emerald-500/10"
                      >
                        <RadixSelect.ItemText>{country}</RadixSelect.ItemText>
                        <RadixSelect.ItemIndicator className="ml-auto">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </RadixSelect.ItemIndicator>
                      </RadixSelect.Item>
                    ))}
                  </RadixSelect.Group>
                ))}
              </RadixSelect.Viewport>

              <RadixSelect.ScrollDownButton className="flex items-center justify-center py-1 text-white/40 hover:text-white/70 bg-slate-900">
                <ChevronDown className="w-4 h-4" />
              </RadixSelect.ScrollDownButton>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        {fieldErrors.country && (
          <p className="text-red-400 text-sm">{fieldErrors.country}</p>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-white" suppressHydrationWarning>
          {t("subjectLabel")} <span className="text-red-400">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t("subjectPlaceholder")}
          required
          className={inputClass("subject")}
          suppressHydrationWarning
        />
        {fieldErrors.subject && (
          <p className="text-red-400 text-sm">{fieldErrors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-white" suppressHydrationWarning>
          {t("messageLabel")} <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          required
          rows={6}
          className={`${inputClass("message")} resize-none`}
          suppressHydrationWarning
        />
        {fieldErrors.message && (
          <p className="text-red-400 text-sm">{fieldErrors.message}</p>
        )}
      </div>

      {/* Privacy Notice */}
      <p className="text-white/60 text-sm" suppressHydrationWarning>
        {t("privacy")}
      </p>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg"
        suppressHydrationWarning
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
