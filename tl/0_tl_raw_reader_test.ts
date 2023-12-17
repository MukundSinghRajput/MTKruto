import { assertEquals } from "../0_deps.ts";
import { TLRawReader } from "./0_tl_raw_reader.ts";

Deno.test("TLRawReader", async (t) => {
  // deno-fmt-ignore
  const buffer = new Uint8Array([
    0x00, // read 1
    //
    0xFF, 0xFF, 0xFF, // uint24
    //
    0x01, 0x00, 0x80, // int24
    //
    0xCC, 0xEE, 0xFF, 0xFF, // uint32
    //
    0xFF, 0xFF, 0xFE, 0xFF, // int32
    //
    0x68, 0xFF, 0x98, 0x88, 0xDD, 0xCC, 0xFF, 0xEE, // uint64
    //
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, // int64
    //
    0xAA, 0xF1, 0xD2, 0x4D, 0x62, 0x10, 0x26, 0xC0, // double
    //
    0x8D, 0x03, 0xBD, 0x3C, 0x55, 0x22, 0xA5, 0x05,
    0xD6, 0xDC, 0xC4, 0x66, 0xF5, 0x3E, 0x00, 0xD0, // uint128
    //
    0x17, 0xB3, 0x50, 0x37, 0x1C, 0xAD, 0x8A, 0xDF,
    0xE5, 0x02, 0x96, 0x48, 0x24, 0xC6, 0x6E, 0x07, // int128
    //
    0x5D, 0xA9, 0x9E, 0xC6, 0xB0, 0xD6, 0x82, 0x3F,
    0xE8, 0x43, 0x78, 0x19, 0xFD, 0x3D, 0x25, 0xAB,
    0x13, 0xEB, 0x8A, 0x60, 0x4F, 0xA7, 0xB1, 0x3B,
    0x17, 0x9C, 0x70, 0x2B, 0xCA, 0xDD, 0x1D, 0xEC, // uint256
    //
    0xFC, 0x99, 0xB0, 0x57, 0xDA, 0x4B, 0x6E, 0xFD,
    0x35, 0x34, 0x69, 0xEC, 0x59, 0x24, 0x40, 0x60,
    0x41, 0x98, 0x0D, 0x97, 0xA6, 0xA2, 0x96, 0x1E,
    0x95, 0xCE, 0xC6, 0xEF, 0x78, 0x95, 0xB9, 0x5F, // int256
    //
    0x01, 0xFF, 0x00, 0x00, // less than 254 bytes
    //
    0xFE, 0xFF, 0x00, 0x00, 0xFB, 0x42, 0xF5, 0xF7,
    0xE7, 0xBC, 0xE5, 0x8F, 0x55, 0x71, 0x59, 0x87,
    0x11, 0xD4, 0xDE, 0x7E, 0x7B, 0xD4, 0x9A, 0x9C,
    0x12, 0x89, 0xEF, 0xB9, 0x91, 0x2A, 0x74, 0x7D,
    0x2C, 0x34, 0xE5, 0x7D, 0x1F, 0x5B, 0x48, 0x6F,
    0xF0, 0xFA, 0x6D, 0x3E, 0x87, 0xDC, 0xB1, 0x5C,
    0x5F, 0x9D, 0x65, 0xD3, 0x1B, 0x8A, 0x63, 0xE3,
    0xD8, 0x94, 0x08, 0xDE, 0xC3, 0x4C, 0x2D, 0x1C,
    0xCF, 0x78, 0x3D, 0x6E, 0x2E, 0x65, 0xAB, 0x10,
    0x36, 0x9B, 0x22, 0x20, 0xC4, 0x1E, 0x96, 0x73,
    0x67, 0x32, 0x54, 0xFB, 0x4D, 0x7A, 0xA0, 0xDB,
    0x81, 0xEA, 0x9D, 0x5D, 0x8D, 0x6A, 0xBD, 0xAD,
    0x92, 0xB1, 0x82, 0x46, 0x93, 0x65, 0x55, 0xC5,
    0x05, 0x9F, 0x90, 0x65, 0x7A, 0xBB, 0xF3, 0x38,
    0x4D, 0x2E, 0xAB, 0xCD, 0xC4, 0xF9, 0xF7, 0x5B,
    0xF7, 0x68, 0x84, 0x5E, 0x27, 0xB2, 0x33, 0x1F,
    0x33, 0x1C, 0xEE, 0x52, 0xA3, 0xDF, 0x27, 0x86,
    0xA6, 0xB5, 0xD8, 0x56, 0x72, 0x44, 0x2D, 0x21,
    0x7A, 0x0F, 0x0D, 0x47, 0xA4, 0x7D, 0x2D, 0x01,
    0x23, 0x03, 0x0F, 0x15, 0x5D, 0xF7, 0x1D, 0xCF,
    0x4C, 0xF8, 0xFF, 0x39, 0xBA, 0xDB, 0xBB, 0x67,
    0x06, 0x55, 0x82, 0xE9, 0x5F, 0x10, 0xA1, 0xEB,
    0x7A, 0xEC, 0x9F, 0x9B, 0x18, 0x7D, 0x90, 0x23,
    0xB5, 0x31, 0xD6, 0x41, 0x1A, 0xD0, 0x2F, 0xD8,
    0x86, 0xBB, 0xF6, 0x93, 0x34, 0x54, 0x3F, 0xEB,
    0xF4, 0x19, 0x5A, 0x19, 0x49, 0xBF, 0x84, 0xCF,
    0xAE, 0xA8, 0xF4, 0xF6, 0xAE, 0xBD, 0xB5, 0x28,
    0xA9, 0xCA, 0x87, 0x6D, 0xB5, 0x54, 0x2F, 0x37,
    0x79, 0xD6, 0xDB, 0x87, 0xEB, 0x20, 0xE1, 0x7C,
    0x75, 0x71, 0x49, 0xE2, 0xA0, 0xAD, 0xF2, 0x2F,
    0xFF, 0xC1, 0x19, 0x8B, 0xF0, 0x84, 0xDC, 0xF3,
    0xC5, 0x12, 0xAB, 0xA5, 0x5A, 0xD5, 0xFD, 0x89,
    0x5E, 0x02, 0xD3, 0x00, // more than 254 bytes
    //
    0x01, 0x52, 0x00, 0x00, // string with less than 254 bytes
    //
    0xFE, 0x03, 0x01, 0x00, 0x4D, 0x54, 0x4B, 0x72,
    0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75,
    0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74,
    0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F,
    0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D,
    0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54,
    0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B,
    0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72,
    0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75,
    0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74,
    0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F,
    0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D,
    0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54,
    0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B,
    0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72,
    0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75,
    0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74,
    0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F,
    0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D,
    0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54,
    0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B,
    0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72,
    0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75,
    0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74,
    0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F,
    0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D,
    0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54,
    0x4B, 0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B,
    0x72, 0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72,
    0x75, 0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75,
    0x74, 0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74,
    0x6F, 0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F,
    0x4D, 0x54, 0x4B, 0x72, 0x75, 0x74, 0x6F, 0x00 // string with more than 254 bytes
  ]);
  const bufferLength = buffer.length;
  const reader = new TLRawReader(buffer);
  let read = 0;

  await t.step("read", async (t) => {
    assertEquals(reader.read(1), new Uint8Array([0]));

    await t.step("buffer", () => {
      read++;
      assertEquals(reader.buffer.length, bufferLength - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readInt24", async (t) => {
    assertEquals(reader.readInt24(false), 0xFFFFFF);
    assertEquals(reader.readInt24(), -8388607);

    await t.step("buffer", () => {
      read += 3 * 2;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readInt32", async (t) => {
    assertEquals(reader.readInt32(false), 0xFFFFEECC);
    assertEquals(reader.readInt32(), -0x010001);

    await t.step("buffer", () => {
      read += 4 * 2;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readInt64", async (t) => {
    assertEquals(reader.readInt64(false), 17221708751939633000n);
    assertEquals(reader.readInt64(), -9223372036854775807n);

    await t.step("buffer", () => {
      read += 8 * 2;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readDouble", async (t) => {
    assertEquals(reader.readDouble(), -11.032);

    await t.step("buffer", () => {
      read += 8;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readInt128", async (t) => {
    assertEquals(reader.readInt128(false), 276480700075363207293378760200953856909n);
    assertEquals(reader.readInt128(), 9879767416712888958949374238624101143n);

    await t.step("buffer", () => {
      read += 16 * 2;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readInt256", async (t) => {
    assertEquals(
      reader.readInt256(false),
      106798601566956061778213567770381794524206942780088236271152238178577682442589n,
    );
    assertEquals(
      reader.readInt256(),
      43297618943045001998167677499050563319748616773287013753630609307270848223740n,
    );

    await t.step("buffer", () => {
      read += 32 * 2;
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readBytes", async (t) => {
    assertEquals(reader.readBytes(), new Uint8Array([0xFF]));
    // deno-fmt-ignore
    assertEquals(
      reader.readBytes(),
      new Uint8Array([
        0xFB, 0x42, 0xF5, 0xF7, 0xE7, 0xBC, 0xE5, 0x8F,
        0x55, 0x71, 0x59, 0x87, 0x11, 0xD4, 0xDE, 0x7E,
        0x7B, 0xD4, 0x9A, 0x9C, 0x12, 0x89, 0xEF, 0xB9,
        0x91, 0x2A, 0x74, 0x7D, 0x2C, 0x34, 0xE5, 0x7D,
        0x1F, 0x5B, 0x48, 0x6F, 0xF0, 0xFA, 0x6D, 0x3E,
        0x87, 0xDC, 0xB1, 0x5C, 0x5F, 0x9D, 0x65, 0xD3,
        0x1B, 0x8A, 0x63, 0xE3, 0xD8, 0x94, 0x08, 0xDE,
        0xC3, 0x4C, 0x2D, 0x1C, 0xCF, 0x78, 0x3D, 0x6E,
        0x2E, 0x65, 0xAB, 0x10, 0x36, 0x9B, 0x22, 0x20,
        0xC4, 0x1E, 0x96, 0x73, 0x67, 0x32, 0x54, 0xFB,
        0x4D, 0x7A, 0xA0, 0xDB, 0x81, 0xEA, 0x9D, 0x5D,
        0x8D, 0x6A, 0xBD, 0xAD, 0x92, 0xB1, 0x82, 0x46,
        0x93, 0x65, 0x55, 0xC5, 0x05, 0x9F, 0x90, 0x65,
        0x7A, 0xBB, 0xF3, 0x38, 0x4D, 0x2E, 0xAB, 0xCD,
        0xC4, 0xF9, 0xF7, 0x5B, 0xF7, 0x68, 0x84, 0x5E,
        0x27, 0xB2, 0x33, 0x1F, 0x33, 0x1C, 0xEE, 0x52,
        0xA3, 0xDF, 0x27, 0x86, 0xA6, 0xB5, 0xD8, 0x56,
        0x72, 0x44, 0x2D, 0x21, 0x7A, 0x0F, 0x0D, 0x47,
        0xA4, 0x7D, 0x2D, 0x01, 0x23, 0x03, 0x0F, 0x15,
        0x5D, 0xF7, 0x1D, 0xCF, 0x4C, 0xF8, 0xFF, 0x39,
        0xBA, 0xDB, 0xBB, 0x67, 0x06, 0x55, 0x82, 0xE9,
        0x5F, 0x10, 0xA1, 0xEB, 0x7A, 0xEC, 0x9F, 0x9B,
        0x18, 0x7D, 0x90, 0x23, 0xB5, 0x31, 0xD6, 0x41,
        0x1A, 0xD0, 0x2F, 0xD8, 0x86, 0xBB, 0xF6, 0x93,
        0x34, 0x54, 0x3F, 0xEB, 0xF4, 0x19, 0x5A, 0x19,
        0x49, 0xBF, 0x84, 0xCF, 0xAE, 0xA8, 0xF4, 0xF6,
        0xAE, 0xBD, 0xB5, 0x28, 0xA9, 0xCA, 0x87, 0x6D,
        0xB5, 0x54, 0x2F, 0x37, 0x79, 0xD6, 0xDB, 0x87,
        0xEB, 0x20, 0xE1, 0x7C, 0x75, 0x71, 0x49, 0xE2,
        0xA0, 0xAD, 0xF2, 0x2F, 0xFF, 0xC1, 0x19, 0x8B,
        0xF0, 0x84, 0xDC, 0xF3, 0xC5, 0x12, 0xAB, 0xA5,
        0x5A, 0xD5, 0xFD, 0x89, 0x5E, 0x02, 0xD3
      ])
    );

    await t.step("buffer", () => {
      read += 4 + (1 + 3 + 255 + 1);
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });

  await t.step("readString", async (t) => {
    assertEquals(reader.readString(), "R");
    assertEquals(reader.readString(), "MTKruto".repeat(37));

    await t.step("buffer", () => {
      read += 4 + (1 + 3 + 259 + 1);
      assertEquals(reader.buffer.length, buffer.length - read);
      assertEquals(reader.buffer, buffer.slice(read));
    });
  });
});
