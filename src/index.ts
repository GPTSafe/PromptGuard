#!/usr/bin/env ts-node
import {
  promptContainsDenyListItems,
  countPromptTokens,
  encodePromptOutput,
  promptContainsKnownAttack
} from './utils';

enum FAILURE_REASON {
  DENY_LIST = 'CONTAINS_DENY_LIST_ITEM',
  MAX_TOKEN_THRESHOLD = 'EXCEEDS_MAX_TOKEN_THRESHOLD',
  KNOWN_ATTACK = 'CONTAINS_KNOWN_ATTACK'
}

type UserPolicyOptions = {
  maxTokens?: number;
  denyList?: string[];
  ignoreDefaultDenyList?: boolean;
  encodeOutput?: boolean;
};

interface PromptGuardPolicy {
  maxTokens: number; // 1 token is ~4 characters in english
  denyList: string[]; // this should be a fuzzy match
  disableAttackMitigation: boolean;
  encodeOutput: boolean; // uses byte pair encoding to turn text into a series of integers
}

type PromptOutput = {
  pass: boolean; // false if processing fails validation rules (max tokens, deny list, allow list)
  output: string | number[]; // provide the processed prompt or failure reason
};

export class PromptGuard {
  promptGuardPolicy: PromptGuardPolicy;

  constructor(userPolicyOptions: UserPolicyOptions = {}) {
    const defaultPromptGuardPolicy: PromptGuardPolicy = {
      maxTokens: 4096,
      denyList: [''],
      disableAttackMitigation: false,
      encodeOutput: false
    };

    // merge the user policy with the default policy to create the policy
    this.promptGuardPolicy = {
      ...defaultPromptGuardPolicy,
      ...userPolicyOptions
    };
  }

  async process(prompt: string): Promise<PromptOutput> {
    // processing order
    // normalize -> quote -> escape -> check tokens -> check cache -> check for known attacks -> check allow list -> check deny list -> encode output

    // check the prompt token count
    if (countPromptTokens(prompt) > this.promptGuardPolicy.maxTokens)
      return { pass: false, output: FAILURE_REASON.MAX_TOKEN_THRESHOLD };

    // check prompt against known prompt attacks
    if (!this.promptGuardPolicy.disableAttackMitigation) {
      if (await promptContainsKnownAttack(prompt))
        return { pass: false, output: FAILURE_REASON.KNOWN_ATTACK };
    }

    // check prompt again the user defined deny list
    if (
      await promptContainsDenyListItems(prompt, this.promptGuardPolicy.denyList)
    )
      return { pass: false, output: FAILURE_REASON.DENY_LIST };

    // encode the prompt output if encodeOutput is set by the user
    if (this.promptGuardPolicy.encodeOutput)
      prompt = encodePromptOutput(prompt);

    return { pass: true, output: prompt };
  }
}
