
Core VM:

    Instruction decoder — 16 bit to Op struct
    Instruction encoder — Op struct to 16 bit (dev tool)
    Register file — per process state
    Memory space — flat 8MB Uint8Array
    Instruction pointer management
    Instruction executor — one tick per instruction

Memory management:

    Process memory layout — registers, genome, stack in one chunk
    Heap allocator — mrq, mfr against the unallocated sea
    Heap free and defragmentation

Process management:

    Process table — OS level, not addressable
    Process creation — pcr, pst, genome scanning for bei/eoi
    Process scheduler — tick distribution across processes
    Process death — end, kill, stack overflow, illegal instruction

Interrupt system:

    bei/eoi scanning on process start
    Interrupt dispatch — exi
    Interrupt return — eoi

Logging:

    Event types
    postMessage interface



```
00xxxxxxxxxxxxxx - system operations
  000xxxxxxxxxxxxx
    000000xxxxxxxxxx
      0000000000000000 nop
      000000000------- ---
      000000001AAAAAAA end
      000000010xxxxxxx - system memory operations
        0000000100AAABBB mrq
        0000000101--AAAA mfr
      000000011xxxxxxx - system process operations
        0000000110AABBCC - pcr
        0000000111--AAAA - pst
      000000100------- ---
      00000010100xxxxx - interrupt operations
        0000001010000AAA exi
        0000001010001AAA bei
        0000001010010AAA eoi
        0000001010011--- ---
      00000010111xxxxx - stack operations
        000000101110AAAA psh
        000000101111AAAA pop
      00000011-------- ---
    000001---------- ---
    000010---------- ---
    000011---------- ---
    0001------------ ---

  001xxxxxxxxxxxxx - memory operations
    001000AAAABBBBCC lfm
    001001AAAABBCCCC stm
    001010--AAAABBBB cpm
    001011---------- ---
    0011AAAABBBBBBBB ism

01xxxxxxxxxxxxxx - ternary operations
  010000AAAABBBB-- cpr
  010001AAAABBBBCC add
  010010AAAABBBBCC sub
  010011AAAABBBBCC mul
  010100AAAABBBBCC div
  010101AAAABBBBCC mod
  010110AAAABBBBCC and
  010111AAAABBBBCC ior
  011000AAAABBBBCC xor
  011001AAAABBBB-- not
  011010AAAABBBBCC bnd
  011011AAAABBBBCC bor
  011100AAAABBBBCC bxr
  011101AAAABBBB-- bnt
  011110AAAABBBBCC lsh
  011111AAAABBBBCC rsh

10xxxxxxxxxxxxxx - compare operations
  100xxxxxxxxxxxxx - branch operations
    100000AAAABBBBCC beq
    100001AAAABBBBCC bne
    100010AAAABBBBCC bge
    100011AAAABBBBCC ble
    100100AAAABBBBCC bgt
    100101AAAABBBBCC blt
    100110AAAABBBB-- bit
    100111AAAABBBB-- bif
  101xxxxxxxxxxxxx - test operations
    101000AAAABBBBCC teq
    101001AAAABBBBCC tne
    101010AAAABBBBCC tge
    101011AAAABBBBCC tle
    101100AAAABBBBCC tgt
    101101AAAABBBBCC tlt
    101110AAAABBBB-- tit
    101111AAAABBBB-- tif

11xxxxxxxxxxxxxx - immediate set
  11AAAABBCCCCCCCC - set
```
