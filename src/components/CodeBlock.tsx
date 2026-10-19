type TokenKind = "comment" | "string" | "decorator" | "keyword" | "type" | "number";

const KEYWORDS = [
  "async",
  "await",
  "class",
  "const",
  "constructor",
  "export",
  "extends",
  "false",
  "function",
  "get",
  "if",
  "import",
  "interface",
  "let",
  "new",
  "null",
  "private",
  "readonly",
  "return",
  "static",
  "super",
  "this",
  "true",
  "type",
  "typeof",
  "undefined",
  "void",
];

const PATTERN = new RegExp(
  [
    String.raw`(?<comment>\/\/[^\n]*)`,
    String.raw`(?<string>"[^"\n]*"|'[^'\n]*'|\`[^\`]*\`)`,
    String.raw`(?<decorator>@[A-Za-z]\w*)`,
    String.raw`(?<keyword>\b(?:${KEYWORDS.join("|")})\b)`,
    String.raw`(?<type>\b[A-Z]\w*\b)`,
    String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
  ].join("|"),
  "g",
);

type Token = {
  text: string;
  kind?: TokenKind;
};

/**
 * Deliberately naive: enough to make keywords, strings, and comments stand out in a
 * slide, without pulling in a real grammar. Tokens become elements rather than HTML,
 * so nothing is ever injected as markup.
 */
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(PATTERN)) {
    const start = match.index;
    if (start > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, start) });
    }

    const kind = Object.entries(match.groups ?? {}).find(([, value]) => value !== undefined)?.[0];
    tokens.push({ text: match[0], kind: kind as TokenKind });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex) });
  }

  return tokens;
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre>
      <code>
        {tokenize(code).map((token, index) =>
          token.kind === undefined ? (
            token.text
          ) : (
            <span key={index} className={`token token--${token.kind}`}>
              {token.text}
            </span>
          ),
        )}
      </code>
    </pre>
  );
}
