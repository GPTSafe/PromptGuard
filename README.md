![PromptGuard](https://i.imgur.com/AHnNmDW.png)

<div align="center">
  <a href="https://github.com/GPTSafe/PromptGuard/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/GPTSafe/PromptGuard/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue" /></a>
    <a href="https://www.npmjs.com/package/@gptsafe/promptguard"><img src="https://img.shields.io/npm/v/@gptsafe/promptguard" /></a>
  <br />
  <br />
</div>

## What is PromptGuard?
PromptGuard prevents GPT prompt attacks in Node.js and TypeScript backend applications.

PromptGuard is still in a very early state. You can stay updated with new releases by clicking **watch** -> **custom** -> **releases** in the top right corner.

## Project Goals
The goal of the PromptGuard project is to provide comprehensive sanitization and validation for potentially unsafe GPT prompts and inputs. 

## Usage
Install 
```sh
npm install promptsafe
```
Configure (see `src/index.ts` for full configuration options)
```js
import { PromptGuard } from "promptsafe"

const promptSafe = new PromptGuard({
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