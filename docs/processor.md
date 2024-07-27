
## Instruction Set

### full registry instructions 

OpCode  OpSubCode  Rd     Rn
0010    00         00000  00000 

lfm 00 (load from memory)
stm 01 (store to memory)
cpy 10
mov 11

### three register ops (1 result reg, 2 op regs)

OpCode  OpSubCode  Rd  Rl    Rr 
01      0000       00  0000  0000

add 0000
sub 0001
mul 0010
div 0011
mod 0100
and 0101
nor 0110
xor 0111
not 1000 (Rr not used)
bnd 1001
bor 1010
bxr 1011
bnt 1100 (Rl not used)
lsh 1101
rsh 1110
    1111

### branch and jump

OpCode  OpSubCode  CmpSubCode  Rb   Rl   Rr 
100     0          000         000  000  000

j  0 jump if
b  1 branch if (stores a link back in link register)

eq 000
ne 001
ge 010
le 011
gt 100
lt 101
   110
   111

### test operators

OpCode  CmpSubCode  Rd  Rl    Rr
101     000         00  0000  0000

t

### system codes

OpCode  OpSubCode
11

