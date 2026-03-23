import type { ReactNode } from "react";
import type { Locale } from "@/types/content";
import type { TocItem } from "@/types/blog";
import { normalizeTocIds } from "@/lib/blogs";

export type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  tag?: string;
  level?: number;
  src?: string;
  url?: string;
  altText?: string;
  caption?: unknown;
  alignment?: string;
  size?: string;
  format?: number | string;
  direction?: string | null;
  indent?: number;
  version?: number;
  listType?: string;
  language?: string;
  // Video properties
  videoSource?: "youtube" | "vimeo" | "direct";
  title?: string;
  // Layout properties
  templateColumns?: string;
};

export type LexicalDoc = {
  root?: LexicalNode;
  children?: LexicalNode[];
};

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0110\u0111]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractPlainTextFromLexical(node: LexicalNode | null): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }
  const children = node.children || [];
  return children.map((child) => extractPlainTextFromLexical(child)).join(" ");
}

function getAlignmentClass(format?: number | string) {
  if (typeof format !== "string") return "";
  if (format === "center") return "text-center";
  if (format === "right") return "text-right";
  if (format === "justify") return "text-justify";
  return "";
}

function getTextFormatClass(format?: number | string) {
  if (!format) return "";
  if (typeof format === "string") {
    return format;
  }
  const classes: string[] = [];
  if (format & 1) classes.push("font-semibold");
  if (format & 2) classes.push("italic");
  if (format & 4) classes.push("underline");
  if (format & 8) classes.push("line-through");
  if (format & 16)
    classes.push("rounded bg-muted px-1 py-0.5 font-mono text-xs");
  return classes.join(" ");
}

export function extractHeadingsFromLexical(doc: LexicalDoc): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();

  function walk(node: LexicalNode) {
    if (node.type === "heading") {
      const level =
        typeof node.level === "number"
          ? node.level
          : node.tag === "h1"
          ? 1
          : node.tag === "h3"
          ? 3
          : 2;
      if (level === 2 || level === 3) {
        const text = extractPlainTextFromLexical(node).trim();
        if (text) {
          const base = slugifyHeading(text) || "section";
          const count = (used.get(base) || 0) + 1;
          used.set(base, count);
          const id = count === 1 ? base : `${base}-${count}`;
          items.push({ id, text, level });
        }
      }
    }
    (node.children || []).forEach(walk);
  }

  const roots = doc?.root?.children || doc?.children || [];
  roots.forEach(walk);
  return items;
}

type LexicalContentRendererProps = {
  doc: LexicalDoc | null | undefined;
  toc?: TocItem[];
  locale: Locale;
};

