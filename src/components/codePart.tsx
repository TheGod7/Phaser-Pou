import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
    code: string;
    name: string;
};

const codePart = (props: Props) => {
    return (
        <div className="bg-gray-950/30 rounded-2xl">
            <header className="text-xl font-bold px-5  w-full bg-gray-700/40 rounded-t-2xl py-3">
                {props.name}
            </header>
            <section className="mt-5 p-4 select-text">
                <SyntaxHighlighter
                    language="typescript"
                    style={atomOneDark}
                    showLineNumbers={true}
                    customStyle={{
                        background: "transparent",
                        padding: "1rem",
                        fontSize: "1.1rem",
                        borderRadius: "1rem",
                    }}
                >
                    {props.code}
                </SyntaxHighlighter>
            </section>
        </div>
    );
};

export default codePart;
