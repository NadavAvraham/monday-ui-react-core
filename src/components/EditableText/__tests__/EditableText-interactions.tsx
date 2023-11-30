import { expect } from "@storybook/jest";
import {
  Canvas,
  clearText,
  clickElement,
  getByTestId,
  getByRole,
  interactionSuite,
  typeText
} from "../../../tests/interactions-utils";

import { ComponentDefaultTestId } from "../../../tests/constants";
import { resetFocus } from "../../../__tests__/interactions-helper";

const text = "This text is an editable text";

function getComponent(canvas: Canvas) {
  return getByTestId(canvas, ComponentDefaultTestId.EDITABLE_TEXT);
}

function getInput(canvas: Canvas) {
  return getByRole(canvas, "input");
}

async function changeModes(canvas: Canvas) {
  const compponent = getComponent(canvas);
  clickElement(compponent);

  const input = getInput(canvas);
  expect(input).toHaveAttribute("value", text);

  await resetFocus();
  const textElement = getComponent(canvas);
  expect(textElement).toHaveTextContent(text);
}

async function editAndChangeToValidText(canvas: Canvas) {
  const compponent = getComponent(canvas);
  clickElement(compponent);

  const input = getInput(canvas);
  await clearText(input);
  await typeText(input, text);
  expect(input).toHaveAttribute("value", text);

  await resetFocus();
  const textElement = getComponent(canvas);
  expect(textElement).toHaveTextContent(text);
}

async function clearInput(canvas: Canvas) {
  const compponent = getComponent(canvas);
  clickElement(compponent);

  const input = getInput(canvas);
  await clearText(input);

  await resetFocus();
  const textElement = getComponent(canvas);
  expect(textElement).toHaveTextContent(text);
}

async function cancelEditing(canvas: Canvas) {
  const compponent = getComponent(canvas);
  clickElement(compponent);

  const input = getInput(canvas);
  await clearText(input);

  const textToChange = "test";
  await typeText(input, textToChange);
  expect(input).toHaveAttribute("value", textToChange);

  await typeText(input, "{Escape}");

  const textElement = getComponent(canvas);
  expect(textElement).toHaveTextContent(text);
}

export const overviewPlaySuite = interactionSuite({
  tests: [changeModes, editAndChangeToValidText, clearInput, cancelEditing]
});