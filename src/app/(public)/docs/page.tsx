import fs from "fs";
import path from "path";
import parse from "html-react-parser";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  IDocumentationSection,
  IDocumentationSectionContent,
  IDocumentationSidebar,
} from "@/lib/types/Documentation";
import Image from "next/image";
import { DocumentationSidebar } from "@/components/DocumentationSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Certify",
  description: "Documentation for the application.",
};

export const dynamic = "force-static";

const DocsPage = async () => {
  const filePath = path.join(process.cwd(), "/public/Docs.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const documentationData: IDocumentationSection[] = JSON.parse(fileContents);

  const sideBar: IDocumentationSidebar[] = documentationData.flatMap((item) => {
    const result: IDocumentationSidebar[] = [
      { id: item.id, name: item.title, type: "heading" as const },
    ];

    const subheadings =
      item.content
        ?.filter((contentItem) => contentItem.type === "sub")
        .map((subItem) => ({
          id: subItem.id || "",
          name: subItem.title || "Untitled",
          type: "subheading" as const,
        })) || [];

    return [...result, ...subheadings];
  });

  if (!documentationData) return null;
  const renderListItem = (
    list: IDocumentationSectionContent["list"],
    level = 0,
  ) => {
    if (!list) return null;

    return list.map((item, idx) => (
      <div className="flex gap-3" key={`${item.title}-${idx}`}>
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
          {idx + 1}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-gray-900 text-sm font-semibold">{item.title}</p>

          {item.description && (
            <p
              className={cn(
                "text-gray-800 text-sm",
                item.list || item.span || item.image ? "mb-2" : "",
              )}
            >
              {parse(item.description, {
                replace: (domNode) => {
                  if (domNode.type === "tag") {
                    const { attribs } = domNode;
                    if (attribs?.class?.includes("target-class")) {
                      attribs.class = attribs.class.trim();
                    }
                  }
                },
              })}
            </p>
          )}

          {item.list && renderListItem(item.list, level + 1)}

          {item.span &&
            item.span.map((span, spanIdx) => (
              <div className="mt-4 mb-2" key={spanIdx}>
                <span
                  className={`bordered border-b-4 hover:border-b-1 border-black bg-${span.color} p-4 block rounded-md border  shadow-sm hover:shadow-md`}
                >
                  {span.description}
                </span>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white pb-20 px-4 md:px-20 lg:px-40">
      <Link
        href="#"
        className="rounded-full bg-yelloww p-3 right-6 bottom-6 fixed shadow-lg border border-black hover:bg-yellow-200 transition-all duration-300"
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </Link>

      <div className="flex mt-16 items-stretch">
        {/* Sidebar */}
        <DocumentationSidebar sideBar={sideBar} />
        {/* Main content */}
        <main className="flex-1 lg:pl-10  pl-2  ">
          {documentationData.map((item, index) => (
            <article
              key={index}
              id={item.id}
              data-section={item.id}
              className="mb-15"
            >
              <header>
                <div className="flex items-center gap-2 group">
                  <h1 className="font-bold text-3xl text-gray-900">
                    {item.title}
                  </h1>
                </div>
                <p className="my-3 text-lg text-gray-600 max-w-3xl">
                  {item.description}
                </p>
              </header>

              <div className="flex flex-col">
                {item.content &&
                  item.content.map((content, contentIdx) => {
                    return (
                      <div
                        key={contentIdx}
                        id={content.type === "sub" ? content.id : undefined}
                        data-section={
                          content.type === "sub" ? content.id : undefined
                        }
                        className={cn(
                          "flex flex-col gap-3",
                          content.type === "sub" ? "pl-9" : "",
                        )}
                      >
                        {content.type === "sub" && (
                          <hr className="border-b my-8 border-gray-200 w-full" />
                        )}
                        {content.title && (
                          <h2 className="font-bold text-xl text-gray-900">
                            {content.title}
                          </h2>
                        )}
                        <div
                          className={cn(
                            content.description ? "mt-0" : "mt-5",
                            "md:text-justify",
                          )}
                        >
                          {parse(content.description || "", {
                            replace: (domNode) => {
                              if (domNode.type === "tag") {
                                const { attribs } = domNode;

                                const targetClass =
                                  attribs?.class?.includes("target-class");

                                if (targetClass) {
                                  const existingClass = attribs.class || "";
                                  attribs.class = `${existingClass}`.trim();
                                }
                              }
                            },
                          })}
                        </div>
                        {content?.image && (
                          <div
                            className={cn(
                              content.image.length === 1
                                ? "justify-items-center"
                                : "grid grid-cols-2 md:grid-cols-3 gap-4 mt-5",
                            )}
                          >
                            {content.image.map((image, imageIdx) => {
                              return (
                                <div
                                  key={imageIdx}
                                  className="flex flex-col gap-2"
                                >
                                  <Image
                                    key={imageIdx}
                                    src={image.url}
                                    alt={image.alt}
                                    className={cn(
                                      image.className,
                                      image.bordered ? "bordered-nonhover" : "",
                                      "mx-auto md:mx-0",
                                    )}
                                    width={500}
                                    height={500}
                                  />
                                  {image.description && (
                                    <p className="text-xs md:text-sm text-gray-600 mt-2">
                                      {image.description}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {content?.list && renderListItem(content.list)}
                        {content.span &&
                          content.span.map((span, spanIdx) => {
                            return (
                              <div className="mt-4 mb-2" key={spanIdx}>
                                <span
                                  className={`bordered border-b-4 hover:border-b-1 border-black bg-${span.color} p-4 block rounded-md border  shadow-sm hover:shadow-md`}
                                >
                                  {span.description}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
              <hr className="border-b mt-16 border-gray-200 w-full" />
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
