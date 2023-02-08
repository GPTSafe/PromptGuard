![PromptGuard](https://i.imgur.com/AHnNmDW.png)

<div align="center">
  <a href="https://github.com/GPTSafe/PromptGuard/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/GPTSafe/PromptGuard/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue" /></a>
    <a href="https://www.npmjs.com/package/@gptsafe/promptguard"><img src="https://img.shields.io/npm/v/@gptsafe/promptguard" /></a>
  <br />
  <br />
</div>

## What is PromptGuard?
PromptGuard helps you build production ready GPT apps for Node.js and TypeScript applications.

## Project Goals
The goal of the PromptGuard project is to provide the features necessary to deploy GPT-based applications to production. This includes:

* Detecting and mitigating prompt attacks
* Caching to improve performance and reduce the cost of GPT queries 
* Content filtering
* Language filtering
* Token limiting
* GPT ready encoded outputs
* Prompt Obfuscation

PromptGuard is still a fairly young project and would love your contributions. If you wish to contribute, please read the [contribution guide](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md) first. 

Feature requests and bug reports are welcome!
## Configuration Options

Option | Default Value | Description
---|:---:|---|
maxTokens | `4096` | The maximum amount of tokens the prompt can contain. Restricting the maximum amount of tokens can reduce the cost of the GPT query and the opportunity for prompt attacks. You can read more information about tokens [here](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them). <br /> <br /> If the prompt exceeds the maximum tokens, PromptGuard will reject the prompt with the following output: <br />`{ pass: false, output: Failed max token threshold }`
denyList | `[""]` | An array of string literals that should not appear in the prompt text. If PromptGuard finds a deny list match, it will reject with the following output: <br />`{ pass: false, output: Failed deny list validation }`
ignoreDefaultDenyList | `false` | The default deny list contains a list of known prompt attacks and injections that are checked against the prompt. In the future, this will become more sophisticated. <br /><br />If PromptGuard finds a default deny list match, it will reject the prompt with the following output:<br /> `{ pass: false, output: Failed deny list validation }`
encodeOutput | `false` | Encodes the output as GPT-3 tokens. You can read more information about tokens [here](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them).

## Usage
Install 
```sh
npm install @gtpsafe/promptguard
```
Configure
```js
import { PromptGuard } from "@gtpsafe/promptguard"

const promptGuard = new PromptGuard({
  maxTokens: 200,
  denyList:['baz'],
});
```
Process a Prompt
```js
const output = await promptGuard.process("This is my awesome prompt. There are many like it, but this one is mine.")
```
Output 
```js
{
  pass: true,
  output: "This is my awesome prompt. There are many like it, but this one is mine."
}