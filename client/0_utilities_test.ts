import { assert, assertEquals, assertThrows } from "../0_deps.ts";
import { getUsername, match } from "./0_utilities.ts";

Deno.test("getUsername", () => {
  const validUsernames = ["pic", "telegram", "p_ic", "test12345", "a".repeat(32)];
  const invalidUsernames = ["_pic", "2pic", "a__c", "a".repeat(33), "têst"];

  for (const username of validUsernames) {
    assertEquals(getUsername(username), username);
    assertEquals(getUsername("@" + username), username);
    assertEquals(getUsername("https://t.me/" + username), username);
    assertEquals(getUsername(`https://${username}.t.me`), username);
    assertThrows(() => getUsername(`https://${username}.${username}.t.me`));
    assertEquals(getUsername("https://telegram.me/" + username), username);
    assertEquals(getUsername("https://telegram.me/" + username + "/a"), username);
    assertEquals(getUsername("https://telegram.dog/" + username + "/b"), username);
  }

  for (const username of invalidUsernames) {
    assertThrows(() => getUsername(username), username);
    assertThrows(() => getUsername("@" + username), username);
    assertThrows(() => getUsername("https://t.me/" + username), username);
    assertThrows(() => getUsername(`https://${username}.t.me`), username);
    assertThrows(() => getUsername("https://telegram.me/" + username), username);
    assertThrows(() => getUsername("https://telegram.dog/" + username), username);
  }
});

Deno.test("match", () => {
  assert(match("message", { message: {} }));
  assert(match("connectionState", { connectionState: {} }));
  assert(!match("message", { editedMessage: {} }));
  assert(match(":text", { editedMessage: { text: {} } }));
  assert(match(":text", { message: { text: {} } }));
  assert(match("message:text", { message: { text: {} } }));
  assert(!match("editedMessage:text", { message: { text: {} } }));
  assert(!match("callbackQuery:inlineMessageId", { callbackQuery: { message: {} } }));
  assert(!match("callbackQuery:message", { callbackQuery: { inlineMessageId: {} } }));
  assert(match("callbackQuery:inlineMessageId", { callbackQuery: { inlineMessageId: {} } }));
  assert(match("callbackQuery:message", { callbackQuery: { message: {} } }));
  assert(!match("chosenInlineResult:inlineMessageId", { chosenInlineResult: {} }));
  assert(match("chosenInlineResult:inlineMessageId", { chosenInlineResult: { inlineMessageId: {} } }));
});
