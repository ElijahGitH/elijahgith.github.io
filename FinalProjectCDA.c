#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include "spimcore.h"

void ALU(unsigned A, unsigned B, char ALUControl, unsigned *ALUresult, char *Zero);
int instruction_fetch(unsigned PC, unsigned *Mem, unsigned *instruction);
void instruction_partition(unsigned instruction, unsigned *op, unsigned *r1,
                           unsigned *r2, unsigned *r3, unsigned *funct,
                           unsigned *offset, unsigned *jsec);
int instruction_decode(unsigned op, struct_controls *controls);
void read_register(unsigned r1, unsigned r2, unsigned *Reg, unsigned *data1,
                   unsigned *data2);
void sign_extend(unsigned offset, unsigned *extended_value);
int ALU_operations(unsigned data1, unsigned data2, unsigned extended_value,
                   unsigned funct, char ALUOp, char ALUSrc,
                   unsigned *ALUresult, char *Zero);
int rw_memory(unsigned ALUresult, unsigned data2, char MemWrite, char MemRead,
              unsigned *memdata, unsigned *Mem);
void write_register(unsigned r2, unsigned r3, unsigned memdata, unsigned ALUresult,
                    char RegWrite, char RegDst, char MemtoReg, unsigned *Reg);
void PC_update(unsigned jsec, unsigned extended_value, char Branch, char Jump,
               char Zero, unsigned *PC);

void ALU(unsigned A, unsigned B, char ALUControl, unsigned *ALUresult, char *Zero)
{
    unsigned out = 0;

    switch ((unsigned)ALUControl) {
        case 0:  out = A + B; break;
        case 1:  out = A - B; break;
        case 2:  out = ((int32_t)A < (int32_t)B) ? 1u : 0u; break;
        case 3:  out = (A < B) ? 1u : 0u; break;
        case 4:  out = A & B; break;
        case 5:  out = A | B; break;
        case 6:  out = B << 16; break;
        case 7:  out = ~(A | B); break;
        default: out = 0; break;
    }

    *ALUresult = out;
    *Zero = (out == 0) ? 1 : 0;
}

int instruction_fetch(unsigned PC, unsigned *Mem, unsigned *instruction)
{
    if ((PC & 3u) != 0) return 1;
    *instruction = Mem[PC >> 2];
    return 0;
}

void instruction_partition(unsigned instruction, unsigned *op, unsigned *r1,
                           unsigned *r2, unsigned *r3, unsigned *funct,
                           unsigned *offset, unsigned *jsec)
{
    *op     = (instruction >> 26) & 0x3Fu;
    *r1     = (instruction >> 21) & 0x1Fu;
    *r2     = (instruction >> 16) & 0x1Fu;
    *r3     = (instruction >> 11) & 0x1Fu;
    *funct  =  instruction        & 0x3Fu;
    *offset =  instruction        & 0xFFFFu;
    *jsec   =  instruction        & 0x03FFFFFFu;
}

int instruction_decode(unsigned op, struct_controls *controls)
{
    controls->RegDst   = 0;
    controls->Jump     = 0;
    controls->Branch   = 0;
    controls->MemRead  = 0;
    controls->MemtoReg = 0;
    controls->ALUOp    = 0;
    controls->MemWrite = 0;
    controls->ALUSrc   = 0;
    controls->RegWrite = 0;

    switch (op) {
        case 0:
            controls->RegDst = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 7;
            return 0;
        case 2:
            controls->Jump = 1;
            return 0;
        case 4:
            controls->Branch = 1;
            controls->ALUOp = 1;
            return 0;
        case 8:
            controls->ALUSrc = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 0;
            return 0;
        case 10:
            controls->ALUSrc = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 2;
            return 0;
        case 11:
            controls->ALUSrc = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 3;
            return 0;
        case 15:
            controls->ALUSrc = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 6;
            return 0;
        case 35:
            controls->ALUSrc = 1;
            controls->MemRead = 1;
            controls->MemtoReg = 1;
            controls->RegWrite = 1;
            controls->ALUOp = 0;
            return 0;
        case 43:
            controls->ALUSrc = 1;
            controls->MemWrite = 1;
            controls->ALUOp = 0;
            return 0;
        default:
            return 1;
    }
}

void read_register(unsigned r1, unsigned r2, unsigned *Reg, unsigned *data1,
                   unsigned *data2)
{
    *data1 = Reg[r1];
    *data2 = Reg[r2];
}

void sign_extend(unsigned offset, unsigned *extended_value)
{
    if (offset & 0x8000u) {
        *extended_value = offset | 0xFFFF0000u;
    } else {
        *extended_value = offset & 0x0000FFFFu;
    }
}

int ALU_operations(unsigned data1, unsigned data2, unsigned extended_value,
                   unsigned funct, char ALUOp, char ALUSrc,
                   unsigned *ALUresult, char *Zero)
{
    unsigned rhs = (ALUSrc) ? extended_value : data2;
    char ctrl = ALUOp;

    if (ALUOp == 7) {
        switch (funct) {
            case 32: ctrl = 0; break;
            case 34: ctrl = 1; break;
            case 42: ctrl = 2; break;
            case 43: ctrl = 3; break;
            case 36: ctrl = 4; break;
            case 37: ctrl = 5; break;
            case 6:  ctrl = 6; break;
            case 39: ctrl = 7; break;
            default: return 1;
        }
    }

    ALU(data1, rhs, ctrl, ALUresult, Zero);
    return 0;
}

int rw_memory(unsigned ALUresult, unsigned data2, char MemWrite, char MemRead,
              unsigned *memdata, unsigned *Mem)
{
    if ((MemRead || MemWrite) && ((ALUresult & 3u) != 0)) return 1;

    if (MemRead) {
        *memdata = Mem[ALUresult >> 2];
    }
    if (MemWrite) {
        Mem[ALUresult >> 2] = data2;
    }
    return 0;
}

void write_register(unsigned r2, unsigned r3, unsigned memdata, unsigned ALUresult,
                    char RegWrite, char RegDst, char MemtoReg, unsigned *Reg)
{
    if (!RegWrite) return;

    unsigned dst = (RegDst) ? r3 : r2;
    unsigned val = (MemtoReg) ? memdata : ALUresult;
    Reg[dst] = val;
}

void PC_update(unsigned jsec, unsigned extended_value, char Branch, char Jump,
               char Zero, unsigned *PC)
{
    unsigned next = *PC + 4;

    if (Jump) {
        *PC = (next & 0xF0000000u) | (jsec << 2);
        return;
    }

    if (Branch && Zero) {
        next += (extended_value << 2);
    }

    *PC = next;
}
