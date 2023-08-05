---
type: education
title: M.Sc Thesis, Natural Sciences
period: 2018
location: Trinity College, Cambridge
subtitle: "Imaging Magnetic Phenomena with Scanning Diamond Magnetometry"

image: /assets/images/vector_magnet_angle_view.png
alt: "A render of vector magnet that I designed in a CAD program."

image_markup: <model-viewer style="height:250px;" src="/assets/blog/vector_magnet/vector_magnet.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="/assets/blog/vector_magnet/vector_magnet.png" shadow-intensity="1" environment-image="/assets/blog/vector_magnet/aircraft_workshop_01_1k.hdr" camera-orbit="-169.8deg 78.57deg 0.8881m" field-of-view="32.55deg" interaction-prompt="none" auto-rotate> </model-viewer>

layout: cv_entry
read_more: true
assets: /assets/blog/vector_magnet
---

Supervisor: Professor Mete Atatüre<br>
<br>
The project centered around the use of a Nitrogen-Vancancy defect in a nanoscale diamond to detect magnetic fields with ultra high resolution. We experimented with mounting such a nano-diamond to the tip of an atomic force microscope in order to produce field images. I built a 3d vector magnetometer in order to determine the axis of a defect in a nano-diamond.

Check out a little interactive model of the magnetometer below. The device has three pairs of copper Helmholtz coils that generate controlled, linear, magnetic fields in all three directions.

<figure>
<model-viewer id="vector-magnet-whole-2" style="height:500px;" src="{{ page.assets }}/vector_magnet.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="{{ page.assets }}/vector_magnet.png" shadow-intensity="1" environment-image="{{ page.assets }}/aircraft_workshop_01_1k.hdr" interaction-prompt="none" interpolation-decay="300" auto-rotate> 

<button class="Hotspot" style="disaplay:none;" slot="hotspot-1" data-position="0.3140708429455987m 0.2809109652738389m -0.32504316945989636m" data-normal="-3.85185900533595e-30m -1.343588384327496e-7m 0.9999999999999911m" data-visibility-attribute="visible"><div class="left HotspotAnnotation">AFM Tip</div></button>

<button class="Hotspot" style="disaplay:none;" slot="hotspot-3" data-position="0.32587557211500007m 0.2711873555719334m -0.32504317169367186m" data-normal=" -4.575935640098142e-8m -2.0164410743149838e-7m 0.9999999999999787m" data-visibility-attribute="visible"><div class="HotspotAnnotation">Microscope Objective</div></button>

<button class="Hotspot" style="disaplay:none;" slot="hotspot-4" data-position="0.3186977335100803m 0.2788147714959883m -0.3250432252613787m" data-normal=" 1.5099584039393812e-7m -1.34358838432748e-7m 0.9999999999999796m" data-visibility-attribute="visible"><div class="HotspotAnnotation">PCB Excitation Coil</div></button>
<button class="section" onclick="toggleSection(this)">Show Section View</button>

</model-viewer>
<figcaption>
</figcaption>
</figure>

Here's a cutaway view, try zooming out to get your bearing with respect to the above diagram. You can see that in the center of these three pairs of coils there is:

<figure>
<model-viewer style="height:400px;" src="{{ page.assets }}/vector_magnet_section.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="{{ page.assets }}/section_view.png" shadow-intensity="1" environment-image="{{ page.assets }}/aircraft_workshop_01_1k.hdr" camera-orbit="37.19deg 75.38deg 0.3104m" field-of-view="12deg">
<button class="Hotspot" slot="hotspot-1" data-position="0.0002550490643940138m 0.12905932644259982m 0.0003319628199390896m" data-normal="-3.85185900533595e-30m -1.343588384327496e-7m 0.9999999999999911m" data-visibility-attribute="visible">
        <div class="left HotspotAnnotation">AFM Tip</div>
    </button><button class="Hotspot" slot="hotspot-3" data-position="0.015349223451080356m 0.11522588429565153m 0.0037307930577810513m" data-normal="0.9822871951592153m -1.7349759832900923e-7m 0.18738160589079159m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">Microscope Objective</div>
    </button><button class="Hotspot" slot="hotspot-4" data-position="0.004252449047777678m 0.12449395035064194m -0.0015034997269766357m" data-normal="3.85185900533595e-30m 0.9999999999999911m 1.343588384327496e-7m" data-visibility-attribute="visible">
        <div class="HotspotAnnotation">PCB Excitation Coil</div>
    </button></model-viewer>
<figcaption>
</figcaption>
</figure>

**AFM Tip**: The atomic force microscope tip in blue with a nano-diamond attached to the very tip. We want to figure out which was the axis the NV defect in this nano-diamond is pointing. To do that we need to expose it to different directions of magnetic field while also blasting it with light and radio waves.

**PCB coil** For the radio wave blasting we have a single turn coil made on a PCB. I haven't cut the coil away so that you can see it's whole shape. We'll pump RF power into this tuned to the electronic transitions in the NV defect that we want to probe.

**Microscope Objective** The microscope objective allows us to optically pump the transitions in the NV defect (much like a laser) in order to keep electrons in excited quantum states that they wouldn't normally sit in.

By putting in varying currents through the three coils pairs we can create a very well controlled magnetic field in any direction and of varying strength. We can then run a sweep through all the possible field directions while blasting the NV center with light and RF in order to determine it axis with respect to the plastic housing of the tip. 

This is how you would calibrate one of these magnetism sensing AFM tips after first sticking a diamond to the tip.

Once we know the axis direction this AFM tip could then be transferred back to the AFM to measure magnetic fields at the nanoscale!

TODO: Explain this in a bit more detail.


<script type="module">
  const modelViewer = document.querySelector("model-viewer#vector-magnet-whole-2");
  modelViewer.in_section_view = false;

  modelViewer.addEventListener('load', (event) => { 
    
    modelViewer.cameraOrbit = modelViewer.in_section_view ? "37.19deg 75.38deg 0.01m" : "auto auto auto";
    modelViewer.cameraTarget = modelViewer.in_section_view ? "0.3142m 0.2804m -0.3250m" : "auto auto auto";
    modelViewer.fieldOfView = modelViewer.in_section_view ? "5deg" : "auto";
    modelViewer.autoRotate = !modelViewer.in_section_view;

    if(modelViewer.in_section_view){
        window.setTimeout(() => [...modelViewer.getElementsByClassName("Hotspot")].forEach(e => e.style.display = "unset"), 1000);
    } else {
        [...modelViewer.getElementsByClassName("Hotspot")].forEach(e => e.style.display = "none")
    }

    // const logPoint = (event) => {
    //     const p = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY)
    // console.log(p.position.toString(), p.normal.toString());
    // };
    
    // modelViewer.addEventListener("click", logPoint);
    
});

  window.toggleSection = (element) => {
    modelViewer.in_section_view = !modelViewer.in_section_view;

    console.log(modelViewer.cameraOrbit, modelViewer.cameraTarget, modelViewer.fieldOfView);
    if(modelViewer.in_section_view) {
        modelViewer.src = "{{ page.assets }}/test_section.glb";
    } else {
        modelViewer.src = "{{ page.assets }}/test_whole.glb";
    }
    
  };

</script>