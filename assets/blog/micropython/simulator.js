class USBCPowerSupplySimulator extends HTMLElement {
  async init_mp(ctx, stdoutWriter) {
    let mp = await loadMicroPython({
      stdout: stdoutWriter,
      stderr: stdoutWriter,
    });

    let col565_to_rgb = (h, l) => {
      const r = (((h >>> 3) & 0b11111) * 255) / 31; // take top 5 bits and rescale so range 0-31 becomes 0-255
      // Take bottom three bits of high byte, upper 3 bits of low, and scale from 0-63 to 0-255
      // '>>>' rights shifts without sign extension
      const g = ((((h & 0b111) << 3) | (l >>> 5)) * 255) / 63;
      const b = ((l & 0b11111) * 255) / 31; // lower 5 bits moved to the top
      return [r, g, b];
    };

    mp.registerJsModule("console", { log: (s) => console.log(s) });
    mp.registerJsModule("display", {
      draw_GS8: (buf) => {
        let bytes = [...buf].flatMap((x) => [x, x, x, 255]);
        let image = new ImageData(new Uint8ClampedArray(bytes), 240, 240);
        ctx.putImageData(image, 0, 0);
      },
      draw_RGB565: (buf) => {
        const bytes_565 = new Uint8ClampedArray([...buf]);
        const bytes_rgb = new Uint8ClampedArray(240 * 240 * 4);
        for (let i = 0; i < 240 * 240; i++) {
          const [r, g, b] = col565_to_rgb(
            bytes_565[i * 2],
            bytes_565[i * 2 + 1]
          );
          bytes_rgb[i * 4] = r;
          bytes_rgb[i * 4 + 1] = g;
          bytes_rgb[i * 4 + 2] = b;
          bytes_rgb[i * 4 + 3] = 255;
        }
        let image = new ImageData(bytes_rgb, 240, 240);
        ctx.putImageData(image, 0, 0);
      },
    });

    return mp;
  }

  async init_editor(initial_code) {
    // Create an initial state for the view
    const initialState = cm6.createEditorState(initial_code);
    let view = cm6.createEditorView(
      initialState,
      this.shadow.getElementById("editor")
    );
    return view;
  }

  async setup() {
    const editor_disabled = this.hasAttribute("disable-editor");
    const console_disabled = this.hasAttribute("disable-console");

    this.render();

    const canvas = this.shadow.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const mp_console = this.shadow.getElementById("micropython-stdout");
    const stdoutWriter = console_disabled
      ? console.log
      : (line) => {
          mp_console.innerText += line + "\n";
          mp_console.scrollTo(0, mp_console.scrollHeight);
        };
    if (console_disabled) mp_console.style.display = "none";

    let initial_code = "";
    if (this.hasAttribute("code")) {
      const resp = await fetch(this.getAttribute("code"));
      if (resp.ok) initial_code = await resp.text();
    }
    if (!initial_code) initial_code = 'print("Hello, World!")';

    const view = editor_disabled
      ? { state: { doc: initial_code } }
      : await this.init_editor(initial_code);

    const runPython = async () => {
      mp_console.innerText = "";
      let mp = await this.init_mp(ctx, stdoutWriter);
      try {
        await mp.runPythonAsync(view.state.doc.toString());
      } catch (e) {
        stdoutWriter(e);
      }
    };

    const run_button = this.shadow.getElementById("run");
    run_button.onclick = runPython;
    if (editor_disabled) run_button.style.display = "none";
    runPython();
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.setup().catch(console.error);
  }

  render() {
    this.shadow.innerHTML = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
            }
            pre#micropython-stdout {
                overflow-y: auto;
                width: 80%;
                white-space: pre-wrap;
                height: 5em;
                background-color: #d1d1d136;
                border: 1px black solid;
                border-radius: 5px;
                padding: 5px;
            }
            button {
                width: 5em;
                align-self: flex-start;
            }

            .screen {
            width: 240px;
            height: 240px;
            border-radius: 50%;
            border: solid 1px black;
            align-self: center;
            }
        </style>
        <div id="editor"></div>
        <button id=run title="Run code (Ctrl-Enter)" aria-label="Run code (Ctrl-Enter)">Run</button>
        <canvas height="240" width="240" class = screen></canvas>
        <pre id="micropython-stdout"></pre>
        `;
  }
}

customElements.define("usbc-power-supply-simulator", USBCPowerSupplySimulator);
