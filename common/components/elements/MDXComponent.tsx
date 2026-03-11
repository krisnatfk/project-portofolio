import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { ReactNode } from "react";

import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  children: string;
  repoSlug?: string;
}

interface TableProps {
  children?: ReactNode;
}

const Table = (props: TableProps & React.HTMLProps<HTMLTableElement>) => (
  <div className="table-container overflow-auto">
    <table className="table w-full" {...props}>
      {props.children}
    </table>
  </div>
);

const MDXComponent = ({ children, repoSlug }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: (props) => (
          <a
            className="cursor-pointer text-teal-600 hover:text-teal-400 hover:underline"
            target="_blank"
            {...props}
          />
        ),
        p: (props) => <div {...props} className="font-sans" />,
        h2: (props) => (
          <h2
            className="font-sans text-xl font-medium dark:text-neutral-300"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="pt-4 text-[18px] font-medium leading-snug dark:text-neutral-300"
            {...props}
          />
        ),
        ul: (props) => (
          <ul className="list-disc space-y-3 pb-5 pl-10 font-sans" {...props} />
        ),
        ol: (props) => (
          <ol
            className="list-decimal space-y-3 pb-5 pl-10 font-sans"
            {...props}
          />
        ),
        code: (props) => <CodeBlock {...props} />,
        blockquote: (props) => (
          <blockquote
            className="text-md rounded-lg border-l-[5px] border-neutral-700 border-l-cyan-500 bg-neutral-100 py-3 pl-6 text-cyan-800 dark:bg-neutral-800 dark:text-cyan-200"
            {...props}
          />
        ),
        table: (props) => <Table {...props} />,
        th: ({ children, ...rest }) => (
          <th
            className="border px-3 py-1 text-left dark:border-neutral-600"
            {...rest}
          >
            {children}
          </th>
        ),
        td: ({ children, ...rest }) => (
          <td className="border px-3 py-1 dark:border-neutral-600" {...rest}>
            {children}
          </td>
        ),
        img: (props) => {
          let src = props.src;
          if (src && !src.startsWith("http") && repoSlug) {
            src = `https://raw.githubusercontent.com/krisnatfk/${repoSlug}/main/${src}`;
          }
          return (
            <img
              src={src}
              alt={props.alt || "image"}
              className="rounded-lg object-contain w-full my-4"
              loading="lazy"
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default MDXComponent;
