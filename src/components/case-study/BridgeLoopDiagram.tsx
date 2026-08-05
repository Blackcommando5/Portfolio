/* The AE Prompt Bridge loop, drawn as the cycle it is.
 *
 * Server component. Colours come from theme tokens via fill-/stroke- utilities,
 * so it tracks light and dark without a second copy.
 */

const LABEL = "fill-current text-text-primary";
const SUB = "fill-current text-text-muted";
const EDGE = "stroke-border-glass";

function Node({
  x,
  y,
  w,
  title,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub?: string;
  accent?: "cyan" | "violet" | "green";
}) {
  const h = sub ? 50 : 36;
  const stroke =
    accent === "cyan"
      ? "stroke-accent-cyan/40"
      : accent === "violet"
        ? "stroke-accent-violet/40"
        : accent === "green"
          ? "stroke-accent-green/40"
          : "stroke-border-glass";
  const fill =
    accent === "cyan"
      ? "fill-accent-cyan/5"
      : accent === "violet"
        ? "fill-accent-violet/5"
        : accent === "green"
          ? "fill-accent-green/5"
          : "fill-bg-surface";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={`${fill} ${stroke}`}
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={sub ? y + 20 : y + 22}
        textAnchor="middle"
        className={LABEL}
        fontSize={13}
        fontWeight={600}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + 37}
          textAnchor="middle"
          className={SUB}
          fontSize={10.5}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function BridgeLoopDiagram() {
  return (
    <figure className="overflow-x-auto rounded-2xl border border-border-glass bg-bg-secondary p-4 md:p-6">
      <svg
        viewBox="0 0 700 430"
        role="img"
        aria-label="The bridge loop: a plain-language prompt in the editor makes the assistant overwrite one watched script file. Inside After Effects, a task scheduled every 1.5 seconds compares the file's timestamp to the last one it saw; on a change it evaluates the file, which rebuilds the comps inside a single undo group. The result is seen on screen and the next prompt refines it."
        className="mx-auto block w-full min-w-[560px] max-w-[700px]"
      >
        <defs>
          <marker
            id="ae-arrow"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border-glass" />
          </marker>
        </defs>

        {/* Outside the app */}
        <text x={30} y={26} className={SUB} fontSize={10.5} fontWeight={600}>
          EDITOR
        </text>
        <Node x={30} y={36} w={230} title="Plain-language prompt" sub="“tighten the type scale”" />
        <path
          d="M 145 86 L 145 116"
          className={EDGE}
          strokeWidth={1}
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <Node
          x={30}
          y={116}
          w={230}
          title="Assistant writes ExtendScript"
          sub="overwrites one watched file"
          accent="violet"
        />

        {/* The file is the whole interface */}
        <path
          d="M 260 141 L 330 141"
          className={EDGE}
          strokeWidth={1}
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <Node x={330} y={116} w={200} title="latest.jsx" sub="mtime is the signal" accent="green" />

        {/* Inside After Effects */}
        <rect
          x={318}
          y={186}
          width={356}
          height={222}
          rx={14}
          className="fill-none stroke-border-glass"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={332} y={206} className={SUB} fontSize={10.5} fontWeight={600}>
          INSIDE AFTER EFFECTS
        </text>

        <path
          d="M 430 166 L 430 216"
          className={EDGE}
          strokeWidth={1}
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <Node
          x={334}
          y={216}
          w={324}
          title="app.scheduleTask — every 1.5 s"
          sub="timestamp changed since the last tick?"
          accent="cyan"
        />
        <path
          d="M 430 266 L 430 296"
          className={EDGE}
          strokeWidth={1}
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <Node
          x={334}
          y={296}
          w={324}
          title="$.evalFile"
          sub="comps replaced by name · one undo group"
          accent="cyan"
        />
        <path
          d="M 430 346 L 430 372"
          className={EDGE}
          strokeWidth={1}
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <Node x={368} y={372} w={256} title="Comps rebuilt on screen" />

        {/* Close the loop — ends just under the assistant box so it reads as
            pointing at it rather than floating. */}
        <path
          d="M 368 390 L 145 390 L 145 172"
          className={EDGE}
          strokeWidth={1}
          strokeDasharray="4 3"
          fill="none"
          markerEnd="url(#ae-arrow)"
        />
        <text x={152} y={300} className={SUB} fontSize={10}>
          look, then refine
        </text>

        {/* The alternate trigger runs the same file on demand, skipping the poll. */}
        <text x={540} y={104} className={SUB} fontSize={10}>
          same file, on demand:
        </text>
        <text x={540} y={118} className={`${SUB} font-mono`} fontSize={10}>
          AfterFX -r
        </text>
      </svg>

      <figcaption className="mt-4 text-xs leading-relaxed text-text-muted">
        The inversion that makes it work: After Effects polls the file rather than
        being pushed to. Anything able to write text becomes a valid driver, and
        nothing outside the app has to know whether it is running.
      </figcaption>
    </figure>
  );
}
