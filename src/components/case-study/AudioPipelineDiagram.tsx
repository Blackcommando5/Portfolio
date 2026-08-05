/* The GMeeting audio path, drawn rather than described.
 *
 * Server component — no interactivity, no client JS. Colours come from theme
 * tokens via fill-/stroke- utilities, so it tracks light and dark mode without
 * a second copy of the diagram.
 */

const BOX = "fill-bg-surface stroke-border-glass";
const LABEL = "fill-current text-text-primary";
const SUB = "fill-current text-text-muted";
const EDGE = "stroke-border-glass";

function Box({
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
  const h = sub ? 52 : 38;
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
        y={sub ? y + 21 : y + 23}
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
          y={y + 39}
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

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
  labelSide = "right",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelSide?: "left" | "right";
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={EDGE}
        strokeWidth={1}
        markerEnd="url(#gm-arrow)"
      />
      {label && (
        <text
          x={labelSide === "right" ? Math.max(x1, x2) + 7 : Math.min(x1, x2) - 7}
          y={(y1 + y2) / 2 + 3}
          textAnchor={labelSide === "right" ? "start" : "end"}
          className={SUB}
          fontSize={10}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function AudioPipelineDiagram() {
  return (
    <figure className="overflow-x-auto rounded-2xl border border-border-glass bg-bg-secondary p-4 md:p-6">
      <svg
        viewBox="0 0 700 590"
        role="img"
        aria-label="Audio pipeline: the microphone feeds the Agora RTC engine, whose read-only audio frame observer forwards 16 kHz mono PCM to a Deepgram WebSocket. Interim results drive the subtitle overlay; final results go to the transcript collector, which feeds Llama 3.3 70B on NVIDIA NIM every 60 seconds, and insights are stored in Firestore for the live panel."
        className="mx-auto block w-full min-w-[560px] max-w-[700px]"
      >
        <defs>
          <marker
            id="gm-arrow"
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

        <Box x={200} y={8} w={300} title="Microphone" />
        <Arrow x1={350} y1={46} x2={350} y2={74} />

        <Box
          x={200}
          y={74}
          w={300}
          title="Agora RTC engine"
          sub="captures and transmits the call audio"
        />
        <Arrow
          x1={350}
          y1={126}
          x2={350}
          y2={158}
          label="registerAudioFrameObserver"
        />

        <Box
          x={170}
          y={158}
          w={360}
          title="Audio frame observer — read-only"
          sub="linear16 · 16 kHz · mono · 1024 samples per callback"
          accent="cyan"
        />
        <Arrow x1={350} y1={210} x2={350} y2={244} label="raw PCM over WebSocket" />

        <Box
          x={170}
          y={244}
          w={360}
          title="Deepgram nova-3"
          sub="diarization · interim results · endpointing 300 ms"
          accent="cyan"
        />

        {/* Fork: interim to the eye, final to the record */}
        <line x1={350} y1={296} x2={350} y2={318} className={EDGE} strokeWidth={1} />
        <line x1={130} y1={318} x2={560} y2={318} className={EDGE} strokeWidth={1} />
        <Arrow x1={130} y1={318} x2={130} y2={348} />
        <Arrow x1={560} y1={318} x2={560} y2={348} />

        <text x={130} y={338} textAnchor="middle" className={SUB} fontSize={10}>
          interim
        </text>
        <text x={560} y={338} textAnchor="middle" className={SUB} fontSize={10}>
          is_final only
        </text>

        <Box x={20} y={348} w={220} title="Subtitle overlay" sub="speaker + live text" />
        <Box
          x={400}
          y={348}
          w={280}
          title="TranscriptCollector"
          sub="merge same speaker ≤ 3 s · name map"
        />

        {/* Two paths into the model: the 60s loop, and once at the end. */}
        {/* Label sits left of its arrow — anchored right it would clip the viewBox. */}
        <Arrow
          x1={600}
          y1={400}
          x2={600}
          y2={434}
          label="every 60 s · 3 guards"
          labelSide="left"
        />
        <line
          x1={460}
          y1={400}
          x2={460}
          y2={434}
          className={EDGE}
          strokeWidth={1}
          strokeDasharray="3 3"
          markerEnd="url(#gm-arrow)"
        />
        <text x={453} y={421} textAnchor="end" className={SUB} fontSize={10}>
          on call end
        </text>

        <Box
          x={380}
          y={434}
          w={300}
          title="Llama 3.3 70B · NVIDIA NIM"
          sub="rolling insight · full minutes on end"
          accent="violet"
        />
        <Arrow x1={530} y1={486} x2={530} y2={518} />

        <Box
          x={380}
          y={518}
          w={300}
          title="Firestore"
          sub="insights shared, outlive the widget"
          accent="green"
        />

        {/* The panel reads Firestore rather than local widget state. */}
        <Arrow x1={380} y1={544} x2={248} y2={544} />
        <Box x={20} y={518} w={220} title="Live insights panel" />
      </svg>

      <figcaption className="mt-4 text-xs leading-relaxed text-text-muted">
        The whole point of this shape: there is only one microphone consumer. The
        transcriber reads the frames the call is already capturing, so the record
        always matches what participants actually heard.
      </figcaption>
    </figure>
  );
}
