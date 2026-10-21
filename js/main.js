var getElem = (id) => document.getElementById(id);

var elems = {
  "startButton": getElem("startButton"),
  "cdi1": getElem("cdi1"),
  "fdi1": getElem("fdi1"),
  "fdi2": getElem("fdi2"),
  "hdi1": getElem("hdi1"),
  "hdi2": getElem("hdi2"),
  "ki1": getElem("ki1"),
  "ird1": getElem("ird1"),
  "isi1": getElem("isi1"),
  "bios": getElem("bios"),
  "biosText": getElem("biosText"),
  "vgabios": getElem("vgabios"),
  "vgabiosText": getElem("vgabiosText"),
  "ram": getElem("ram"),
  "vram": getElem("vram"),
  "proxPre": getElem("proxPre"),
  "prox": getElem("prox"),
  "nettype": getElem("nettype"),
  "modem": getElem("modem"),
  "bord": getElem("bord"),
  "modem": getElem("modem"),
  "audio": getElem("audio"),
  "acpi": getElem("acpi"),
}

async function start() {
  if(window.emulator) {
    window.emulator.destroy();
  }
  let config = {
    wasm_path: "misc/v86.wasm",
    memory_size: elems.ram.value * 1024 * 1024,
    vga_memory_size: elems.vram.value * 1024 * 1024,
    screen_container: document.getElementById("screen_container"),
    bios: {},
    vga_bios: {},
    net_device: {
      type: elems.nettype.value,
      relay_url: elems.prox.value
    },
    disable_speaker: !elems.audio.checked,
    acpi: elems.acpi.checked,
    boot_order: parseInt(elems.bord.value, 16),
    autostart: true
  }
  if(elems.cdi1.files[0]) config.cdrom = {
    buffer: await elems.cdi1.files[0].arrayBuffer()
  }
  if(elems.cdi1.files[0]) config.cdrom = {
    buffer: await elems.cdi1.files[0].arrayBuffer()
  }
  if(elems.fdi1.files[0]) config.fda = {
    buffer: await elems.fdi1.files[0].arrayBuffer()
  }
  if(elems.fdi2.files[0]) config.fdb = {
    buffer: await elems.fdi2.files[0].arrayBuffer()
  }
  if(elems.hdi1.files[0]) config.hda = {
    buffer: await elems.hdi1.files[0].arrayBuffer()
  }
  if(elems.hdi2.files[0]) config.hdb = {
    buffer: await elems.hdi2.files[0].arrayBuffer()
  }
  if(elems.ki1.files[0]) config.bzimage = {
    buffer: await elems.ki1.files[0].arrayBuffer()
  }
  if(elems.ird1.files[0]) config.initrd = {
    buffer: await elems.ird1.files[0].arrayBuffer()
  }
  if(elems.isi1.files[0]) config.initial_state = {
    buffer: await elems.isi1.files[0].arrayBuffer()
  }
  window.emulator = new V86(config);
}

async function init() {
  elems.startButton.addEventListener("click", start);
  elems.bios.addEventListener("change", function() {
    if(this.value === "imp") {
      let file = (await selectFiles({ multiple: false }))[0];
      if(file) {

        elems.biosText.innerText = `${file.name} (${(file.size / 1024).toFixed(2)}KB)`;
        this.selectedIndex = 3;
      } else {
        this.value = this.previousValue;
        this.selectedIndex = this.previousIndex;
      }
    }
    this.previousValue = this.value;
    this.previousIndex = this.selectedIndex;
  })
}

elems.bios.previousValue = elems.bios.value;
elems.vgabios.previousValue = elems.vgabios.value;
elems.bios.previousIndex = elems.bios.selectedIndex;
elems.vgabios.previousIndex = elems.vgabios.selectedIndex;

init();