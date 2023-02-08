#!/usr/bin/env ts-node
import {
  promptContainsDenyListItems,
  countPromptTokens,
  encodePromptOutput,
  promptContainsKnownAttack,
} from "./utils";

enum FAILURE_REASON {
  DENY_LIST = "Failed deny list validation",
  MAX_TOKEN_THRESHOLD = "Failed max token threshold",
  KNOWN_ATTACK = "Failed known attack validation",
}

type UserPolicyOptions = {
  maxTokens?: number; // 1 token is ~4 characters in english
  denyList?: string[]; // this should be a fuzzy match
  ignoreDefaultDenyList?: boolean;
  encodeOutput?: boolean; // uses byte pair encoding to turn text into a series of integers
};

interface PromptGuardPolicy {
  maxTokens: number; // 1 token is ~4 characters in english
  denyList: string[]; // this should be a fuzzy match
  ignoreAttackMitigation: boolean;
  encodeOutput: boolean; // uses byte pair encoding to turn text into a series of integers
}

type PromptOutput = {
  pass: boolean; // false if processing fails validation rules (max tokens, deny list, allow list)
  output: string | number[]; // provide the processed prompt or failure reason
};

export class PromptGuard {
  PromptGuardPolicy: PromptGuardPolicy;

  constructor(userPolicyOptions: UserPolicyOptions = {}) {
    const defaultPromptGuardPolicy: PromptGuardPolicy = {
      maxTokens: 4096,
      denyList: [""],
      ignoreAttackMitigation: false,
      encodeOutput: false,
    };

    // merge the user policy with the default policy to create the policy
    this.PromptGuardPolicy = {
      ...defaultPromptGuardPolicy,
      ...userPolicyOptions,
    };
  }

  async process(prompt: string): Promise<PromptOutput> {
    // processing order
    // normalize -> quote -> escape -> check tokens -> check allow list -> check deny list -> encode output

    // check the prompt token count
    if (countPromptTokens(prompt) > this.PromptGuardPolicy.maxTokens)
      return { pass: false, output: FAILURE_REASON.MAX_TOKEN_THRESHOLD };

    // check prompt against known prompt attacks
    if (await promptContainsKnownAttack(prompt))
      return { pass: false, output: FAILURE_REASON.KNOWN_ATTACK };

    // check prompt again the user defined deny list
    if (
      await promptContainsDenyListItems(prompt, this.PromptGuardPolicy.denyList)
    )
      return { pass: false, output: FAILURE_REASON.DENY_LIST };

    // encode the prompt output if encodeOutput is set by the user
    if (this.PromptGuardPolicy.encodeOutput)
      prompt = encodePromptOutput(prompt);

    console.log(prompt);

    return { pass: true, output: prompt };
  }
}
