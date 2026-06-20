
describe("instruction set", () => {
    require("./virtual-machine/instructions/instructions-set/add.spec");
    require("./virtual-machine/instructions/instructions-set/and.spec");
    require("./virtual-machine/instructions/instructions-set/bei.spec");
    require("./virtual-machine/instructions/instructions-set/beq.spec");
    require("./virtual-machine/instructions/instructions-set/bge.spec");
    require("./virtual-machine/instructions/instructions-set/bgt.spec");
    require("./virtual-machine/instructions/instructions-set/bif.spec");
    require("./virtual-machine/instructions/instructions-set/bit.spec");
    require("./virtual-machine/instructions/instructions-set/ble.spec");
    require("./virtual-machine/instructions/instructions-set/blt.spec");
    require("./virtual-machine/instructions/instructions-set/bnd.spec");
    require("./virtual-machine/instructions/instructions-set/bne.spec");
    require("./virtual-machine/instructions/instructions-set/bnt.spec");
    require("./virtual-machine/instructions/instructions-set/bor.spec");
    require("./virtual-machine/instructions/instructions-set/bxr.spec");
    require("./virtual-machine/instructions/instructions-set/cpm.spec");
    require("./virtual-machine/instructions/instructions-set/cpr.spec");
    require("./virtual-machine/instructions/instructions-set/div.spec");
    require("./virtual-machine/instructions/instructions-set/end.spec");
    require("./virtual-machine/instructions/instructions-set/eoi.spec");
    require("./virtual-machine/instructions/instructions-set/exi.spec");
    require("./virtual-machine/instructions/instructions-set/gip.spec");
    require("./virtual-machine/instructions/instructions-set/imp.spec");
    require("./virtual-machine/instructions/instructions-set/ior.spec");
    require("./virtual-machine/instructions/instructions-set/ism.spec");
    require("./virtual-machine/instructions/instructions-set/lfm.spec");
    require("./virtual-machine/instructions/instructions-set/lsh.spec");
    require("./virtual-machine/instructions/instructions-set/mfr.spec");
    require("./virtual-machine/instructions/instructions-set/mod.spec");
    require("./virtual-machine/instructions/instructions-set/mrq.spec");
    require("./virtual-machine/instructions/instructions-set/mul.spec");
    require("./virtual-machine/instructions/instructions-set/nop.spec");
    require("./virtual-machine/instructions/instructions-set/not.spec");
    require("./virtual-machine/instructions/instructions-set/pcr.spec");
    require("./virtual-machine/instructions/instructions-set/pop.spec");
    require("./virtual-machine/instructions/instructions-set/psh.spec");
    require("./virtual-machine/instructions/instructions-set/pst.spec");
    require("./virtual-machine/instructions/instructions-set/rsh.spec");
    require("./virtual-machine/instructions/instructions-set/set.spec");
    require("./virtual-machine/instructions/instructions-set/sip.spec");
    require("./virtual-machine/instructions/instructions-set/stm.spec");
    require("./virtual-machine/instructions/instructions-set/sub.spec");
    require("./virtual-machine/instructions/instructions-set/teq.spec");
    require("./virtual-machine/instructions/instructions-set/tge.spec");
    require("./virtual-machine/instructions/instructions-set/tgt.spec");
    require("./virtual-machine/instructions/instructions-set/tif.spec");
    require("./virtual-machine/instructions/instructions-set/tit.spec");
    require("./virtual-machine/instructions/instructions-set/tle.spec");
    require("./virtual-machine/instructions/instructions-set/tlt.spec");
    require("./virtual-machine/instructions/instructions-set/tne.spec");
    require("./virtual-machine/instructions/instructions-set/xor.spec");
});

describe("virtual machine", () => {
    describe("processing", () => {
        require("./virtual-machine/instructions/encoder.spec");
    });

    describe("memory", () => {
        require("./virtual-machine/memory/random-access-memory.spec");
        require("./virtual-machine/memory/process-allocation.spec");
        require("./virtual-machine/memory/heap-allocation.spec");
    });
});
