![PromptSafe](https://i.imgur.com/a41Ht6V.png)

<div align="center">
  <a href="https://github.com/GPTSafe/PromptSafe/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/GPTSafe/PromptSafe/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue" /></a>
    <a href="https://www.npmjs.com/package/promptsafe"><img src="https://img.shields.io/npm/v/promptsafe" /></a>
  <br />
  <br />
</div>

## What is PromptSafe?
PromptSafe prevents GPT prompt attacks in Node.js and TypeScript backend applications.

PromptSafe is still in a very early state. You can stay updated with new releases by clicking **watch** -> **custom** -> **releases** in the top right corner.

## Project Goals
The goal of the PromptSafe project is to provide comprehensive sanitization and validation for potentially unsafe GPT prompts and inputs. 

## Usage
Install 
```sh
npm install promptsafe
```
Configure (see `src/index.ts` for full configuration options)
```js
import { PromptSafe } from "promptsafe"

const promptSafe = new PromptSafe({
  maxTokens: 200,
  escapeInput: true,
  normalization: { normalizeUnicode: true, removeNewLineCharacters: true },
  encodeOutput: true,
});
```
Usage
```js
const output = await promptSafe.process("foo bar baz")
```