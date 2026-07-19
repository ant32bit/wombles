
# Purpose

Wombles are small programs that run in a virtual machine. They are an experiment into the theory of evolution and survival of the fittest.
Wombles don't try to emulate evolution exactly but cover a few important areas.
- A womble's only purpose is to create copies of itself.
- There is limited resources to complete this task (fixed memory size, capped execution time)
- The instructions it uses to copy memory are unstable and can cause minor mutations.
- These mutations cause the next generation of wombles to be different from the previous generation.
- Changes in behaviour affect the "suitability" of the womble.

There are specific design choices that differ from normal computer hardware to facilitate evolution.
- Exactly what suitability means is purposefully not defined. Suitability should emerge naturally.
- The memory system is insecure (ie all memory is accessible by all wombles.)
- The are no virtual addresses, all addresses must fit into 31-bit space.
- Registries and instructions sit in accessible RAM able to be modified by anyone.
- The OS sits outside the memory space and cannot be modified by running wombles.
- `cpm` and `imp` functions are volatile and may not work as expected.
  - `cpm` may copy from an adjacent byte
  - `cpm` may copy to an adjacent byte
  - `ism` may increment by -1 to 2 incrememts with 1 increment being most likely.

# Memory

The memory space is a large array of bytes that represent the randomly accessible memory (RAM) of the virtual machine.

The whole memory space is divided into frames. A memory address is defined by how many bits are used to index the frames and how many bits are used to index the memory within a frame.

As an example, a RAM(13,10) will use 13 bits to represent the frames, so there will be 8,192 addressable frames. And 10 bits are used for indexing within a frame, so there is 1,024 bytes available within the frame. This memory space would be 8Mb in total.

## Memory Addresses

Memory addresses are represented as 32bit unsigned integer.
```
[1] [00000 000] [00000 00000 001] [00000 00011]
 ^           ^                 ^             ^
 is_valid    filler (all 0s)   frame_index   memory_index
```
In the above example this is a valid address, pointing to the second frame (zero based indexing), and the threeth memory address (also zero based).

The validation bit allows us to continue to keep 0 as the null pointer.

In order for mutations to work, all addresses with a 0 for the highest bit are considered null pointers (this should be more likely considered a "reserved space").

Also when evaluating an address any non-zero filler is ignored.

## Frame Types

Typically, frames are all free at the start of proessing except one.

3 types of frame:

| Frame Type | Owner | Description |
| --- | --- | --- |
| Free | None | This is an unused frame |
| Process | Itself | This is a process |
| Heap | System | This is reserved memory for divying up and allocating |

### Ownership

Memory is typically owned as a way of keeping track of who is using what pieces of memory.

A process is owned by the parent that created it until it is running. Then it is owned by itself.

A heap is owned by the system, but when an allocation is requested using `mrq` a piece of that is divvied and marked as "owned" by the requesting process.

Ownership has three purposes
- Blocks other processes from freeing that memory
- Allows all memory owned by a process to be freed when it is terminated.
- Stops the system from freeing a heap or providing that memory block to another process.

Ownership does not prevent reads and writes to a memory address.

# Processor

The virtual machine processor is more like and OS and CPU combined. This allows some instructions to handle more OS level duties like loading and starting an application or executing interrupt behaviour.

## Registers

There are 5 types of registers in the system.

| Register Type | Purpose |
| --- | --- |
| Zero Register | This is a virtual register that always holds the value 0 and writing to it is basically a no-op |
| Data Registers | 15 data registers that the womble can use for processing. The 15th register also serves as a special data register that is used for OS level communication to the program (ie interrupt data)
| Interrupt Registers | These hold the instruction address to go to execute instructions during an interrupt. |
| Jump Back Registsers | During an interrupt these registers hold the value of the instruction pointer before the womble jumped to the interrupt instructions or a null pointer if there is nothing to jump back to. |
| Pointers | This includes the stack pointer pointing to the top of the stack. and the instruction pointer that points to the current executing instruction. |

## Anatomy of a Process

| Name | Offset | Size | Justification | Notes |
| --- | --- | --- | --- | --- |
| Zero Register (`$0`) | - | - | | Always 0 - a virtual register
| 32-bit Data Registers <br> (`$1` – `$14`) | 0 | 56 | 4 bytes <br> ⨉ 14 registers | registers available to instructions
| Interrupt Register (`$15`) | 56 | 4 | | used as value when broadcasting or receiving an interrupt
| Interrupt Index Registers (`I0` – `I7`) | 60 | 32 | 4 bytes <br> ⨉ 8 registers | set by `bei` - set IP to this when an interrupt occurs
| Jump Back Index Registers (`J0` – `J7`) | 92 | 32 | 4 bytes <br> ⨉ 8 registers | set to the IP if 0 when an interrupt occurs
| Stack Pointer (`SP`) | 124 | 4 | | Always points to the top of the stack
| Instruction Pointer (`IP`) | 128 | 4 | | Points to the next executing instrution
| Instruction Start | 132 | 892 | 1024 process allocation – 132 register bytes | All instructions of the program
| Initial Stack Position | 1024 | 0 | | SP initial value

## Instruction Set

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
      00000010101----- ---
      00000010110xxxxx - instruction operations
        000000101100AAAA gip
        000000101101AAAA sip
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
    001011AAAABBBBBB imp
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

# Sample Womble
```
# init the instruction start and curr instruction to $12, $13
gip $12
cpr $12, $13

# set the jumpback register $7 to -10
cpr $0, $7
set $7[0], 128
set $7[3], 10

# set the instructions size register $8 to 892
cpr $0, $8
set $8[2], 3
set $8[3], 124

# create a process and set the pid to $9 and the ip to $10
pcr $1, $2, $3
cpr $2, $9
cpr $3, $10

# set current source byte and current destination byte to $14 and $11
cpr $13, $14
cpr $10, $11

# copy the instruction from source to dest
cpm $14, $11
imp $14, 1
imp $11, 1
cpm $14, $11

# move current to next instruction
imp $13, 2
imp $10, 2

# loop while current source is less that instruction space
sub $13, $12, $1
cpr $2, $7
blt $1, $8, $2

# start the process
pst $9

# go back to start
sip $12
```
