#!/usr/bin/env ts-node
import * as helper from "./helpers";

enum Case {
  Lower,
  Upper,
  Sentence,
}

type Normalization = {
  normalizeUnicode?: boolean; // Unicode Normalization Form of the string
  removeAllUnicode?: boolean;
  removeNewLineCharacters?: boolean; // remove instances of "/n", "/r", "/r/n"
  setCase?: Case;
};

type Options = {
  maxTokens?: number; // 1 token is ~4 characters in english
  quoteInput?: boolean;
  escapeInput?: boolean;
  allowList?: string[]; // this should be a strict match
  denyList?: string[]; // this should be a fuzzy match
  ignoreDefaultDenyList?: boolean;
  normalization?: Normalization;
  encodeOutput?: boolean; // uses byte pair encoding to turn text into a series of integers
};

type PromptOutput = {
  pass: boolean; // false if processing fails validation rules (max tokens, deny list, allow list)
  output?: string; // provide the processed prompt
  reason?: string; // provide the reason if the processing fails validation rules
};

export class PromptGuard {
  options?: Options;

  constructor(
    options: Options = {
      maxTokens: 100,
      quoteInput: true,
      escapeInput: false,
      normalization: {
        normalizeUnicode: true,
        removeAllUnicode: false,
        removeNewLineCharacters: true,
      },
      encodeOutput: false,
    }
  ) {
    if (!options?.ignoreDefaultDenyList) options.ignoreDefaultDenyList = false;
    if (!options?.denyList) options.denyList = [""];

    this.options = options;
  }

  async process(prompt: string): Promise<PromptOutput> {
    // processing order
    // normalize -> quote -> escape -> check tokens -> check allow list -> check deny list -> encode output

    if (this.options?.denyList) {
      if (typeof this.options?.ignoreDefaultDenyList === "boolean") {
        if (
          await helper.containsDenyListItems(
            prompt,
            this.options.denyList,
            this.options.ignoreDefaultDenyList
          )
        )
          return { pass: false, reason: "Deny list" };
      }
    }

    return { pass: true, output: prompt };
  }
}