export default function LexicalContentRenderer({
  doc,
  toc,
  locale: _locale,
}: LexicalContentRendererProps) {
  if (!doc) return null;

  const resolvedToc = toc?.length
    ? normalizeTocIds(toc)
    : extractHeadingsFromLexical(doc);

  const usedIds = new Map<string, number>();

  const ensureUniqueId = (id: string) => {
    const count = (usedIds.get(id) || 0) + 1;
    usedIds.set(id, count);
    return count === 1 ? id : `${id}-${count}`;
  };

  type RenderResult = {
    element: ReactNode;
    nextHeadingIndex: number;
  };

  const renderNodes = (
    children: LexicalNode[] | undefined,
    headingIndex: number
  ) => {
    let current = headingIndex;
    const elements = (children || []).map((child, index) => {
      const result = renderNode(child, index, current);
      current = result.nextHeadingIndex;
      return result.element;
    });
    return { elements, nextHeadingIndex: current };
  };

  const renderNode = (
    node: LexicalNode,
    key: number,
    headingIndex: number
  ): RenderResult => {
    switch (node.type) {
      case "root": {
        const result = renderNodes(node.children, headingIndex);
        return {
          element: <div key={key}>{result.elements}</div>,
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "heading": {
        const level =
          typeof node.level === "number"
            ? node.level
            : node.tag === "h1"
            ? 1
            : node.tag === "h3"
            ? 3
            : 2;
        const Tag = level === 1 ? "h1" : level === 3 ? "h3" : "h2";
        const headingClassName =
          level === 1
            ? "mt-8 mb-4 text-3xl font-bold"
            : level === 2
            ? "mt-10 mb-4 text-2xl font-bold text-emerald-600 border-b border-gray-200 pb-2"
            : "mt-7 mb-3 text-xl font-semibold text-gray-900 border-l-2 border-emerald-500/60 pl-3";
        const text = extractPlainTextFromLexical(node).trim();
        const shouldTrack = level === 2 || level === 3;
        const tocItem = shouldTrack ? resolvedToc[headingIndex] : undefined;
        const fallbackId = slugifyHeading(text) || "section";
        const id = ensureUniqueId(tocItem?.id || fallbackId);
        const alignmentClass = getAlignmentClass(node.format);
        const nextIndex = shouldTrack ? headingIndex + 1 : headingIndex;
        const result = renderNodes(node.children, nextIndex);
        const headingIndentStyle = node.indent ? { paddingLeft: `${node.indent * 40}px` } : undefined;
        return {
          element: (
            <Tag
              key={key}
              id={id}
              className={
                [
                  "scroll-mt-24",
                  headingClassName,
                  alignmentClass || "",
                ].join(" ")
              }
              style={headingIndentStyle}
            >
              {result.elements}
            </Tag>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "paragraph": {
        // Skip paragraphs with no children or only linebreak children (empty lines)
        const hasRealContent = node.children?.some((c) => c.type !== "linebreak");
        if (!hasRealContent) {
          return { element: null, nextHeadingIndex: headingIndex };
        }
        const alignmentClass = getAlignmentClass(node.format);
        const result = renderNodes(node.children, headingIndex);
        // Không render <p> hoàn toàn trống
        if (result.elements.every((el) => el === null)) {
          return { element: null, nextHeadingIndex: result.nextHeadingIndex };
        }
        // Always use <div> to avoid invalid nesting — unknown node types render as <div>
        // (e.g. paragraph inside paragraph, or any unrecognized block type)
        const Tag = "div";
        const indentStyle = node.indent ? { paddingLeft: `${node.indent * 40}px` } : undefined;
        const paragraphClass = ["mb-4 leading-relaxed", alignmentClass || ""].filter(Boolean).join(" ");
        return {
          element: (
            <Tag key={key} className={paragraphClass} style={indentStyle}>
              {result.elements}
            </Tag>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "text":
        return {
          element: (
            <span
              key={key}
              className={getTextFormatClass(node.format) || undefined}
            >
              {node.text}
            </span>
          ),
          nextHeadingIndex: headingIndex,
        };
      case "linebreak":
        return { element: <br key={key} />, nextHeadingIndex: headingIndex };
      case "quote": {
        const result = renderNodes(node.children, headingIndex);
        const quoteIndentStyle = node.indent ? { marginLeft: `${node.indent * 40}px` } : undefined;
        return {
          element: (
            <blockquote
              key={key}
              className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600"
              style={quoteIndentStyle}
            >
              {result.elements}
            </blockquote>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "list": {
        const isOrdered =
          node.listType === "number" ||
          node.listType === "ordered" ||
          node.tag === "ol";
        const Tag = isOrdered ? "ol" : "ul";
        const result = renderNodes(node.children, headingIndex);
        const listIndentStyle = node.indent ? { paddingLeft: `${node.indent * 40}px` } : undefined;
        return {
          element: (
            <Tag
              key={key}
              className={
                isOrdered ? "my-3 ml-6 list-decimal" : "my-3 ml-6 list-disc"
              }
              style={listIndentStyle}
            >
              {result.elements}
            </Tag>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "listitem": {
        const result = renderNodes(node.children, headingIndex);
        return {
          element: (
            <li key={key} className="my-1">
              {result.elements}
            </li>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "code": {
        const codeText = extractPlainTextFromLexical(node);
        return {
          element: (
            <pre
              key={key}
              className="my-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800"
            >
              <code>{codeText}</code>
            </pre>
          ),
          nextHeadingIndex: headingIndex,
        };
      }
      case "table": {
        // Skip tables with no text content — tablecell always returns <td> so
        // the elements.every(null) check never fires; use text content instead.
        if (!extractPlainTextFromLexical(node).trim()) {
          return { element: null, nextHeadingIndex: headingIndex };
        }
        const result = renderNodes(node.children, headingIndex);
        return {
          element: (
            <table
              key={key}
              className="my-4 w-full border-collapse overflow-hidden rounded-lg border text-sm"
            >
              <tbody>{result.elements}</tbody>
            </table>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "tablerow": {
        const result = renderNodes(node.children, headingIndex);
        return {
          element: <tr key={key}>{result.elements}</tr>,
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "tablecell": {
        const result = renderNodes(node.children, headingIndex);
        return {
          element: (
            <td key={key} className="border px-3 py-2 align-top">
              {result.elements}
            </td>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "image": {
        const src = node.src || node.url;
        if (!src) {
          return { element: null, nextHeadingIndex: headingIndex };
        }
        const alt = node.altText || "";
        const alignment = (node.alignment || "full") as string;
        const size = (node.size || "full") as string;
        const sizeClass =
          size === "small"
            ? "md:w-1/3"
            : size === "medium"
            ? "md:w-1/2"
            : size === "large"
            ? "md:w-2/3"
            : "md:w-full";
        const alignmentClass =
          alignment === "left"
            ? "md:float-left md:mr-6"
            : alignment === "right"
            ? "md:float-right md:ml-6"
            : alignment === "center"
            ? "md:mx-auto"
            : "";
        const captionText =
          typeof node.caption === "string"
            ? node.caption
            : extractPlainTextFromLexical(node.caption as LexicalNode);
        const isFloat = alignment === "left" || alignment === "right";
        const figureClass = isFloat
          ? `my-4 ${sizeClass} ${alignmentClass}`
          : alignment === "center"
          ? `my-6 md:clear-both ${sizeClass} mx-auto`
          : `my-6 w-full md:clear-both`;
        return {
          element: (
            <figure
              key={key}
              className={`group ${figureClass}`}
              data-zoomable="true"
            >
              <div className="relative cursor-zoom-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="w-full rounded-2xl border object-cover"
                  loading="lazy"
                />
                {/* Zoom overlay on hover */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                  <div className="rounded-full bg-black/50 p-3 shadow-lg backdrop-blur-sm ring-1 ring-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              {captionText ? (
                <figcaption className="mt-2 text-center text-sm text-gray-500">
                  {captionText}
                </figcaption>
              ) : null}
            </figure>
          ),
          nextHeadingIndex: headingIndex,
        };
      }
      case "video": {
        const src = node.src || node.url;
        if (!src) {
          return { element: null, nextHeadingIndex: headingIndex };
        }
        const videoSource = node.videoSource || "direct";
        const title = node.title || "Video";
        const captionText =
          typeof node.caption === "string"
            ? node.caption
            : extractPlainTextFromLexical(node.caption as LexicalNode);

        // Get embed URL for YouTube/Vimeo
        const getVideoEmbedUrl = (url: string, source: string): string => {
          if (source === "youtube") {
            const patterns = [
              /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
              /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            ];
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
            }
          }
          if (source === "vimeo") {
            const patterns = [
              /vimeo\.com\/(\d+)/,
              /player\.vimeo\.com\/video\/(\d+)/,
            ];
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match) return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
            }
          }
          return url;
        };

        const embedUrl = getVideoEmbedUrl(src, videoSource);

        return {
          element: (
            <figure key={key} className="my-6 w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-gray-100">
                {videoSource === "direct" ? (
                  <video
                    src={src}
                    controls
                    className="h-full w-full object-contain"
                    title={title}
                    preload="metadata"
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={embedUrl}
                    title={title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
              {captionText ? (
                <figcaption className="mt-2 text-center text-sm text-gray-500">
                  {captionText}
                </figcaption>
              ) : null}
            </figure>
          ),
          nextHeadingIndex: headingIndex,
        };
      }
      case "layout-container": {
        const templateColumns = node.templateColumns || "1fr 1fr";
        const result = renderNodes(node.children, headingIndex);
        return {
          element: (
            <div
              key={key}
              style={{
                display: "grid",
                gridTemplateColumns: templateColumns,
                gap: "1.5rem",
                alignItems: "start",
              }}
              className="my-6"
            >
              {result.elements}
            </div>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      case "layout-item": {
        const result = renderNodes(node.children, headingIndex);
        return {
          element: (
            <div key={key} className="min-w-0">
              {result.elements}
            </div>
          ),
          nextHeadingIndex: result.nextHeadingIndex,
        };
      }
      default: {
        if (node.children?.length) {
          const result = renderNodes(node.children, headingIndex);
          return {
            element: <div key={key}>{result.elements}</div>,
            nextHeadingIndex: result.nextHeadingIndex,
          };
        }
        return { element: null, nextHeadingIndex: headingIndex };
      }
    }
  };

  const nodes = doc?.root?.children || doc?.children || [];
  const rendered = renderNodes(nodes, 0);
  return <>{rendered.elements}</>;
}
