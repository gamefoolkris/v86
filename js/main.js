var getElem = (id) => document.getElementById(id);

var elems = {
  "openButton": getElem("openButton"),
  "closeButton": getElem("closeButton"),
  "pauseButton": getElem("pauseButton"),
  "resetButton": getElem("resetButton"),
  "fullscreenButton": getElem("fullscreenButton"),
  "VMScreen": getElem("VMScreen"),
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

async function selectFiles({ accept = "*", multiple = true } = {}) {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.addEventListener("change", () => {
      resolve(Array.from(input.files ?? []));
      input.remove();
    }, { once: true });

    input.addEventListener("cancel", () => {
      resolve([]);
      input.remove();
    }, { once: true });

    input.click();
  });
}

async function open() {
  let config = {
    wasm_path: "misc/v86.wasm",
    memory_size: elems.ram.value * 1024 * 1024,
    vga_memory_size: elems.vram.value * 1024 * 1024,
    screen_container: elems.VMScreen,
    bios: elems.bios.files[0] ? {
      buffer: await elems.bios.files[0].arrayBuffer()
    } : {
      url: elems.bios.value
    },
    vga_bios: elems.vgabios.files[0] ? {
      buffer: await elems.vgabios.files[0].arrayBuffer()
    } : {
      url: elems.vgabios.value
    },
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
  elems.pauseButton.innerText = "Pause";

  emulator.add_listener("emulator-stopped", function() {
    if(this.destroyed) {
      elems.pauseButton.innerText = "Pause";
      elems.VMScreen.innerHTML = `<div></div><canvas></canvas>`;
    } else {
      elems.pauseButton.innerText = "Resume";
    }
  });

  emulator.add_listener("emulator-started", function() {
    elems.pauseButton.innerText = "Pause";
  });
}
async function pause() {
  if(!emulator) {
    return;
  }
  if(emulator.v86.running) {
    emulator.stop();
    return false;
  } else {
    emulator.run();
    return true;
  }
}
async function reset() {
  if(!emulator) {
    return;
  }
  emulator.restart();
}
async function fullscreen() {
  if(!emulator) {
    return;
  }
  emulator.screen_go_fullscreen();
}
async function close() {
  if(!emulator) {
    return;
  }
  emulator.destroy();
}

async function init() {
  elems.openButton.addEventListener("click", open);
  elems.pauseButton.addEventListener("click", pause);
  elems.resetButton.addEventListener("click", reset);
  elems.closeButton.addEventListener("click", close);
  elems.fullscreenButton.addEventListener("click", fullscreen);
  elems.bios.addEventListener("change", async function() {
    if(this.value === "imp") {
      let file = (await selectFiles({ multiple: false }))[0];
      if(file) {
        this.files = [file];
        elems.biosText.innerText = `${file.name} (${(file.size / 1024).toFixed(2)}KB)`;
        this.selectedIndex = 3;
      } else {
        this.value = this.previousValue;
        this.selectedIndex = this.previousIndex;
      }
    } else {
      this.files = [];
    }
    this.previousValue = this.value;
    this.previousIndex = this.selectedIndex;
  })
  elems.vgabios.addEventListener("change", async function() {
    if(this.value === "imp") {
      let file = (await selectFiles({ multiple: false }))[0];
      if(file) {
        this.files = [file];
        elems.vgabiosText.innerText = `${file.name} (${(file.size / 1024).toFixed(2)}KB)`;
        this.selectedIndex = 3;
      } else {
        this.value = this.previousValue;
        this.selectedIndex = this.previousIndex;
      }
    } else {
      this.files = [];
    }
    this.previousValue = this.value;
    this.previousIndex = this.selectedIndex;
  })
}

elems.bios.previousValue = elems.bios.value;
elems.vgabios.previousValue = elems.vgabios.value;
elems.bios.previousIndex = elems.bios.selectedIndex;
elems.vgabios.previousIndex = elems.vgabios.selectedIndex;
elems.bios.files = [];
elems.vgabios.files = [];

init();