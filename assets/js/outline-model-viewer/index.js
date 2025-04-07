import { PointCloudViewer } from "./PointCloudViewer.js";
import { VolumeViewer } from "./VolumeViewer.js";
import { ScrollLockedViewer } from "./ScrollLockedViewer.js";
import { OutlineModelViewer } from "./OutlineViewer.js";

customElements.define("point-cloud-viewer", PointCloudViewer);
customElements.define("volume-viewer", VolumeViewer);
customElements.define("scroll-locked-viewer", ScrollLockedViewer);
customElements.define("outline-model-viewer", OutlineModelViewer);
