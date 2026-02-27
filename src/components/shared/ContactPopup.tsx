"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslation } from "@/i18n/client";
import { contactInquiriesApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContactPopupContextType {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
}

const ContactPopupContext = createContext<ContactPopupContextType | null>(null);

export function useContactPopup() {
  const context = useContext(ContactPopupContext);
  if (!context) {
    throw new Error("useContactPopup must be used within ContactPopupProvider");
  }
  return context;
}

// Country list for Southeast Asia and common regions
const COUNTRIES = [
  { code: "VN", vi: "Việt Nam", en: "Vietnam" },
  { code: "TH", vi: "Thái Lan", en: "Thailand" },
  { code: "MY", vi: "Malaysia", en: "Malaysia" },
  { code: "SG", vi: "Singapore", en: "Singapore" },
  { code: "ID", vi: "Indonesia", en: "Indonesia" },
  { code: "PH", vi: "Philippines", en: "Philippines" },
  { code: "MM", vi: "Myanmar", en: "Myanmar" },
  { code: "KH", vi: "Campuchia", en: "Cambodia" },
  { code: "LA", vi: "Lào", en: "Laos" },
  { code: "IN", vi: "Ấn Độ", en: "India" },
  { code: "CN", vi: "Trung Quốc", en: "China" },
  { code: "JP", vi: "Nhật Bản", en: "Japan" },
  { code: "KR", vi: "Hàn Quốc", en: "South Korea" },
  { code: "AU", vi: "Úc", en: "Australia" },
  { code: "US", vi: "Hoa Kỳ", en: "United States" },
  { code: "GB", vi: "Anh", en: "United Kingdom" },
  { code: "DE", vi: "Đức", en: "Germany" },
  { code: "FR", vi: "Pháp", en: "France" },
  { code: "OTHER", vi: "Khác", en: "Other" },
];

interface ContactPopupProviderProps {
  children: ReactNode;
}

export function ContactPopupProvider({ children }: ContactPopupProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const { t } = useTranslation("contact");

  const openPopup = useCallback(() => setIsOpen(true), []);
  const closePopup = useCallback(() => setIsOpen(false), []);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "VN",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactInquiriesApi.create({
        ...formData,
        inquiryType: "general",
        locale,
      });
      toast.success(t("successTitle"), {
        description: t("successDesc"),
      });
      // Reset form and close popup
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "VN",
        subject: "",
        message: "",
      });
      closePopup();
    } catch (error) {
      console.error("Contact inquiry error:", error);
      toast.error(t("errorTitle"), {
        description: t("errorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-black/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold">
                      {locale === "vi" ? "Liên Hệ Nhanh" : "Quick Contact"}
                    </h2>
                    <p className="text-white/60 text-xs">
                      {locale === "vi"
                        ? "Chúng tôi sẽ phản hồi trong 24h"
                        : "We'll respond within 24h"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePopup}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form with hidden scrollbar */}
              <div className="max-h-[calc(80vh-80px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-name"
                        className="text-white/80 text-sm"
                      >
                        {t("nameLabel")}{" "}
                        <span className="text-emerald-400">*</span>
                      </Label>
                      <Input
                        id="popup-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("namePlaceholder")}
                        required
                        className="h-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-email"
                        className="text-white/80 text-sm"
                      >
                        {t("emailLabel")}{" "}
                        <span className="text-emerald-400">*</span>
                      </Label>
                      <Input
                        id="popup-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("emailPlaceholder")}
                        required
                        className="h-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-phone"
                        className="text-white/80 text-sm"
                      >
                        {t("phoneLabel")}
                      </Label>
                      <Input
                        id="popup-phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("phonePlaceholder")}
                        className="h-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-company"
                        className="text-white/80 text-sm"
                      >
                        {t("companyLabel")}
                      </Label>
                      <Input
                        id="popup-company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={t("companyPlaceholder")}
                        className="h-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Row 3: Country & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-country"
                        className="text-white/80 text-sm"
                      >
                        {t("countryLabel")}{" "}
                        <span className="text-emerald-400">*</span>
                      </Label>
                      <select
                        id="popup-country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/20 text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors text-sm"
                      >
                        {COUNTRIES.map((country) => (
                          <option
                            key={country.code}
                            value={country.code}
                            className="bg-white text-white"
                          >
                            {locale === "vi" ? country.vi : country.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="popup-subject"
                        className="text-white/80 text-sm"
                      >
                        {t("subjectLabel")}{" "}
                        <span className="text-emerald-400">*</span>
                      </Label>
                      <Input
                        id="popup-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t("subjectPlaceholder")}
                        required
                        className="h-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="popup-message"
                      className="text-white/80 text-sm"
                    >
                      {t("messageLabel")}{" "}
                      <span className="text-emerald-400">*</span>
                    </Label>
                    <Textarea
                      id="popup-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("messagePlaceholder")}
                      required
                      rows={3}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 resize-none"
                    />
                  </div>

                  {/* Privacy & Submit */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <p className="text-white/50 text-xs max-w-xs">
                      {t("privacy")}
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-600/20"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          {t("submitting")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          {t("submit")}
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ContactPopupContext.Provider>
  );
}
