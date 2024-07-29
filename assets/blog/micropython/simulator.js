class USBCPowerSupplySimulator extends HTMLElement {
  async init_mp(ctx, stdoutWriter) {
    let mp = await loadMicroPython({
      stdout: stdoutWriter,
      stderr: stdoutWriter,
    });

    mp.registerJsModule("console", { log: (s) => console.log(s) });
    mp.registerJsModule("time", {
      sleep: async (s) => await new Promise((r) => setTimeout(r, s * 1000)),
    });
    mp.registerJsModule("display", {
      draw: (buf) => {
        let bytes = [...buf].flatMap((x) => [x, x, x, 255]);
        let image = new ImageData(new Uint8ClampedArray(bytes), 240, 240);
        ctx.putImageData(image, 0, 0);
      },
    });

    return mp;
  }

  async init_editor() {
    const resp = await fetch("/assets/blog/micropython/example_micropython.py");
    const program = await resp.text();

    // Create an initial state for the view
    const initialState = cm6.createEditorState(program);
    let view = cm6.createEditorView(
      initialState,
      this.shadow.getElementById("editor")
    );
    return view;
  }

  async setup() {
    this.render();

    const canvas = this.shadow.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const mp_console = this.shadow.getElementById("micropython-stdout");
    const stdoutWriter = (line) => {
      mp_console.innerText += line + "\n";
      mp_console.scrollTo(0, mp_console.scrollHeight);
    };

    const [mp, view] = await Promise.all([
      this.init_mp(ctx, stdoutWriter),
      this.init_editor(),
    ]);

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
            //The shadow root can be styled like a container
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
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
        <button id=run title="Run code (Ctrl-Enter)" aria-title="Run code (Ctrl-Enter)">Run</button>
        <canvas height="240" width="240" class = screen></canvas>
        <pre id="micropython-stdout"></pre>
        `;
  }
}

customElements.define("usbc-power-supply-simulator", USBCPowerSupplySimulator);
