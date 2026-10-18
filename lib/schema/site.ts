import { z } from "zod";
import { imageFile, phone, slug, text } from "./common";

const formLabels = z
  .object({
    name: z.string().default("Your name"),
    phone: z.string().default("Phone number"),
    date: z.string().default("Preferred date"),
    reason: z.string().default("Reason for visit"),
    reasonPlaceholder: z.string().default("Choose a reason"),
    required: z.string().default("Required"),
    submit: z.string().default("Request appointment"),
    submitting: z.string().default("Sending…"),
    successHeading: z.string().default("Almost done"),
    successWhatsapp: z
      .string()
      .default("Your request is ready. Tap the button to send it to the clinic on WhatsApp."),
    successEmail: z.string().default("Thank you. The clinic will call you to confirm."),
    openWhatsapp: z.string().default("Send on WhatsApp"),
    error: z.string().default("We could not send your request. Please call the clinic instead."),
    privacyNote: z
      .string()
      .default("Do not share medical records here. The doctor will discuss details with you in person."),
  })
  .prefault({});

/** Interface words. Every string has a default, so a client file can leave this block out. */
const ui = z
  .object({
    skipToContent: z.string().default("Skip to content"),
    mainNav: z.string().default("Main"),
    footerNav: z.string().default("Footer"),
    legalNav: z.string().default("Legal"),
    openMenu: z.string().default("Open menu"),
    closeMenu: z.string().default("Close menu"),
    bookAppointment: z.string().default("Book appointment"),
    callNow: z.string().default("Call now"),
    whatsapp: z.string().default("WhatsApp"),
    learnMore: z.string().default("Learn more"),
    allServices: z.string().default("See all services"),
    otherServices: z.string().default("Other services"),
    getDirections: z.string().default("Get directions"),
    mapTitle: z.string().default("Map showing the clinic location"),
    address: z.string().default("Address"),
    phone: z.string().default("Phone"),
    email: z.string().default("Email"),
    hours: z.string().default("Hours"),
    hospital: z.string().default("Hospital"),
    experience: z.string().default("Experience"),
    yearsSuffix: z.string().default("+ years"),
    focusAreas: z.string().default("Focus areas"),
    notFoundHeading: z.string().default("Page not found"),
    notFoundText: z.string().default("The page you asked for does not exist."),
    backHome: z.string().default("Back to home"),
    form: formLabels,
  })
  .prefault({});

export const siteSchema = z
  .object({
    slug,
    name: text,
    shortName: text.max(30, "must be 30 characters or fewer"),
    /** One or two letters shown in the round logo mark. */
    monogram: text.max(2, "must be 1 or 2 characters"),
    tagline: text,
    description: text.max(200, "must be 200 characters or fewer for search results"),
    url: z.url({ protocol: /^https$/, error: "must be the site's full https:// address" }),
    locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, "must be a language tag, like en-IN"),
    timezone: z.string().refine((tz) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    }, "must be an IANA time zone, like Asia/Kolkata"),
    contact: z.object({
      phone,
      phoneDisplay: text,
      whatsapp: phone.optional(),
      email: z.email("must be an email address").optional(),
      hospital: text,
      address: z.object({
        street: text,
        locality: text,
        city: text,
        region: text,
        postalCode: text,
        country: z.string().regex(/^[A-Z]{2}$/, "must be a 2-letter country code, like IN"),
      }),
      mapQuery: text,
      hours: z.array(z.object({ days: text, time: text })).default([]),
    }),
    booking: z.object({
      provider: z.enum(["whatsapp", "email"], { error: "must be whatsapp or email" }),
      reasons: z.array(text).min(1, "must list at least one reason"),
      messageTemplate: z
        .string()
        .default(
          "Hello {clinic}, I would like to book an appointment.\nName: {name}\nPhone: {phone}\nPreferred date: {date}\nReason: {reason}",
        ),
    }),
    images: z.object({
      favicon: imageFile,
      ogImage: imageFile,
    }),
    footer: z.object({
      blurb: text,
      copyright: text,
    }),
    ui,
  })
  .superRefine((site, ctx) => {
    if (site.booking.provider === "whatsapp" && !site.contact.whatsapp) {
      ctx.addIssue({
        code: "custom",
        path: ["contact", "whatsapp"],
        message: "is required when booking.provider is whatsapp",
      });
    }
  });

export type Site = z.infer<typeof siteSchema>;
export type UiLabels = Site["ui"];
