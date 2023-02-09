#!/usr/bin/env ts-node
import {
  countPromptTokens,
  promptContainsKnownAttack,
  promptContainsLanguages,
  promptContainsDenyListItems,
  encodePromptOutput
} from './utils';

enum FAILURE_REASON {
  DENY_LIST = 'CONTAINS_DENY_LIST_ITEM',
  MAX_TOKEN_THRESHOLD = 'EXCEEDS_MAX_TOKEN_THRESHOLD',
  KNOWN_ATTACK = 'CONTAINS_KNOWN_ATTACK',
  LANGUAGE_VALIDATION = 'FAILED_LANGUAGE_VALIDATION'
}

type UserPolicyOptions = {
  maxTokens?: number;
  denyList?: string[];
  ignoreDefaultDenyList?: boolean;
  allowedLanguages?: string[];
  deniedLanguages?: string[];
  encodeOutput?: boolean;
};

interface PromptGuardPolicy {
  maxTokens: number; // 1 token is ~4 characters in english
  denyList: string[]; // this should use a fuzzy match but doesn't currently
  disableAttackMitigation: boolean;
  allowedLanguages: string[];
  deniedLanguages: string[];
  encodeOutput: boolean; // uses byte pair encoding to turn text into a series of integers
}

type PromptOutput = {
  pass: boolean; // false if processing fails validation rules
  output: string | number[]; // provide the processed prompt or failure reason
};

export class PromptGuard {
  policy: PromptGuardPolicy;

  constructor(userPolicyOptions: UserPolicyOptions = {}) {
    const defaultPromptGuardPolicy: PromptGuardPolicy = {
      maxTokens: 4096,
      denyList: [''],
      disableAttackMitigation: false,
      allowedLanguages: [''],
      deniedLanguages: [''],
      encodeOutput: false
    };

    // TODO validate the languages against the list of ISO 639-3 supported languages
    // TODO validate that the allowed and denied language lists don't contain the same languages

    // merge the user policy with the default policy to create the policy
    this.policy = {
      ...defaultPromptGuardPolicy,
      ...userPolicyOptions
    };
  }

  async process(prompt: string): Promise<PromptOutput> {
    // processing order
    // check tokens ->  check allowed languages -> check denied languages ->
    // check for known attacks ->  check deny list -> encode output

    // check the prompt token count
    if (countPromptTokens(prompt) > this.policy.maxTokens)
      return { pass: false, output: FAILURE_REASON.MAX_TOKEN_THRESHOLD };

    // check for the presence of allowed languages
    // the prompt must be at least 10 characters long to reasonably expect to detect the language
    if (prompt.length > 10) {
      const allowedLanguages = this.policy.allowedLanguages;
      const deniedLanguages = this.policy.deniedLanguages;

      if (allowedLanguages[0] !== '') {
        if (await !promptContainsLanguages(prompt, allowedLanguages))
          return { pass: false, output: FAILURE_REASON.LANGUAGE_VALIDATION };
      }
      if (deniedLanguages[0] !== '') {
        if (await promptContainsLanguages(prompt, deniedLanguages))
          return { pass: false, output: FAILURE_REASON.LANGUAGE_VALIDATION };
      }
    }

    // check for the presence of denied languages

    // check prompt against known prompt attacks
    if (!this.policy.disableAttackMitigation) {
      if (await promptContainsKnownAttack(prompt))
        return { pass: false, output: FAILURE_REASON.KNOWN_ATTACK };
    }

    // check prompt again the user defined deny list
    if (
      await promptContainsDenyListItems(prompt, this.policy.denyList)
    )
      return { pass: false, output: FAILURE_REASON.DENY_LIST };

    // encode the prompt output if encodeOutput is set by the user
    if (this.policy.encodeOutput)
      prompt = encodePromptOutput(prompt);

    return { pass: true, output: prompt };
  }
}
